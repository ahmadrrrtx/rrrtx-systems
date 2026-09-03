// Partner Appointment / Joining Letter — print-optimized, high-fidelity to the
// official light letterhead template (white canvas, navy ink, cyan accent).

import Image from "next/image";
import { getPartnerSession } from "@/lib/partner-session";
import { getPartnerById, getPartnerDocuments } from "@/lib/partner-data";
import { qrDataUrl } from "@/lib/partner-documents";
import { rankLabel } from "@/lib/partner-constants";

export const dynamic = "force-dynamic";

export default async function JoiningLetterPage() {
  const session = await getPartnerSession();
  if (!session) return null;
  const partner = await getPartnerById(session.partnerId);
  const docs = await getPartnerDocuments(session.partnerId);
  const letter = docs.find((d) => d.type === "joining_letter" && d.status === "valid");

  if (!partner || !letter) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800/60 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Your Joining Letter is issued once onboarding is complete. Check back shortly.
      </div>
    );
  }

  let snap: { partnerName?: string; rankLabel?: string; commissionRate?: number; issueDate?: string; documentId?: string; verificationUrl?: string } = {};
  try {
    snap = letter.snapshot ? JSON.parse(letter.snapshot) : {};
  } catch {
    snap = {};
  }
  const qr = await qrDataUrl(snap.verificationUrl || `https://rrrtx-systems.com/verify/${letter.documentId}`);

  return (
    <div className="mx-auto max-w-3xl bg-white text-slate-900 shadow-2xl rounded-md overflow-hidden print:shadow-none print:rounded-none">
      {/* Letterhead */}
      <header className="border-b-2 border-slate-900/90 px-10 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <Image src="/assets/rrrtx-logo.png" alt="" fill sizes="56px" className="object-contain" />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">RRRTX</p>
              <p className="text-[10px] tracking-[0.35em] text-slate-500 uppercase font-semibold mt-1">Systems</p>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500 leading-relaxed">
            <p>rrrtx-systems.com</p>
            <p>contact@rrrtx-systems.com</p>
          </div>
        </div>
        <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" aria-hidden="true" />
      </header>

      <main className="px-10 py-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-semibold mb-6">Partner Appointment Letter</p>

        <p className="text-xs text-slate-500 mb-1">Ref: {letter.documentId}</p>
        <p className="text-xs text-slate-500 mb-8">Date: {snap.issueDate || (letter.issueDate ? new Date(letter.issueDate).toLocaleDateString() : "")}</p>

        <p className="text-sm text-slate-700 mb-6">Dear {snap.partnerName || partner.name},</p>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          We are pleased to confirm your appointment as a <strong>Partner in the RRRTX Partner Network</strong>. Your application has been reviewed and approved, and your participation is effective from the date above.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          As an approved Partner you may introduce prospective clients to RRRTX Systems for qualifying engagements, including custom ecommerce systems, AI automations and agents, lead-generation systems, website rebuilds, chatbots and AI assistants, and SEO/AEO work. Commission on qualifying, paid projects is calculated in accordance with the RRRTX Partner Network Agreement you accepted.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mb-6">
          This letter is issued together with your Partnership Certificate. You represent RRRTX professionally at all times and have no authority to bind RRRTX, quote prices, or deliver work on our behalf.
        </p>

        {/* Partner details */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-5 mb-8">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Partner ID", partner.partnerId],
                ["Partner name", snap.partnerName || partner.name],
                ["Rank", snap.rankLabel || rankLabel(partner.rank)],
                ["Commission rate", `${Math.round((snap.commissionRate ?? partner.commissionRate) * 100)}%`],
                ["Agreement version", "1.0"],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1.5 pr-6 text-slate-500 text-xs uppercase tracking-wider w-44">{k}</td>
                  <td className="py-1.5 font-semibold text-slate-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-10">Welcome to the network. We look forward to building with you.</p>

        {/* Signature */}
        <div className="flex items-end justify-between">
          <div>
            <div className="mb-12 text-sm text-slate-700 italic font-medium">Sincerely,</div>
            <div className="border-t border-slate-300 pt-2 w-64">
              <p className="text-sm font-semibold text-slate-900">Authorized Representative</p>
              <p className="text-xs text-slate-500">RRRTX Systems</p>
            </div>
          </div>
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt={`Verification QR for ${letter.documentId}`} className="w-28 h-28 mb-2" />
            <p className="text-[10px] text-slate-500 max-w-[7rem] leading-snug">Verify at rrrtx-systems.com/verify</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 px-10 py-4 flex items-center justify-between text-[10px] text-slate-400">
        <p>RRRTX SYSTEMS · Partner Network</p>
        <p className="font-mono">{letter.documentId}</p>
      </footer>
    </div>
  );
}
