// Public certificate verification — reveals only verification-safe fields.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck, ShieldX } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { getPublicDocument } from "@/lib/partner-data";
import { rankLabel } from "@/lib/partner-constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Certificate Verification",
  description: "Verify an RRRTX Partner Network certificate.",
  path: "/verify",
  noIndex: true,
});

const TYPE_LABELS: Record<string, string> = {
  joining_letter: "Partner Appointment Letter",
  partnership_certificate: "Certificate of Partnership",
  achievement_certificate: "Certificate of Achievement",
};

export default async function VerifyPage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const doc = await getPublicDocument(certificateId);
  if (!doc) notFound();

  let snapshot: { partnerName?: string; rank?: string; rankLabel?: string; issueDate?: string } = {};
  try {
    snapshot = doc.snapshot ? JSON.parse(doc.snapshot) : {};
  } catch {
    snapshot = {};
  }

  const valid = doc.status === "valid";
  const typeLabel = TYPE_LABELS[doc.type] || "RRRTX Partner Document";

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="premium-card rounded-3xl p-10">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                valid ? "bg-gradient-to-br from-cyan-500 to-blue-600" : "bg-red-500/15 border border-red-500/30"
              }`}
            >
              {valid ? <ShieldCheck className="w-7 h-7 text-white" aria-hidden="true" /> : <ShieldX className="w-7 h-7 text-red-400" aria-hidden="true" />}
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{typeLabel}</h1>
            <p className={`text-sm font-semibold mb-8 ${valid ? "text-cyan-300" : "text-red-400"}`}>
              {valid ? "Valid — verified document" : "Revoked — this document is no longer valid"}
            </p>

            <dl className="space-y-4 text-left">
              {[
                ["Certificate ID", doc.documentId],
                ["Holder", snapshot.partnerName || "—"],
                ["Rank", snapshot.rankLabel || (doc.rank ? rankLabel(doc.rank) : "—")],
                ["Issue date", doc.issueDate ? new Date(doc.issueDate).toLocaleDateString() : "—"],
                ["Status", valid ? "Valid" : "Revoked"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-white/5 pb-3">
                  <dt className="text-sm text-slate-400">{label}</dt>
                  <dd className="text-sm font-medium text-white text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex items-start gap-3 text-xs text-slate-500 text-left">
              <BadgeCheck className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
              <p>This page shows only public verification fields. No contact, financial, or account information is displayed.</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            <Link href="/partners" className="text-cyan-400 hover:text-cyan-300">Learn about the RRRTX Partner Network</Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
