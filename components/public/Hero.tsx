"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/lib/context/SettingsContext";
import { Sparkles, ArrowRight, Play, CheckCircle2 } from "lucide-react";

export const Hero: React.FC = () => {
  const { websiteContent } = useSettings();
  const { hero } = websiteContent;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-brand-black">
      {/* Background Image with Dark Vignette Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${hero.bgImageUrl})` }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/90" />
      <div className="absolute inset-0 z-0 bg-subtle-grid-dark opacity-40" />

      {/* Decorative Red Accent Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Editorial Badge with Signature Red Trapezoid Accent */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-md animate-fade-in relative group">
          <div className="w-3.5 h-1.5 bg-brand-red -skew-x-[35deg] rounded-[1px] shadow-sm shadow-brand-red/50" />
          <span>{hero.badge}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Big Impact Headline with Logo Typography Cues */}
        <div className="relative max-w-5xl mx-auto">
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.05] uppercase">
            {hero.titleLine1} <br />
            <span className="text-neutral-400">{hero.titleLine2} </span>
            <span className="text-brand-red relative inline-block">
              {hero.highlightWord}
              {/* Signature Red Underline Bar from Logo */}
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-brand-red rounded-full shadow-lg shadow-brand-red/40" />
            </span>
          </h1>
        </div>

        {/* Supporting Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/quote"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-brand-red/30 hover:shadow-brand-red/50 hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{hero.primaryCtaText}</span>
          </Link>

          <Link
            href="/portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-heading font-semibold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <span>{hero.secondaryCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
            <div className="text-xs">
              <p className="text-white font-bold">In-House Production</p>
              <p className="text-neutral-400">High-speed print & video</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
            <div className="text-xs">
              <p className="text-white font-bold">Monaragala Studio</p>
              <p className="text-neutral-400">Islandwide courier delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
            <div className="text-xs">
              <p className="text-white font-bold">100% Custom Work</p>
              <p className="text-neutral-400">Original strategic designs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
            <div className="text-xs">
              <p className="text-white font-bold">Transparent Pricing</p>
              <p className="text-neutral-400">Itemized LKR quotations</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
