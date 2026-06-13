import type { Metadata } from "next";
import { getContentPage } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for RRRTX SYSTEMS. Understand the terms for using our custom ecommerce and AI automation services.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | RRRTX SYSTEMS",
    description: "Terms and conditions for using RRRTX SYSTEMS services.",
    url: "/terms",
  },
};

export default async function TermsPage() {
  const page = await getContentPage("terms");

  const fallbackTitle = "Terms of Service";
  const fallbackContent =
    "<p>By using this website and engaging RRRTX SYSTEMS, you agree to the following terms.</p><p>All services are provided on a project or retainer basis with agreed scope and timelines. Payments are handled per the signed proposal.</p><p>Intellectual property is transferred upon final payment unless otherwise agreed.</p><p>For disputes, contact us directly to resolve.</p>";

  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-8">{page?.title || fallbackTitle}</h1>
          <div
            className="text-slate-300 text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: page?.content || fallbackContent }}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
