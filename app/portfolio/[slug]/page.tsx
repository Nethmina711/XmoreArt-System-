"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { DataStore } from "@/lib/data/dataStore";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  Building, 
  MessageCircle,
  Play
} from "lucide-react";

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const { settings } = useSettings();
  const project = DataStore.getPortfolioBySlug(params.slug);

  if (!project) {
    return notFound();
  }

  const allProjects = DataStore.getPortfolioProjects().filter(p => p.published && p.id !== project.id);
  const relatedProjects = allProjects.filter(p => p.category === project.category).slice(0, 3);

  const whatsappInquiryUrl = getWhatsAppLink(
    settings.whatsappNumber,
    `Hello XMORE ART SOLUTIONS! I loved your work on "${project.title}" for ${project.client}. I would like to discuss a similar project for my business.`
  );

  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Case Study Hero */}
      <section className="pt-36 pb-20 bg-brand-black text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url(${project.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/85 to-brand-black/95" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-brand-red text-white text-xs font-heading font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.date}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                href="/quote"
                className="px-6 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-red/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>REQUEST SIMILAR QUOTE</span>
              </Link>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-heading font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>CHAT ABOUT THIS WORK</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Meta Details Bar */}
      <section className="bg-neutral-900 border-y border-white/10 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Client</span>
              <p className="font-heading font-bold text-sm text-white mt-0.5">{project.client}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Category</span>
              <p className="font-heading font-bold text-sm text-brand-red mt-0.5">{project.category}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Completion</span>
              <p className="font-heading font-bold text-sm text-white mt-0.5">{project.date}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Location</span>
              <p className="font-heading font-bold text-sm text-white mt-0.5">Monaragala / Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Deep Dive: Challenge & Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: The Story */}
            <div className="lg:col-span-8 space-y-10">
              {project.challenge && (
                <div>
                  <h2 className="font-heading font-bold text-2xl text-brand-black uppercase mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-red" />
                    The Challenge
                  </h2>
                  <p className="text-neutral-700 text-sm sm:text-base leading-relaxed pl-5 border-l-2 border-neutral-200">
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.solution && (
                <div>
                  <h2 className="font-heading font-bold text-2xl text-brand-black uppercase mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    The Creative Solution
                  </h2>
                  <p className="text-neutral-700 text-sm sm:text-base leading-relaxed pl-5 border-l-2 border-neutral-200">
                    {project.solution}
                  </p>
                </div>
              )}

              {/* Gallery Grid */}
              <div className="pt-6">
                <h3 className="font-heading font-bold text-xl text-brand-black uppercase mb-6">
                  Project Gallery & Execution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden shadow-lg border border-neutral-200 group bg-neutral-900"
                    >
                      <img
                        src={img}
                        alt={`${project.title} gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Deliverables & Meta Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8">
                <h3 className="font-heading font-bold text-base text-brand-black uppercase tracking-wider mb-4 pb-3 border-b border-neutral-200">
                  Deliverables Produced
                </h3>
                <div className="space-y-3">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h4 className="text-xs uppercase font-bold text-neutral-400 mb-3">
                    Project Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-medium text-neutral-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Consultation Box */}
              <div className="bg-brand-dark-card border border-white/10 text-white rounded-3xl p-6 text-center space-y-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red text-white mx-auto flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-lg text-white">
                  Have a similar project?
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Our directors in Monaragala are ready to help you plan, design, and produce high-impact assets.
                </p>
                <Link
                  href="/quote"
                  className="block w-full py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all"
                >
                  GET AN ITEMIZED QUOTE
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading font-extrabold text-2xl text-brand-black uppercase">
                More {project.category} Work
              </h2>
              <Link
                href="/portfolio"
                className="text-xs font-bold text-brand-red hover:underline uppercase tracking-wider"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/portfolio/${rel.slug}`}
                  className="group block bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-900">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-brand-red uppercase font-bold tracking-wider">{rel.category}</span>
                    <h3 className="font-heading font-bold text-base text-brand-black group-hover:text-brand-red transition-colors line-clamp-1 mt-1">
                      {rel.title}
                    </h3>
                  </div>
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
