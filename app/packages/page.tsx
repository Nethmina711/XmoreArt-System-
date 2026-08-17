"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { DataStore } from "@/lib/data/dataStore";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { Sparkles, Check, ArrowRight, MessageCircle } from "lucide-react";

export default function PackagesPage() {
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const packages = DataStore.getPackages().filter(p => p.published);

  const categories = ["All", "Branding", "Social Media", "Videography", "Photography", "Custom"];

  const filteredPackages = selectedCategory === "All"
    ? packages
    : packages.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Creative Investment Tiers</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
            Transparent Pricing & Packages
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Choose a proven, structured creative package or build an itemized custom scope for your business.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-neutral-300 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => {
              const whatsappPackageUrl = getWhatsAppLink(
                settings.whatsappNumber,
                `Hello XMORE ART SOLUTIONS! I would like to book the "${pkg.name}" package (${pkg.priceDisplay}).`
              );

              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between relative ${
                    pkg.popular
                      ? "bg-brand-dark-card border-2 border-brand-red text-white shadow-2xl scale-[1.03] z-10"
                      : "bg-white border border-neutral-200 hover:border-neutral-300 text-brand-black shadow-sm"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-brand-red text-white text-[11px] font-heading font-bold uppercase tracking-wider shadow-lg">
                        Most Popular Package
                      </span>
                    </div>
                  )}

                  <div>
                    <span className={`text-xs uppercase font-bold tracking-wider ${
                      pkg.popular ? "text-brand-red" : "text-neutral-400"
                    }`}>
                      {pkg.category}
                    </span>

                    <h3 className="font-heading font-extrabold text-2xl mt-1 mb-2">
                      {pkg.name}
                    </h3>

                    <p className={`text-xs leading-relaxed mb-6 ${
                      pkg.popular ? "text-neutral-300" : "text-neutral-600"
                    }`}>
                      {pkg.description}
                    </p>

                    <div className="pb-6 mb-6 border-b border-neutral-200/40">
                      <span className="font-heading font-black text-3xl sm:text-4xl">
                        {pkg.priceDisplay}
                      </span>
                      <span className={`text-xs block mt-1 ${pkg.popular ? "text-neutral-400" : "text-neutral-500"}`}>
                        All prices in LKR (Sri Lankan Rupees)
                      </span>
                    </div>

                    <div className="space-y-3.5 mb-8">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            pkg.popular ? "bg-brand-red text-white" : "bg-neutral-100 text-brand-black"
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className={pkg.popular ? "text-neutral-200" : "text-neutral-700"}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4">
                    <Link
                      href={`/quote?package=${encodeURIComponent(pkg.name)}`}
                      className={`block w-full py-3.5 rounded-xl text-center font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                        pkg.popular
                          ? "bg-brand-red hover:bg-brand-red-dark text-white shadow-brand-red/30"
                          : "bg-brand-black hover:bg-brand-red text-white"
                      }`}
                    >
                      {pkg.ctaText}
                    </Link>

                    <a
                      href={whatsappPackageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-2.5 rounded-xl text-center text-xs font-medium transition-colors border ${
                        pkg.popular
                          ? "border-white/10 hover:bg-white/5 text-neutral-300"
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                      }`}
                    >
                      Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CtaBanner />

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
}
