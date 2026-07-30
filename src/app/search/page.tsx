import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Layers, FolderOpen, Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPublicPosts, getPublicProjects, getPublicResources, getPublicServices } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createMetadata({
  title: "Search",
  description: "Search RRRTX Systems services, case studies, engineering insights, and resources.",
  path: "/search",
  noIndex: true,
});

type SearchResult = { type: string; title: string; description: string; href: string; icon: typeof Search };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = ((await searchParams).q || "").trim().slice(0, 120);
  const normalized = query.toLowerCase();
  const [services, projects, posts, resources] = await Promise.all([
    getPublicServices(), getPublicProjects(), getPublicPosts(), getPublicResources(),
  ]);
  const candidates: SearchResult[] = [
    ...services.map((item) => ({ type: "Service", title: item.title, description: item.shortDescription || item.fullDescription || "", href: `/services/${item.slug}`, icon: Layers })),
    ...projects.map((item) => ({ type: "Case study", title: item.title, description: item.solution || item.challenge || item.results || "", href: `/work/${item.slug}`, icon: FolderOpen })),
    ...posts.map((item) => ({ type: "Insight", title: item.title, description: item.excerpt || item.metaDescription || "", href: `/blog/${item.slug}`, icon: BookOpen })),
    ...resources.map((item) => ({ type: "Resource", title: item.title, description: item.description || "", href: "/resources", icon: Download })),
  ];
  const results = normalized
    ? candidates.filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(normalized)).slice(0, 30)
    : [];

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />
      <section className="pt-32 pb-24"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Knowledge search</p><h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Find the right system, guide, or example.</h1><p className="text-slate-300">Search services, published work, engineering insights, and downloadable resources.</p></header>
        <form action="/search" method="get" role="search" className="flex gap-3 max-w-2xl mx-auto mb-12">
          <label htmlFor="site-search" className="sr-only">Search RRRTX Systems</label>
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" /><input id="site-search" name="q" type="search" defaultValue={query} maxLength={120} placeholder="Search ecommerce, AI automation, SEO…" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-white placeholder-slate-400" /></div>
          <button type="submit" className="premium-button rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white">Search</button>
        </form>

        {!query ? <div className="text-center rounded-2xl border border-slate-800/60 bg-slate-950/30 p-10"><Search className="w-8 h-8 text-cyan-400 mx-auto mb-3" aria-hidden="true" /><h2 className="text-lg font-bold text-white mb-2">Start with a topic or problem</h2><p className="text-sm text-slate-400">Try “ecommerce,” “automation,” “conversion,” or “SEO.”</p></div> : results.length === 0 ? <div role="status" className="text-center rounded-2xl border border-slate-800/60 bg-slate-950/30 p-10"><h2 className="text-lg font-bold text-white mb-2">No matching content found</h2><p className="text-sm text-slate-400 mb-5">Try a broader term or discuss the problem directly.</p><Link href="/contact" className="text-sm font-semibold text-cyan-400 underline underline-offset-4">Book a Strategy Call</Link></div> : <section aria-labelledby="search-results-heading"><div className="flex items-center justify-between mb-5"><h2 id="search-results-heading" className="text-xl font-bold text-white">Search results</h2><p role="status" className="text-sm text-slate-400">{results.length} result{results.length === 1 ? "" : "s"}</p></div><div className="space-y-3">{results.map((result) => <Link key={`${result.type}-${result.href}-${result.title}`} href={result.href} className="group flex items-start gap-4 rounded-xl border border-slate-800/60 bg-slate-950/40 p-5 hover:border-slate-600"><div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0"><result.icon className="w-4 h-4 text-cyan-400" aria-hidden="true" /></div><div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-wider text-purple-400 mb-1">{result.type}</p><h3 className="text-base font-bold text-white group-hover:text-cyan-400">{result.title}</h3><p className="text-sm text-slate-400 line-clamp-2 mt-1">{result.description}</p></div><ArrowRight className="w-4 h-4 text-slate-400 mt-2 shrink-0" aria-hidden="true" /></Link>)}</div></section>}
      </div></section>
      <Footer />
    </main>
  );
}
