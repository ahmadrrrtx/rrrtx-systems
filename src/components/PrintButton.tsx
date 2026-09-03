"use client";

import { Printer } from "lucide-react";

/** Client-side print trigger — window.print() can only run in the browser. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-950/40 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-600 transition-colors"
    >
      <Printer className="w-4 h-4" aria-hidden="true" /> Print / Save as PDF
    </button>
  );
}
