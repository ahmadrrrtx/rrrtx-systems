// RRRTX Partner Network — template-based document generation.
//
// Uses the uploaded official artwork (certificate / joining letter / agreement)
// as the EXACT master background (kept 100% unchanged) and overlays only the
// dynamic fields listed in TEMPLATE_SPEC. Positions are calibrated against the
// official templates (in template pixel space); the PDF page is the template's
// native size in points, with a 2x-rasterized background for crisp printing and
// vector text on top.
//
// ⚠️ Field coordinates are hand-calibrated to the uploaded masters. If a
// template file is swapped, re-check TEMPLATE_SPEC below.

import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkitImport from "@pdf-lib/fontkit";
import QRCode from "qrcode";

// Interop: the ESM build exposes fontkit as the default export; the CJS/UMD
// build exposes it directly (no `.default`).
const fontkit = (((fontkitImport as unknown as { default?: unknown }).default ?? fontkitImport) as unknown) as {
  create: (data: Uint8Array) => unknown;
};

export type TemplateType = "certificate" | "joining_letter" | "agreement";

export interface TemplateFields {
  name: string; // full legal name
  firstName?: string; // for "Dear {firstName},"
  country?: string;
  rankLabel?: string; // e.g. "Bronze"
  partnerId?: string; // e.g. "RRRTX-A7K29"
  issueDate?: string; // human-formatted, e.g. "September 03, 2026"
  documentId?: string; // certificate / letter document id
  acceptanceRecordId?: string; // agreement acceptance record id
  verificationUrl?: string; // embedded in the certificate QR
}

interface TextField {
  x: number; // left (or center when centered)
  baseline: number; // baseline from top
  size: number;
  font: "sans" | "serif";
  color: [number, number, number];
  centered?: boolean;
  cover?: { x: number; y: number; w: number; h: number; color: [number, number, number] };
}

interface QrField {
  cover: { x: number; y: number; w: number; h: number; color: [number, number, number] };
  x: number;
  y: number;
  size: number;
}

interface TemplateSpec {
  file: string; // under public/assets/templates
  width: number;
  height: number;
  fields: Record<string, TextField>;
  qr?: QrField;
}

