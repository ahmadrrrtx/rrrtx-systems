import type { Metadata } from "next";
import { db } from "@/lib/db";
import { contentPages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for RRRTX SYSTEMS. Learn how we collect, use, and protect your data when you use our custom ecommerce and AI automation services.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | RRRTX SYSTEMS",
    description: "How RRRTX SYSTEMS collects, uses, and protects your data.",
    url: "/privacy",
  },
};

export default async function PrivacyPage() {
  const rows = await db.select().from(contentPages).where(eq(contentPages.slug, "privacy")).limit(1);
  const page = rows[0];

  const fallbackTitle = "Privacy Policy";
  const fallbackContent =
    "<p>RRRTX SYSTEMS respects your privacy. We collect information you provide via contact forms and analytics to improve our services. We do not sell your data.</p><p>For questions, contact us through the site.</p>";

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
