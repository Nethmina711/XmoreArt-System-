"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { Sparkles, MessageCircle, ArrowRight, Phone } from "lucide-react";

export const CtaBanner: React.FC = () => {
  const { settings } = useSettings();

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello XMORE ART SOLUTIONS! I am ready to start a project and would like to get a quote."
  );

  return (
    <section className="py-20 bg-brand-black text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-red/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-red" />
          <span>Start Your Creative Project</span>
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight">
          READY TO CREATE <br />
          <span className="text-brand-red">SOMETHING GREAT?</span>
        </h2>

        <p className="mt-6 text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          From full corporate branding to high-speed commercial printing and 4K cinema video production, XMORE ART SOLUTIONS delivers the excellence your business deserves.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quote"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs tracking-wider uppercase transition-all shadow-xl shadow-brand-red/30 hover:shadow-brand-red/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>REQUEST A QUOTE</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-heading font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <span>CONTACT XMORE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-heading font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <MessageCircle className="w-4 h-4" />
            <span>CHAT ON WHATSAPP</span>
          </a>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          Studio in Monaragala • Fast turnaround • Islandwide courier delivery for print orders
        </p>

      </div>
    </section>
  );
};