const SPEC: Record<TemplateType, TemplateSpec> = {
  certificate: {
    file: "certificate.png",
    width: 515,
    height: 816,
    fields: {
      name: {
        x: 257.5, baseline: 332, size: 30, font: "serif", color: [0, 0, 10], centered: true,
        cover: { x: 96, y: 290, w: 323, h: 54, color: [247, 247, 251] },
      },
      documentId: {
        x: 236, baseline: 768, size: 7, font: "sans", color: [0, 0, 0],
        cover: { x: 232, y: 756, w: 132, h: 15, color: [250, 250, 252] },
      },
    },
    qr: {
      cover: { x: 333, y: 637, w: 74, h: 74, color: [243, 243, 247] },
      x: 339, y: 643, size: 62,
    },
  },

  joining_letter: {
    file: "joining-letter.png",
    width: 549,
    height: 816,
    fields: {
      name: {
        x: 54, baseline: 210, size: 11.5, font: "sans", color: [0, 0, 0],
        cover: { x: 48, y: 191, w: 485, h: 25, color: [246, 246, 250] },
      },
      country: {
        x: 54, baseline: 227, size: 9, font: "sans", color: [0, 0, 0],
        cover: { x: 48, y: 213, w: 485, h: 18, color: [246, 246, 250] },
      },
      firstName: {
        x: 79, baseline: 261, size: 8.5, font: "sans", color: [0, 0, 0],
        cover: { x: 76, y: 249, w: 460, h: 18, color: [246, 246, 250] },
      },
      partnerId: {
        x: 95, baseline: 481, size: 8, font: "sans", color: [0, 0, 0],
        cover: { x: 89, y: 466, w: 285, h: 19, color: [246, 246, 250] },
      },
      rank: {
        x: 95, baseline: 519, size: 9, font: "sans", color: [0, 0, 0],
        cover: { x: 89, y: 503, w: 285, h: 22, color: [246, 246, 250] },
      },
      issueDate: {
        x: 95, baseline: 596, size: 11, font: "sans", color: [0, 0, 0],
        cover: { x: 89, y: 578, w: 285, h: 22, color: [246, 246, 250] },
      },
    },
  },

  agreement: {
    file: "agreement.png",
    width: 474,
    height: 816,
    fields: {
      effectiveDate: {
        x: 188, baseline: 165, size: 11, font: "sans", color: [255, 255, 255],
        cover: { x: 184, y: 148, w: 138, h: 20, color: [2, 6, 14] },
      },
      name: {
        x: 35, baseline: 682, size: 8, font: "sans", color: [199, 199, 203],
        cover: { x: 30, y: 666, w: 185, h: 21, color: [4, 10, 18] },
      },
      acceptanceDate: {
        x: 265, baseline: 683, size: 8, font: "sans", color: [199, 199, 203],
        cover: { x: 258, y: 666, w: 165, h: 21, color: [5, 11, 18] },
      },
      acceptanceRecordId: {
        x: 351, baseline: 794, size: 8, font: "sans", color: [140, 141, 150],
        cover: { x: 344, y: 779, w: 107, h: 19, color: [0, 4, 10] },
      },
    },
  },
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatIssueDate(value: Date | string | number | null | undefined): string {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return formatIssueDate(new Date());
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

let fontCache: { sans?: Uint8Array; serif?: Uint8Array } | null = null;
const imageCache: Partial<Record<TemplateType, Uint8Array>> = {};

async function loadFont(kind: "sans" | "serif"): Promise<Uint8Array> {
  if (!fontCache) fontCache = {};
  if (!fontCache[kind]) {
    const file = kind === "serif" ? "DejaVuSerif.ttf" : "DejaVuSans.ttf";
    fontCache[kind] = await fs.readFile(path.join(process.cwd(), "public", "fonts", file));
  }
  return fontCache[kind]!;
}

async function loadTemplate(type: TemplateType): Promise<Uint8Array> {
  if (!imageCache[type]) {
    imageCache[type] = await fs.readFile(path.join(process.cwd(), "public", "assets", "templates", SPEC[type].file));
  }
  return imageCache[type]!;
}

async function qrPng(url: string): Promise<Uint8Array> {
  const dataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 256,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff00" },
  });
  const b64 = dataUrl.split(",")[1];
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

/** Build the personalized, print-ready PDF for a partner document. */
export async function buildTemplatePdf(type: TemplateType, fields: TemplateFields): Promise<Uint8Array> {
  const spec = SPEC[type];
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit as never);
  const page = doc.addPage([spec.width, spec.height]);

  // 1) Exact master background (100% unchanged artwork).
  const bg = await loadTemplate(type);
  const bgImage = await doc.embedPng(bg);
  page.drawImage(bgImage, { x: 0, y: 0, width: spec.width, height: spec.height });

  // 2) Fonts.
  const sans = await doc.embedFont(await loadFont("sans"));
  const serif = await doc.embedFont(await loadFont("serif"));

  // 3) Dynamic text fields (cover sample text, then draw).
  for (const [key, f] of Object.entries(spec.fields)) {
    const value = fieldValue(key, fields);
    if (!value) continue;
    const font = f.font === "serif" ? serif : sans;

    if (f.cover) {
      const c = f.cover;
      page.drawRectangle({
        x: c.x,
        y: spec.height - c.y - c.h,
        width: c.w,
        height: c.h,
        color: rgb(c.color[0] / 255, c.color[1] / 255, c.color[2] / 255),
      });
    }

    let drawX = f.x;
    if (f.centered) {
      const w = font.widthOfTextAtSize(value, f.size);
      drawX = f.x - w / 2;
    }
    page.drawText(value, {
      x: drawX,
      y: spec.height - f.baseline,
      size: f.size,
      font,
      color: rgb(f.color[0] / 255, f.color[1] / 255, f.color[2] / 255),
    });
  }

  // 4) QR code — only where the template reserves an area.
  if (spec.qr && fields.verificationUrl) {
    const q = spec.qr;
    page.drawRectangle({
      x: q.cover.x,
      y: spec.height - q.cover.y - q.cover.h,
      width: q.cover.w,
      height: q.cover.h,
      color: rgb(q.cover.color[0] / 255, q.cover.color[1] / 255, q.cover.color[2] / 255),
    });
    const qr = await doc.embedPng(await qrPng(fields.verificationUrl));
    page.drawImage(qr, { x: q.x, y: spec.height - q.y - q.size, width: q.size, height: q.size });
  }

  const bytes = await doc.save();
  return Uint8Array.from(bytes);
}

function fieldValue(key: string, fields: TemplateFields): string | undefined {
  switch (key) {
    case "name": return fields.name;
    case "firstName": return fields.firstName ? `${fields.firstName},` : undefined;
    case "country": return fields.country;
    case "rank": return fields.rankLabel ? `${fields.rankLabel} Partner` : undefined;
    case "partnerId": return fields.partnerId;
    case "issueDate": return fields.issueDate;
    case "effectiveDate": return fields.issueDate;
    case "acceptanceDate": return fields.issueDate;
    case "documentId": return fields.documentId;
    case "acceptanceRecordId": return fields.acceptanceRecordId;
    default: return undefined;
  }
}

export const TEMPLATE_SPEC = SPEC;
