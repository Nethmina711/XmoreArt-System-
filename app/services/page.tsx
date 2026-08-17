"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { DataStore } from "@/lib/data/dataStore";
import { 
  Sparkles, 
  ArrowUpRight, 
  Printer, 
  Palette, 
  TrendingUp, 
  Camera, 
  Video, 
  Shield 
} from "lucide-react";

export default function ServicesIndexPage() {
  const services = DataStore.getServices().filter(s => s.published);

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
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-36 pb-20 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Creative Solutions Under One Roof</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
            Integrated Creative & Production Services
          </h1>

          <p className="mt-6 text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            From high-speed commercial printing to strategic brand architecture, 4K film production, and performance digital marketing in Monaragala, Sri Lanka.
          </p>
        </div>
      </section>

      {/* Services Detailed Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-3xl border border-neutral-200 hover:border-brand-red/40 transition-all duration-300 bg-white hover:shadow-2xl ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Preview */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-neutral-900 relative group">
                  <img
                    src={srv.coverImage}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-brand-black/80 backdrop-blur-md text-white text-xs font-heading font-semibold uppercase tracking-wider">
                      Starts from {srv.startingPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Description */}
              <div className={`lg:col-span-7 space-y-6 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                    {getIcon(srv.iconName)}
                  </div>
                  <span className="font-heading font-bold text-xs uppercase tracking-widest text-brand-red">
                    Vertical 0{idx + 1}
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-black uppercase">
                  {srv.name}
                </h2>

                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  {srv.fullDescription}
                </p>

                {/* Sub-services pills */}
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-2">
                    Key Deliverables:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {srv.subServices.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/services/${srv.slug}`}
                    className="px-6 py-3 rounded-xl bg-brand-black hover:bg-brand-red text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>EXPLORE {srv.name.toUpperCase()}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/quote"
                    className="px-6 py-3 rounded-xl bg-brand-red/10 hover:bg-brand-red hover:text-white text-brand-red font-heading font-semibold text-xs uppercase tracking-wider transition-all"
                  >
                    Get Instant Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <CtaBanner />

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
}
