import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import { getPublicProjectBySlug } from "@/lib/queries";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { parseMetrics } from "@/lib/content-parsers";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    return createMetadata({ title: "Case Study Not Found", description: "The requested project is not available.", path: `/work/${slug}`, noIndex: true });
  }
  return createMetadata({
    title: `${project.title} — Case Study`,
    description: (project.solution || project.challenge || project.results || `A production system delivered for ${project.clientName || "an RRRTX Systems client"}.`).slice(0, 160),
    path: `/work/${slug}`,
    image: project.imageUrl,
    type: "article",
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  const metrics = parseMetrics(project.metrics);
  const url = absoluteUrl(`/work/${slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#case-study`,
        headline: project.title,
        description: project.solution || project.challenge || project.results || "RRRTX Systems case study",
        image: project.imageUrl ? [absoluteUrl(project.imageUrl)] : undefined,
        datePublished: project.createdAt?.toISOString(),
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id={`schema-case-study-${slug}`} data={schema} />
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 mb-10">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to work
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 mb-4">{project.industry || "Case Study"}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-5">{project.title}</h1>
          <p className="text-lg text-slate-300 mb-10">{project.clientName || "Client project"}</p>

          {project.imageUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 mb-14">
              <SmartImage src={project.imageUrl} alt={`${project.title} project`} priority sizes="(min-width: 1024px) 1024px, 100vw" className="w-full h-full object-cover" />
            </div>
          )}

          {metrics && (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-2">Measured outcome</p>
              <p className="text-xl font-bold text-white">{metrics}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {project.challenge && (
              <section className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-7">
                <h2 className="text-xl font-bold text-white mb-4">The challenge</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{project.challenge}</p>
              </section>
            )}
            {project.solution && (
              <section className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-7">
                <h2 className="text-xl font-bold text-white mb-4">The system</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{project.solution}</p>
              </section>
            )}
          </div>

          {project.results && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-white">The result</h2>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line max-w-3xl">{project.results}</p>
            </section>
          )}

          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-blue-950/30 to-purple-950/30 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Have a system like this to improve?</h2>
            <p className="text-slate-400 mb-6">Start with the problem, constraints, and outcome. We will map the safest next step.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">
              Book a Strategy Call <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
