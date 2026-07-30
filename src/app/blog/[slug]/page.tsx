import type { Metadata } from "next";
import { getPostBySlug, getPublicPosts } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, Calendar, Tag, Clock3 } from "lucide-react";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function tagsFor(value: string | null) {
  return value ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
}

function readingTime(content: string) {
  return Math.max(2, Math.ceil(content.trim().split(/\s+/).length / 230));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return createMetadata({ title: "Article Not Found", description: "The requested article is not available.", path: `/blog/${slug}`, noIndex: true });
  }

  const rawTitle = post.metaTitle || post.title;
  const cleanTitle = rawTitle.replace(/\s*[|—-]\s*RRRTX(?:\s+SYSTEMS)?\s*$/i, "").trim();
  return createMetadata({
    title: cleanTitle,
    description: post.metaDescription || post.excerpt || post.title,
    path: `/blog/${slug}`,
    image: post.coverImageUrl,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPublicPosts()]);
  if (!post) notFound();

  const tagList = tagsFor(post.tags);
  const related = allPosts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      score: tagsFor(candidate.tags).filter((tag) => tagList.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post: candidate }) => candidate);
  const published = post.publishedAt || post.createdAt || new Date();
  const updated = post.updatedAt || published;
  const articleUrl = absoluteUrl(`/blog/${slug}`);
  const toc = post.content
    .split("\n")
    .filter((line) => /^##\s+/.test(line.trim()))
    .map((line) => line.trim().replace(/^##\s+/, ""))
    .map((title) => ({ title, id: slugify(title) }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        headline: post.title,
        description: post.metaDescription || post.excerpt || post.title,
        image: post.coverImageUrl ? [absoluteUrl(post.coverImageUrl)] : [`${SITE_URL}/assets/og-image.png`],
        datePublished: published.toISOString(),
        dateModified: updated.toISOString(),
        mainEntityOfPage: articleUrl,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "RRRTX Engineering" },
        publisher: { "@id": `${SITE_URL}/#organization` },
        keywords: tagList.join(", "),
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id={`schema-article-${slug}`} data={schema} />
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to insights
          </Link>

          <header className="mb-12 max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-5">
              <time dateTime={published.toISOString()} className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" />{published.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              <span className="flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" aria-hidden="true" />{readingTime(post.content)} min read</span>
              {tagList.map((tag) => <Link key={tag} href={`/blog?category=${encodeURIComponent(tag)}`} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"><Tag className="w-3.5 h-3.5" aria-hidden="true" />{tag}</Link>)}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-5 py-1">{post.excerpt}</p>}
          </header>

          {post.coverImageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 mb-12">
              <SmartImage src={post.coverImageUrl} alt={post.title} priority sizes="(min-width: 1024px) 1024px, 100vw" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-12 items-start">
            <div className="article-content max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h2 id={slugify(String(children))} className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-5 scroll-mt-28">{children}</h2>,
                  h2: ({ children }) => <h2 id={slugify(String(children))} className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-5 scroll-mt-28">{children}</h2>,
                  h3: ({ children }) => <h3 id={slugify(String(children))} className="text-xl font-bold text-white mt-9 mb-4 scroll-mt-28">{children}</h3>,
                  p: ({ children }) => <p className="text-base text-slate-300 leading-8 mb-5">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 text-slate-300 mb-6">{children}</ol>,
                  li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-purple-500 bg-purple-500/5 rounded-r-lg px-5 py-3 my-7 text-slate-300">{children}</blockquote>,
                  code: ({ children }) => <code className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-sm text-cyan-300">{children}</code>,
                  a: ({ href = "", children }) => href.startsWith("/") ? <Link href={href} className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300">{children}</Link> : <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300">{children}</a>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {toc.length > 1 && (
              <aside className="hidden lg:block sticky top-28 rounded-xl border border-slate-800/60 bg-slate-950/40 p-5" aria-label="Table of contents">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">In this article</p>
                <ol className="space-y-3">
                  {toc.map((item) => <li key={item.id}><a href={`#${item.id}`} className="text-sm leading-snug text-slate-400 hover:text-cyan-400">{item.title}</a></li>)}
                </ol>
              </aside>
            )}
          </div>

          <footer className="border-t border-slate-800/60 mt-14 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><span className="text-xs text-slate-500">Written and reviewed by</span><p className="text-sm text-cyan-400 font-semibold">RRRTX Engineering</p></div>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300">Discuss a related system <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
          </footer>

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-2xl font-bold text-white mb-6">Related insights</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`} className="group rounded-xl border border-slate-800/60 bg-slate-950/40 p-5 hover:border-slate-600 transition-colors">
                    <p className="text-xs text-cyan-400 mb-2">{tagsFor(item.tags)[0] || "Engineering"}</p>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
}
