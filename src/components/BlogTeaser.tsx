import Link from "next/link";
import { ArrowRight, Clock, PenTool } from "lucide-react";
import type { DbPost } from "@/lib/queries";
import { SectionWrapper } from "./SectionWrapper";
import { SmartImage } from "./SmartImage";

function estimateReadTime(content: string): number {
  return Math.max(2, Math.ceil(content.split(/\s+/).length / 230));
}

function formatDate(post: DbPost): string {
  const date = post.publishedAt || post.createdAt;
  return date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
}

function postTags(post: DbPost) {
  return post.tags?.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 2) || [];
}

export function BlogTeaser({ posts }: { posts: DbPost[] }) {
  if (!posts?.length) return null;
  const visible = posts.slice(0, 3);
  const featured = visible[0];
  const secondary = visible.slice(1);

  return (
    <SectionWrapper className="relative overflow-hidden py-24 lg:py-32">
      <div className="soft-grid absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-purple-600/[0.04] blur-[110px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">From the Blog</p><h2 className="text-3xl font-bold tracking-[-0.025em] text-white lg:text-4xl">Insights &amp; Engineering Notes</h2></div>
          <Link href="/blog" className="group/all inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300">Read all posts <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/all:translate-x-1" aria-hidden="true" /></Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.16fr_.84fr]">
          <Link href={`/blog/${featured.slug}`} className="premium-card group/featured overflow-hidden rounded-3xl">
            <article className="flex h-full flex-col">
              <div className="relative aspect-[16/9] overflow-hidden lg:aspect-[16/10]">
                {featured.coverImageUrl ? <SmartImage src={featured.coverImageUrl} alt={featured.title} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full object-cover opacity-75 transition-[transform,opacity] duration-700 ease-[var(--ease-premium)] group-hover/featured:scale-[1.04] group-hover/featured:opacity-95" /> : <div className="h-full w-full bg-gradient-to-br from-cyan-900/35 via-blue-950/50 to-purple-950/35" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/25 to-transparent" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">{postTags(featured).map((tag) => <span key={tag} className="rounded-lg border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-200 shadow-lg backdrop-blur-lg">{tag}</span>)}</div>
                <div className="absolute bottom-5 left-5 rounded-lg border border-white/[0.08] bg-slate-950/65 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-200 backdrop-blur-lg">Featured insight</div>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.025em] text-white transition-colors duration-300 group-hover/featured:text-cyan-300 lg:text-3xl">{featured.title}</h3>
                {featured.excerpt && <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-300 sm:text-base">{featured.excerpt}</p>}
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800/60 pt-5 text-[11px] text-slate-300">
                  <span className="inline-flex items-center gap-1.5"><PenTool className="h-3.5 w-3.5 text-purple-300" aria-hidden="true" />RRRTX Engineering</span>
                  {formatDate(featured) && <span>{formatDate(featured)}</span>}
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />{estimateReadTime(featured.content || "")} min read</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-[transform,color] duration-300 group-hover/featured:translate-x-1 group-hover/featured:text-cyan-300" aria-hidden="true" />
                </div>
              </div>
            </article>
          </Link>

          <div className="flex flex-col gap-6">
            {secondary.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="premium-card group/post flex flex-1 overflow-hidden rounded-2xl">
                <article className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row">
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:w-44 sm:aspect-auto lg:w-full lg:aspect-[16/7] xl:w-44 xl:aspect-auto">
                    {post.coverImageUrl ? <SmartImage src={post.coverImageUrl} alt={post.title} sizes="(min-width: 1280px) 176px, (min-width: 1024px) 42vw, (min-width: 640px) 176px, 100vw" className="h-full w-full object-cover opacity-65 transition-[transform,opacity] duration-700 ease-[var(--ease-premium)] group-hover/post:scale-105 group-hover/post:opacity-90" /> : <div className="h-full w-full bg-gradient-to-br from-blue-950 to-purple-950/50" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 to-transparent" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="mb-2 flex flex-wrap gap-1.5">{postTags(post).map((tag) => <span key={tag} className="rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-purple-200">{tag}</span>)}</div>
                    <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-white transition-colors duration-300 group-hover/post:text-cyan-300">{post.title}</h3>
                    {post.excerpt && <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-300">{post.excerpt}</p>}
                    <div className="mt-auto flex items-center gap-3 text-[10px] text-slate-400"><span>RRRTX Engineering</span><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" />{estimateReadTime(post.content || "")} min</span><ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform duration-300 group-hover/post:translate-x-1" aria-hidden="true" /></div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
