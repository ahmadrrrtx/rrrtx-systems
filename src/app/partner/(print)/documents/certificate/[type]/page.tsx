// Partnership & Achievement Certificates — print-optimized, light canvas with
// ornamental border, seal, and QR verification (mirrors the official template).

import Image from "next/image";
import { notFound } from "next/navigation";
import { getPartnerSession } from "@/lib/partner-session";
import { getPartnerById, getPartnerDocuments } from "@/lib/partner-data";
import { qrDataUrl } from "@/lib/partner-documents";

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (type !== "partnership" && type !== "achievement") notFound();

  const session = await getPartnerSession();
  if (!session) return null;
  const partner = await getPartnerById(session.partnerId);
  if (!partner) return null;

  const targetType = type === "partnership" ? "partnership_certificate" : "achievement_certificate";
  const docs = await getPartnerDocuments(session.partnerId);
  const cert = docs.find((d) => d.type === targetType && d.status === "valid");

  if (!cert) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800/60 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        This certificate has not been issued yet.
      </div>
    );
  }

  let snap: { partnerName?: string; rankLabel?: string; issueDate?: string; documentId?: string; verificationUrl?: string } = {};
  try {
    snap = cert.snapshot ? JSON.parse(cert.snapshot) : {};
  } catch {
    snap = {};
  }
  const qr = await qrDataUrl(snap.verificationUrl || `https://rrrtx-systems.com/verify/${cert.documentId}`);
  const heading = type === "partnership" ? "Certificate of Partnership" : "Certificate of Achievement";
  const subheading = type === "partnership" ? "This certifies that" : "This certifies that";

  return (
    <div className="mx-auto max-w-3xl bg-white text-slate-900 shadow-2xl rounded-md overflow-hidden print:shadow-none print:rounded-none">
      {/* Ornamental frame */}
      <div className="p-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 print:p-2">
        <div className="border border-white/70 px-6 py-10 sm:px-12 print:border-slate-300">
          <header className="flex items-center justify-center gap-3 mb-8">
            <div className="relative w-12 h-12">
              <Image src="/assets/rrrtx-logo.png" alt="" fill sizes="48px" className="object-contain" />
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none text-center">RRRTX</p>
              <p className="text-[10px] tracking-[0.4em] text-slate-500 uppercase font-semibold mt-1 text-center">Systems</p>
            </div>
          </header>

          <p className="text-center text-[11px] uppercase tracking-[0.35em] text-cyan-600 font-semibold mb-2">RRRTX Partner Network</p>
          <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">{heading}</h1>

          <p className="text-center text-sm text-slate-500 mb-10">{subheading}</p>

          <p className="text-center text-2xl font-bold text-slate-900 mb-2">{snap.partnerName || partner.name}</p>
          <p className="text-center text-xs text-slate-500 mb-10">Partner ID: <span className="font-mono">{partner.partnerId}</span></p>

          {type === "achievement" && (
            <div className="flex justify-center mb-10">
              <span className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold uppercase tracking-[0.2em]">
                {snap.rankLabel || "Partner"}
              </span>
            </div>
          )}

          <div className="flex items-end justify-between mb-4">
            <div className="text-center">
              <div className="mb-10 h-10 w-10 mx-auto rounded-full border-2 border-slate-300 flex items-center justify-center text-[9px] uppercase tracking-wider text-slate-400 font-bold">Seal</div>
              <div className="border-t border-slate-300 pt-2 w-56">
                <p className="text-sm font-semibold text-slate-900">Authorized Representative</p>
                <p className="text-xs text-slate-500">RRRTX Systems</p>
              </div>
            </div>
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt={`Verification QR for ${cert.documentId}`} className="w-24 h-24 mb-2" />
              <p className="text-[10px] text-slate-500 max-w-[7rem] leading-snug">Scan to verify</p>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-6 pt-4 flex items-center justify-between text-[10px] text-slate-400">
            <p>Issued {snap.issueDate || (cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "")}</p>
            <p className="font-mono">{cert.documentId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
