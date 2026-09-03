// Print layout — authenticated, minimal chrome for printable documents.

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { getPartnerSession } from "@/lib/partner-session";

export default async function PrintLayout({ children }: { children: React.ReactNode }) {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  return (
    <main className="min-h-screen bg-[#0a0f1c] print:bg-white">
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#020617]/95 backdrop-blur-xl print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/partner/documents" className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Documents
          </Link>
          <PrintButton />
        </div>
      </div>
      <div className="py-10 print:py-0">{children}</div>
    </main>
  );
}
