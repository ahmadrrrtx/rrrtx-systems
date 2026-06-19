import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import type { DbPost } from "@/lib/queries";

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 230));
}

export function BlogTeaser({ posts }: { posts: DbPost[] }) {
  // If no published posts, render nothing
  if (!posts || posts.length === 0) return null;

  // Show at most 3
  const visible = posts.slice(0, 3);

  return (
    <SectionWrapper className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-3">
              From the Blog
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Insights &amp; Engineering Notes
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Read all posts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((post) => {
            const readMin = estimateReadTime(post.content || "");
            const dateStr = post.publishedAt
              ? new Date(
                  typeof post.publishedAt === "number"
                    ? post.publishedAt
                    : post.publishedAt
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-300 overflow-hidden"
              >
                {/* Cover image */}
                {post.coverImageUrl && (
                  <div className="relative aspect-[2/1] overflow-hidden">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  {/* Tags */}
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags
                        .split(",")
                        .slice(0, 2)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-slate-900/80 text-slate-500 border border-slate-800/50"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    {dateStr && <span>{dateStr}</span>}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {readMin} min read
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
