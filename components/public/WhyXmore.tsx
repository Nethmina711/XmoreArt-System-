"use client";

import React from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import { Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";

export const WhyXmore: React.FC = () => {
  const { websiteContent } = useSettings();
  const { whyXmore } = websiteContent;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="w-6 h-6 text-white" />;
      case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-white" />;
      case "Zap": return <Zap className="w-6 h-6 text-white" />;
      case "Layers": return <Layers className="w-6 h-6 text-white" />;
      default: return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <section className="py-24 bg-brand-dark-gray text-white relative overflow-hidden">
      {/* Background subtleties */}
      <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
            <span className="w-6 h-[2px] bg-brand-red" />
            <span>The Xmore Advantage</span>
            <span className="w-6 h-[2px] bg-brand-red" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            {whyXmore.title}
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {whyXmore.subtitle}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyXmore.points.map((point, index) => (
            <div
              key={index}
              className="bg-brand-dark-card border border-white/10 hover:border-brand-red/50 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center mb-6 shadow-lg shadow-brand-red/30 group-hover:scale-110 transition-transform">
                {getIcon(point.icon)}
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-3 group-hover:text-brand-red transition-colors">
                {point.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
