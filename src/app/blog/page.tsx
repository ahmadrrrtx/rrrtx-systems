import type { Metadata } from "next";
import { getPublicPosts } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights, Engineering & Strategy Blog | RRRTX SYSTEMS",
  description:
    "Articles, insights, and engineering guides on custom ecommerce, AI automations, systems design, and conversion rate optimization.",
  openGraph: {
    title: "Insights, Engineering & Strategy Blog | RRRTX SYSTEMS",
    description: "Articles, insights, and engineering guides on custom ecommerce, AI automations, and systems design.",
    url: "/blog",
  },
};

export default async function BlogListingPage() {
  const posts = await getPublicPosts();

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Insights & Engineering
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Systems & <span className="text-gradient">Insights.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Practical guides, engineering write-ups, and strategies on custom ecommerce, AI agents, and scaling digital platforms.
            </p>
          </div>

          {/* Listing */}
          {posts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-slate-800/40 bg-slate-950/20 max-w-xl mx-auto">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-1">No Articles Published Yet</h3>
              <p className="text-sm text-slate-400">Our engineering team is busy shipping client systems. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const tagList = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
                return (
                  <article
                    key={post.id}
                    className="flex flex-col rounded-2xl bg-slate-950/40 border border-slate-800/50 overflow-hidden hover:border-slate-600/80 transition-all duration-300 group"
                  >
                    {/* Cover Image/Gradient placeholder */}
                    <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden">
                      {post.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-[#020617] flex items-center justify-center p-6 border-b border-slate-800/50">
                          <BookOpen className="w-8 h-8 text-cyan-500/50" />
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {(post.publishedAt || post.createdAt || new Date()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {tagList.length > 0 && (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Tag className="w-3.5 h-3.5" />
                            {tagList[0]}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mt-auto group-hover:gap-2"
                      >
                        Read Article <ArrowRight className="w-4 h-4 transition-all" />
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
