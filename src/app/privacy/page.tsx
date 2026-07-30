import type { Metadata } from "next";
import { getContentPage } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Learn how RRRTX Systems collects, uses, stores, and protects information submitted through this website.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const page = await getContentPage("privacy");
  const fallbackContent = "<p>RRRTX SYSTEMS respects your privacy. We collect information you provide through forms and limited analytics information to operate and improve our services. We do not sell your personal information.</p><p>Contact us through the website with privacy questions or deletion requests.</p>";
  const safeContent = sanitizeHtml(page?.content || fallbackContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h2", "h3"]),
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
  });

  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />
      <section className="pt-32 pb-24"><div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Home</Link>
        <h1 className="text-3xl font-bold text-white mb-8">{page?.title || "Privacy Policy"}</h1>
        <div className="legal-content text-slate-300 text-sm leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: safeContent }} />
      </div></section>
      <Footer />
    </main>
  );
}
