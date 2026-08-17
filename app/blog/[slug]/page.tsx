"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { DataStore } from "@/lib/data/dataStore";
import { 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Tag,
  ArrowRight
} from "lucide-react";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = DataStore.getBlogPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const allPosts = DataStore.getBlogPosts().filter(b => b.published && b.id !== post.id);
  const relatedPosts = allPosts.slice(0, 2);

  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Article Header */}
      <section className="pt-36 pb-16 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mb-4">
            <span className="px-3 py-1 rounded-full bg-brand-red text-white font-heading font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/10">
            <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center font-bold text-white text-sm">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{post.author}</p>
              <p className="text-xs text-neutral-400">{post.authorRole} • XMORE ART SOLUTIONS</p>
            </div>
          </div>

        </div>
      </section>

      {/* Article Featured Image */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Article Body Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none space-y-6 text-neutral-800 leading-relaxed">
            {post.content.split("\n\n").map((para, idx) => {
              if (para.startsWith("# ")) {
                return (
                  <h2 key={idx} className="font-heading font-bold text-2xl sm:text-3xl text-brand-black pt-4 pb-2">
                    {para.replace("# ", "")}
                  </h2>
                );
              }
              if (para.startsWith("## ")) {
                return (
                  <h3 key={idx} className="font-heading font-bold text-xl text-brand-black pt-4 pb-1">
                    {para.replace("## ", "")}
                  </h3>
                );
              }
              if (para.startsWith("> ")) {
                return (
                  <blockquote key={idx} className="p-4 rounded-xl bg-neutral-50 border-l-4 border-brand-red italic text-neutral-700 text-sm">
                    {para.replace("> ", "")}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="text-base text-neutral-700 leading-relaxed whitespace-pre-line">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">Tags:</span>
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-700"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-heading font-bold text-xl text-brand-black uppercase mb-6">
              More Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-brand-red/40 transition-all hover:shadow-lg block"
                >
                  <span className="text-[10px] uppercase font-bold text-brand-red">{r.category}</span>
                  <h4 className="font-heading font-bold text-base text-brand-black mt-1 line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                    {r.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <CtaBanner />

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
}
