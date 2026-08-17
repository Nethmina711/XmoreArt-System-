"use client";

import React from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import { Star, Quote, ShieldCheck } from "lucide-react";

export const SocialProof: React.FC = () => {
  const { websiteContent } = useSettings();
  const { testimonials, clientLogos } = websiteContent;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
            <span className="w-6 h-[2px] bg-brand-red" />
            <span>Client Testimonials</span>
            <span className="w-6 h-[2px] bg-brand-red" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-black uppercase tracking-tight">
            Trusted By Businesses Across Sri Lanka
          </h2>
          <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Real stories from hoteliers, medical directors, agricultural exporters, and couples who chose XMORE.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-neutral-50 border border-neutral-200 hover:border-brand-red/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-red/30" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-neutral-700 leading-relaxed italic mb-6">
                  &ldquo;{testi.text}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-4 border-t border-neutral-200 flex items-center gap-3">
                <img
                  src={testi.avatar}
                  alt={testi.clientName}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-300"
                />
                <div>
                  <h3 className="font-heading font-bold text-sm text-brand-black">
                    {testi.clientName}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    {testi.role} • {testi.company}
                  </p>
                  <span className="inline-block text-[10px] text-brand-red font-semibold uppercase tracking-wider mt-0.5">
                    {testi.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos Row */}
        <div className="pt-10 border-t border-neutral-100 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-6">
            Selected Corporate & Hospitality Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            {clientLogos.map((client, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-neutral-200 flex items-center justify-center font-heading font-bold text-xs text-neutral-700">
                  {client.name.charAt(0)}
                </div>
                <span className="font-heading font-bold text-xs tracking-wider text-neutral-800 uppercase">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
