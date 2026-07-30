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
  title: "Terms of Service",
  description: "Review the terms that apply to the RRRTX Systems website and professional services engagements.",
  path: "/terms",
});

export default async function TermsPage() {
  const page = await getContentPage("terms");
  const fallbackContent = "<p>By using this website and engaging RRRTX SYSTEMS, you agree to the applicable project agreement and these website terms.</p><p>Professional services are delivered according to an agreed scope, timeline, and payment schedule. Intellectual-property transfer is governed by the signed project agreement.</p><p>Contact us directly with questions or disputes so they can be addressed promptly.</p>";
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
        <h1 className="text-3xl font-bold text-white mb-8">{page?.title || "Terms of Service"}</h1>
        <div className="legal-content text-slate-300 text-sm leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: safeContent }} />
      </div></section>
      <Footer />
    </main>
  );
}
