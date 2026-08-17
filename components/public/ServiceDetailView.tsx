"use client";

import React from "react";
import Link from "next/link";
import { ServiceItem } from "@/lib/types";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CtaBanner } from "./CtaBanner";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  HelpCircle, 
  MessageCircle,
  Clock,
  Layers,
  ShieldCheck
} from "lucide-react";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ service }) => {
  const { settings } = useSettings();

  const whatsappInquiryUrl = getWhatsAppLink(
    settings.whatsappNumber,
    `Hello XMORE ART SOLUTIONS! I would like to inquire about your ${service.name} services and get a price estimate.`
  );

  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Service Hero */}
      <section className="pt-36 pb-20 bg-brand-black text-white relative overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${service.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/95" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Creative Vertical • {service.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
                {service.name}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-3xl leading-relaxed font-light">
                {service.fullDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link
                  href="/quote"
                  className="px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-red/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>REQUEST {service.name.toUpperCase()} QUOTE</span>
                </Link>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-heading font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>DISCUSS ON WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Quick Pricing & Turnaround Badge */}
            <div className="lg:col-span-4 bg-brand-dark-card border border-white/15 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Pricing Indicator
              </span>
              <div className="font-heading font-bold text-3xl text-white mt-1">
                {service.startingPrice}
              </div>
              <p className="text-xs text-neutral-400 mt-2 pb-4 border-b border-white/10">
                Custom itemized LKR quotations generated per exact specifications.
              </p>

              <div className="mt-4 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
                  <span>In-house Monaragala production</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
                  <span>Full commercial copyright & source files</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
                  <span>Islandwide courier dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables & Sub-Services List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              <span className="w-8 h-[2px] bg-brand-red" />
              <span>Full Scope of Work</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-black uppercase">
              Services Included in {service.name}
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base">
              Everything we produce within this vertical, engineered with meticulous attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.subServices.map((sub, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 border border-neutral-200 hover:border-brand-red/40 rounded-2xl p-6 transition-all hover:shadow-md flex items-start gap-4 group"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-brand-black group-hover:text-brand-red transition-colors">
                    {sub}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Custom tailored to your exact dimensions and brand specifications.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Benefits & Features */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
                <span className="w-8 h-[2px] bg-brand-red" />
                <span>The Advantage</span>
              </div>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white uppercase leading-tight">
                Why Choose Xmore For {service.name}
              </h2>
              <p className="mt-4 text-neutral-400 text-sm leading-relaxed">
                We combine industry-standard equipment with senior creative art direction to ensure your final assets command respect in the market.
              </p>

              <div className="mt-8 space-y-4">
                {service.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 bg-brand-dark-card p-4 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-200">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Samples */}
            <div className="grid grid-cols-2 gap-4">
              {service.gallery.map((img, i) => (
                <div 
                  key={i} 
                  className={`rounded-2xl overflow-hidden shadow-xl border border-white/10 ${
                    i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${service.name} sample ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Production Process Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              <span className="w-6 h-[2px] bg-brand-red" />
              <span>Workflow</span>
              <span className="w-6 h-[2px] bg-brand-red" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-black uppercase">
              How We Execute {service.name} Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {service.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 relative group hover:border-brand-red/50 transition-colors"
              >
                <span className="font-heading font-black text-3xl text-brand-red/30 group-hover:text-brand-red transition-colors block mb-4">
                  0{idx + 1}
                </span>
                <h3 className="font-heading font-bold text-base text-brand-black mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {service.faq.length > 0 && (
        <section className="py-20 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-extrabold text-3xl text-brand-black uppercase">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wider font-semibold">
                Common inquiries regarding {service.name}
              </p>
            </div>

            <div className="space-y-4">
              {service.faq.map((faq, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6">
                  <h3 className="font-heading font-bold text-base text-brand-black flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-brand-red shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <CtaBanner />

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
};
