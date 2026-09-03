// RRRTX Partner Network — document snapshot builders + QR helper.
// These produce the data model for the Joining Letter and Certificates. The
// rendered pages (under /partner/documents/...) are the high-fidelity views.

import QRCode from "qrcode";
import { SITE_URL } from "./site-config";

export interface DocumentSnapshot {
  documentId: string;
  type: "joining_letter" | "partnership_certificate" | "achievement_certificate";
  partnerId: string;
  partnerName: string;
  rank: string;
  rankLabel: string;
  commissionRate: number;
  issueDate: string;
  agreementVersion: string;
  verificationUrl: string;
}

export function buildDocumentSnapshot(
  partner: {
    partnerId: string;
    name: string;
    rank: string;
    commissionRate: number;
  },
  type: DocumentSnapshot["type"],
  rank: string,
  documentId: string
): DocumentSnapshot {
  const rankLabel =
    { starter: "Starter", bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum", elite: "Elite" }[rank] || rank;
  return {
    documentId,
    type,
    partnerId: partner.partnerId,
    partnerName: partner.name,
    rank,
    rankLabel,
    commissionRate: partner.commissionRate,
    issueDate: new Date().toISOString().split("T")[0],
    agreementVersion: "1.0",
    verificationUrl: `${SITE_URL}/verify/${documentId}`,
  };
}

export async function qrDataUrl(text: string, size = 220): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: size,
    errorCorrectionLevel: "M",
    color: { dark: "#0b1020", light: "#ffffff" },
  });
}
