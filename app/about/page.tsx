"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { useSettings } from "@/lib/context/SettingsContext";
import { initialEmployees } from "@/lib/data/seedData";
import { 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Compass, 
  Cpu, 
  Camera, 
  Printer, 
  CheckCircle2, 
  MapPin,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  const { websiteContent, settings } = useSettings();
  const { about } = websiteContent;

  const studioCapabilities = [
    {
      title: "Commercial Print Workshop",
      desc: "Equipped with high-volume digital laser presses, hydraulic paper guillotines, automatic thermal laminators, and UV foil hot stampers.",
      icon: Printer
    },
    {
      title: "Cinema Video & Aerial Suite",
      desc: "4K 10-bit cinema rigs, prime cine lenses, DJI Ronin motorized gimbals, certified 4K drone cinematography, and wireless lav audio.",
      icon: Camera
    },
    {
      title: "Brand Strategy & Design Lab",
      desc: "Calibrated color monitors, precision vector graphics workstations, and comprehensive 3D packaging simulation suites.",
      icon: Cpu
    }
  ];

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
            <span>About XMORE ART SOLUTIONS</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
            {about.title}
          </h1>

          <p className="mt-6 text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            {about.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-neutral-900 border-y border-white/10 py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {about.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-red">
                  {stat.value}
                </div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Story Text */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
                <span className="w-8 h-[2px] bg-brand-red" />
                <span>Our Story</span>
              </div>
              
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-black uppercase leading-tight">
                Engineering Creative Authority in Monaragala
              </h2>

              {about.storyParagraphs.map((p, idx) => (
                <p key={idx} className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  {p}
                </p>
              ))}

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/quote"
                  className="px-6 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>START A PROJECT</span>
                </Link>

                <Link
                  href="/portfolio"
                  className="px-6 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-heading font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>SEE PORTFOLIO</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Image Grid */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop"
                  alt="XMORE Creative Studio Monaragala"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Monaragala Studio Card */}
              <div className="absolute -bottom-8 -left-8 bg-brand-dark-card border border-white/15 text-white p-6 rounded-2xl shadow-2xl max-w-xs hidden sm:block">
                <div className="flex items-center gap-2 text-brand-red text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Monaragala Hub</span>
                </div>
                <p className="text-xs text-neutral-300">
                  {settings.address}
                </p>
                <p className="text-[11px] text-neutral-400 mt-2 border-t border-white/10 pt-2">
                  Serving Monaragala, Badulla, Wellawaya, Ella & Islandwide.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden group hover:border-brand-red/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-brand-black uppercase mb-4">
                Our Mission
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                {about.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden group hover:border-brand-red/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-black text-white flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-brand-black uppercase mb-4">
                Our Vision
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                {about.vision}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Production Infrastructure */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              <span className="w-6 h-[2px] bg-brand-red" />
              <span>Production Capabilities</span>
              <span className="w-6 h-[2px] bg-brand-red" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-black uppercase">
              In-House Technology & Craft
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base">
              We own and operate our production machinery, guaranteeing maximum quality control and faster turnarounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studioCapabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="bg-neutral-50 border border-neutral-200 hover:border-brand-red/40 rounded-2xl p-8 transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-black text-white flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-brand-red" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-brand-black mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership & Creative Team */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              <span className="w-6 h-[2px] bg-brand-red" />
              <span>The Team Behind The Work</span>
              <span className="w-6 h-[2px] bg-brand-red" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white uppercase">
              Meet The Creative Directors & Specialists
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base">
              Passionate designers, cinematographers, print masters, and marketing strategists dedicated to your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-brand-dark-card border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-red/50 transition-colors"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-800 relative">
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-brand-black/80 backdrop-blur-md text-[10px] uppercase font-bold text-brand-red border border-white/10">
                      {emp.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-red transition-colors">
                    {emp.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {emp.specialization}
                  </p>
                </div>
              </div>
            ))}
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
