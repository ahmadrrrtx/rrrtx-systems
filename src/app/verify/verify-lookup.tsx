"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ScanSearch, ShieldCheck } from "lucide-react";

export function VerifyLookup() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = value.trim();
    if (!/^[A-Za-z0-9-]{4,64}$/.test(id)) {
      setError("Enter the certificate ID printed on the document, e.g. RRRTX-CERT-2026-0001.");
      return;
    }
    router.push(`/verify/${encodeURIComponent(id)}`);
  }

  return (
    <section className="pt-36 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="premium-card rounded-3xl p-8 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
            <ScanSearch className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify a Certificate</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            Enter the certificate ID printed on any RRRTX Partner Network document — a Joining Letter, Certificate of Partnership, or Achievement Certificate — to confirm it is genuine.
          </p>

          <form onSubmit={submit} noValidate className="space-y-4">
            <label htmlFor="certificate-id" className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Certificate ID
            </label>
            <input
              id="certificate-id"
              type="text"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError("");
              }}
              placeholder="RRRTX-CERT-2026-0001"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
            {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
            <button
              type="submit"
              className="premium-button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Verify Certificate
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-start gap-3 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
          <p>
            Verification shows only public fields — the document type, holder, rank, issue date, and status. No contact, financial, or account information is ever displayed.
          </p>
        </div>
      </div>
    </section>
  );
}
