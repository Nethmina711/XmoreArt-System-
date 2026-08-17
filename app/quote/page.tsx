"use client";

import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { QuoteWizard } from "@/components/public/QuoteWizard";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { Sparkles, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Quote Hero Header */}
      <section className="pt-36 pb-12 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Interactive Quote Engine</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
            Request an Itemized Quotation
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-light leading-relaxed">
            Tell us about your printing, design, marketing, photo, or video requirements. Get a transparent LKR price estimate in under 2 hours.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-red" />
              2-Hour Response Time
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
              No Hidden Fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />
              Official PDF & WhatsApp Proofing
            </span>
          </div>
        </div>
      </section>

      {/* Wizard Form Container */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-6">
        <QuoteWizard />
      </section>

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
}
