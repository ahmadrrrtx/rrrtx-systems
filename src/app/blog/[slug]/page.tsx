import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | RRRTX SYSTEMS",
      description: "The requested blog article does not exist.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${post.metaTitle || post.title} | RRRTX SYSTEMS`,
    description: post.metaDescription || post.excerpt || "",
    openGraph: {
      title: `${post.metaTitle || post.title} | RRRTX SYSTEMS`,
      description: post.metaDescription || post.excerpt || "",
      url: `/blog/${slug}`,
    },
  };
}

// Simple and highly-efficient client-safe Markdown renderer without external dep bloat
function renderContent(content: string) {
  const lines = content.split("\n");
  let inList = false;
  const elements: React.JSX.Element[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("###")) {
      if (inList) {
        inList = false;
      }
      elements.push(
        <h4 key={index} className="text-lg font-bold text-white mt-6 mb-3">
          {trimmed.replace(/^###\s*/, "")}
        </h4>
      );
    } else if (trimmed.startsWith("##")) {
      if (inList) {
        inList = false;
      }
      elements.push(
        <h3 key={index} className="text-xl font-bold text-white mt-8 mb-4">
          {trimmed.replace(/^##\s*/, "")}
        </h3>
      );
    } else if (trimmed.startsWith("#")) {
      if (inList) {
        inList = false;
      }
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-white mt-10 mb-6">
          {trimmed.replace(/^#\s*/, "")}
        </h2>
      );
    } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      inList = true;
      elements.push(
        <li key={index} className="text-slate-300 ml-6 list-disc mb-2 leading-relaxed">
          {trimmed.replace(/^[-*]\s*/, "")}
        </li>
      );
    } else if (trimmed === "") {
      inList = false;
    } else {
      if (inList) {
        inList = false;
      }
      elements.push(
        <p key={index} className="text-slate-300 mb-4 leading-relaxed text-base">
          {trimmed}
        </p>
      );
    }
  });

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tagList = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {(post.publishedAt || post.createdAt || new Date()).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {tagList.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-cyan-400">
                  <Tag className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-cyan-500 pl-4 py-1 italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 mb-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-16">
            {renderContent(post.content)}
          </div>

          {/* Article Footer */}
          <div className="border-t border-slate-800/60 pt-8 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Written by</span>
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">RRRTX ENGINEERING</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
