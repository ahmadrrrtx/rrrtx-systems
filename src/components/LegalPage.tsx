import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/**
 * Shared shell for legal pages.
 *
 * Markup and classes are deliberately identical to the pre-existing
 * /privacy and /terms implementation so the visual design is unchanged.
 * Content may come from the CMS, falling back to the maintained copy in
 * src/lib/legal-content.ts when no row exists.
 */
export function LegalPage({
  title,
  cmsContent,
  fallbackContent,
}: {
  title: string;
  cmsContent?: string | null;
  fallbackContent: string;
}) {
  const safeContent = sanitizeHtml(cmsContent || fallbackContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h2", "h3"]),
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    // merge=true keeps the existing href and adds a safe rel to every anchor,
    // so CMS-authored links cannot introduce a reverse-tabnabbing vector.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });

  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
          <div
            className="legal-content text-slate-300 text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
