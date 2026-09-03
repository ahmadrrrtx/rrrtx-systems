"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Download, ExternalLink, FileSignature, FileText, ShieldCheck } from "lucide-react";

interface Doc {
  id: number;
  documentId: string;
  type: string;
  rank: string | null;
  issueDate: string;
  status: string;
  verificationUrl: string;
}

const TYPE_META: Record<string, { label: string; icon: typeof FileText; view: string }> = {
  joining_letter: { label: "Partner Appointment Letter", icon: FileSignature, view: "/partner/documents/joining-letter" },
  partnership_certificate: { label: "Certificate of Partnership", icon: ShieldCheck, view: "/partner/documents/certificate/partnership" },
  achievement_certificate: { label: "Certificate of Achievement", icon: Award, view: "/partner/documents/certificate/achievement" },
};

export default function PartnerDocuments() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/documents");
        if (res.ok) setDocs(await res.json());
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Documents</h1>
        <p className="text-sm text-slate-400">Your official RRRTX partner documents, with QR verification.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
      ) : docs.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500 rounded-xl border border-slate-800/50 bg-slate-950/40">
          Your Joining Letter and Partnership Certificate are issued when onboarding completes.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {docs.map((doc) => {
            const meta = TYPE_META[doc.type] || { label: doc.type, icon: FileText, view: null };
            const Icon = meta.icon;
            return (
              <div key={doc.documentId} className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">{meta.label}</h3>
                    {doc.rank && <p className="text-xs text-slate-500 uppercase tracking-wide">{doc.rank} · {new Date(doc.issueDate).toLocaleDateString()}</p>}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-mono mb-4">{doc.documentId}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {meta.view && (
                    <Link href={meta.view} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" /> View & print
                    </Link>
                  )}
                  <a href={`/api/partner/documents/${doc.documentId}/pdf`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors">
                    <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download PDF
                  </a>
                  <a href={doc.verificationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Verify
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-slate-800/50 bg-slate-950/40 p-5">
        <p className="text-xs text-slate-500 flex-1">
          Your signed Partner Agreement is preserved immutably with its version, timestamp, and integrity hash. It is not editable after signing.
        </p>
        <a href="/api/partner/agreement/pdf" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors shrink-0">
          <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download signed agreement
        </a>
      </div>
    </div>
  );
}
