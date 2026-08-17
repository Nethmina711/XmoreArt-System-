"use client";

import React from "react";
import Link from "next/link";
import { initialServices } from "@/lib/data/seedData";
import { 
  Printer, 
  Palette, 
  TrendingUp, 
  Camera, 
  Video, 
  Shield, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";

export const WhatWeDo: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Printer": return <Printer className="w-6 h-6 text-brand-red" />;
      case "Palette": return <Palette className="w-6 h-6 text-brand-red" />;
      case "TrendingUp": return <TrendingUp className="w-6 h-6 text-brand-red" />;
      case "Camera": return <Camera className="w-6 h-6 text-brand-red" />;
      case "Video": return <Video className="w-6 h-6 text-brand-red" />;
      case "Shield": return <Shield className="w-6 h-6 text-brand-red" />;
      default: return <Sparkles className="w-6 h-6 text-brand-red" />;
    }
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              <span className="w-8 h-[2px] bg-brand-red" />
              <span>Full-Stack Creative Capabilities</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-black uppercase tracking-tight">
              What We Do
            </h2>
          </div>
          <p className="text-neutral-600 max-w-md text-sm sm:text-base leading-relaxed">
            Eliminate fragmented suppliers. We combine high-speed digital printing, visual brand identity, commercial videography, and growth marketing under one roof.
          </p>
        </div>

        {/* 6 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialServices.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white border border-neutral-200 hover:border-brand-red/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon & Index */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-brand-red/10 flex items-center justify-center transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="font-heading font-bold text-xs text-neutral-400 group-hover:text-brand-red transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-heading font-bold text-2xl text-brand-black mb-3 group-hover:text-brand-red transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Key Sub-services / Highlights */}
                <div className="space-y-1.5 pt-4 border-t border-neutral-100 mb-6">
                  {service.subServices.slice(0, 3).map((sub, sIdx) => (
                    <div key={sIdx} className="text-xs text-neutral-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red/60" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">
                  Starts from <strong className="text-brand-black">{service.startingPrice}</strong>
                </span>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-black group-hover:text-brand-red transition-colors"
                >
                  <span>Explore</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Hub CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-black hover:bg-brand-red text-white text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-lg"
          >
            <span>View All Detailed Service Specifications</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
