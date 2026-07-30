import type { Metadata } from "next";
import { getPublicPosts } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { createMetadata, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Engineering Insights & Strategy",
  description:
    "Practical engineering guides on custom ecommerce, AI automation, conversion systems, SEO, and scalable digital platforms.",
  path: "/blog",
});

function tagsFor(value: string | null) {
  return value ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
}

function readingTime(content: string) {
  return Math.max(2, Math.ceil(content.trim().split(/\s+/).length / 230));
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const posts = await getPublicPosts();
  const requestedCategory = (await searchParams).category?.trim() || "";
  const categories = Array.from(new Set(posts.flatMap((post) => tagsFor(post.tags)))).sort();
  const visiblePosts = requestedCategory
    ? posts.filter((post) => tagsFor(post.tags).some((tag) => tag.toLowerCase() === requestedCategory.toLowerCase()))
    : posts;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "RRRTX Systems engineering insights",
    url: absoluteUrl("/blog"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id="schema-blog-collection" data={schema} />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Insights & Engineering</p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Systems & <span className="text-gradient">Insights.</span></h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Practical engineering notes from building ecommerce platforms, AI workflows, and conversion systems.
            </p>
          </header>

          {categories.length > 0 && (
            <nav aria-label="Article categories" className="flex flex-wrap justify-center gap-2 mb-12">
              <Link href="/blog" aria-current={!requestedCategory ? "page" : undefined} className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold ${!requestedCategory ? "border-cyan-400 bg-cyan-500/10 text-cyan-300" : "border-slate-800 text-slate-300 hover:border-slate-600"}`}>All insights</Link>
              {categories.map((category) => (
                <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`} aria-current={requestedCategory.toLowerCase() === category.toLowerCase() ? "page" : undefined} className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold ${requestedCategory.toLowerCase() === category.toLowerCase() ? "border-cyan-400 bg-cyan-500/10 text-cyan-300" : "border-slate-800 text-slate-300 hover:border-slate-600"}`}>
                  {category}
                </Link>
              ))}
            </nav>
          )}

          {visiblePosts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-slate-800/40 bg-slate-950/20 max-w-xl mx-auto">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-white mb-2">No articles in this category</h2>
              <p className="text-sm text-slate-400 mb-5">Explore all insights or choose another topic.</p>
              <Link href="/blog" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">View all insights</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post) => {
                const tagList = tagsFor(post.tags);
                return (
                  <article key={post.id} className="flex flex-col rounded-2xl bg-slate-950/40 border border-slate-800/50 overflow-hidden hover:border-slate-600/80 transition-all duration-300 group">
                    <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden" aria-label={`Read ${post.title}`}>
                      {post.coverImageUrl ? (
                        <SmartImage src={post.coverImageUrl} alt={post.title} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-[#020617] flex items-center justify-center border-b border-slate-800/50">
                          <BookOpen className="w-8 h-8 text-cyan-500/60" aria-hidden="true" />
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
                        <time dateTime={(post.publishedAt || post.createdAt || new Date()).toISOString()} className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          {(post.publishedAt || post.createdAt || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" aria-hidden="true" /> {readingTime(post.content)} min</span>
                      </div>
                      {tagList[0] && <span className="flex items-center gap-1 text-xs text-cyan-400 mb-3"><Tag className="w-3.5 h-3.5" aria-hidden="true" />{tagList[0]}</span>}
                      <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                      {post.excerpt && <p className="text-sm text-slate-300 mb-6 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>}
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 mt-auto">
                        Read article <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
