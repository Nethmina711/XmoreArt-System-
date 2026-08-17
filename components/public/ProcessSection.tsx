"use client";

import React from "react";
import { useSettings } from "@/lib/context/SettingsContext";

export const ProcessSection: React.FC = () => {
  const { websiteContent } = useSettings();
  const { process } = websiteContent;

  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-subtle-grid-dark opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-red/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
            <span className="w-6 h-[2px] bg-brand-red" />
            <span>Methodology</span>
            <span className="w-6 h-[2px] bg-brand-red" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            {process.title}
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {process.subtitle}
          </p>
        </div>

        {/* 5-Step Process Timeline / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {process.steps.map((step, index) => (
            <div
              key={index}
              className="bg-brand-dark-card border border-white/10 hover:border-brand-red/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative group"
            >
              <div>
                {/* Step Number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading font-black text-3xl text-brand-red/40 group-hover:text-brand-red transition-colors">
                    {step.number}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red/40 group-hover:bg-brand-red transition-colors" />
                </div>

                {/* Title & Description */}
                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-brand-red transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Bottom connecting bar */}
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                Step 0{index + 1} of 05
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
