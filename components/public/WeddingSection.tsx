"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  Heart, 
  Camera, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award,
  Calendar,
  Layers,
  Film
} from "lucide-react";

export const WeddingSection: React.FC = () => {
  const { settings } = useSettings();

  const weddingPackages = [
    {
      id: "pre-wedding",
      type: "PRE_WEDDING",
      name: "Pre-Wedding & Couple Story",
      subtitle: "Outdoor Romantic Couple Session",
      price: "Rs. 65,000",
      description: "Scenic location couple shoot with concept mood styling and 4K cinematic romance teaser.",
      popular: false,
      features: [
        "Full Day Outdoor Location Shoot (Ella / Monaragala / Beach)",
        "Creative Styling & Storyboard Mood Planning",
        "4K Cinematic 60s Romance Teaser Video",
        "50 Master Retouched High-Resolution Portraits",
        "16x24 Framed Reception Welcome Portrait",
        "All Raw Digital Originals via Cloud Vault"
      ],
      link: "/book?type=PRE_WEDDING"
    },
    {
      id: "wedding-signature",
      type: "WEDDING_FULL",
      name: "Royal Signature Wedding Package",
      subtitle: "Full Day Poruwa / Church + Reception",
      price: "Rs. 185,000",
      description: "Our premier all-inclusive wedding production with master crew, 4K aerial drone, and handcrafted leather album.",
      popular: true,
      features: [
        "Full Day Coverage: Bridal Dressing, Poruwa & Reception",
        "2 Master Photographers + 2 4K Cinematographers",
        "4K Drone Aerial Cinematography by Licensed Pilot",
        "40-Page 12x24 Flush Mount Leather Album + Wooden Box",
        "Two 8x16 Parent Mini Albums Included",
        "6-8 Minute Cinematic Highlight Film + Full Ceremony Video",
        "Same-Day 60s Express Social Media Teaser for Wedding Night"
      ],
      link: "/book?type=WEDDING_FULL"
    },
    {
      id: "homecoming",
      type: "WEDDING_HOMECOMING",
      name: "Homecoming & Evening Gala",
      subtitle: "Complete Homecoming Function Coverage",
      price: "Rs. 120,000",
      description: "Elegant coverage of your second day celebration with magazine album and highlight cinematography.",
      popular: false,
      features: [
        "Complete Homecoming Reception & Going Away Coverage",
        "1 Senior Photographer + 1 Senior Cinematographer",
        "30-Page 10x20 Magazine Style Flush Mount Album",
        "4-Minute Cinematic Highlight Video",
        "300+ Color-Graded High-Resolution Digital Files",
        "Express 48-Hour Digital Photo Delivery"
      ],
      link: "/book?type=WEDDING_HOMECOMING"
    }
  ];

  const weddingWhatsAppUrl = getWhatsAppLink(
    settings.whatsappNumber || "94716666643",
    "Hello XMORE ART SOLUTIONS! 💒 I would like to check wedding date availability and discuss your photography & cinema packages."
  );

  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Decorative Lighting & Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-bold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5 fill-brand-red" />
            <span>WEDDINGS & CINEMATIC PRODUCTIONS</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4 leading-tight">
            Capture Your Royal <span className="text-brand-red">Love Story</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Monaragala & Sri Lanka&apos;s premier wedding photography and cinematography studio. We combine timeless visual storytelling, 4K aerial drone artistry, and handcrafted flush mount albums to immortalize your once-in-a-lifetime celebration.
          </p>
        </div>

        {/* 3 Signature Wedding Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {weddingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between relative ${
                pkg.popular
                  ? "bg-brand-dark-card border-2 border-brand-red shadow-2xl shadow-brand-red/15 scale-[1.03] z-10"
                  : "bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-brand-red text-white text-[11px] font-heading font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Requested Package</span>
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red block mb-1">
                  {pkg.subtitle}
                </span>

                <h3 className="font-heading font-extrabold text-2xl text-white mb-2">
                  {pkg.name}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="pb-6 mb-6 border-b border-white/10">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white">
                    {pkg.price}
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-1">
                    Fixed all-inclusive price in LKR (No hidden charges)
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-3 mb-8">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Actions */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <Link
                  href="/book"
                  className={`w-full py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    pkg.popular
                      ? "bg-brand-red hover:bg-brand-red-dark text-white shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Date & Reserve</span>
                </Link>

                <a
                  href={weddingWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-center text-neutral-400 hover:text-white text-xs font-semibold block transition-colors"
                >
                  Ask Questions on WhatsApp &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Pillars Bar */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left mb-12">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs sm:text-sm text-white">4K Drone Aerials</p>
              <p className="text-[11px] text-neutral-400">Cinematic overhead venue sweeps</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs sm:text-sm text-white">Flush Mount Albums</p>
              <p className="text-[11px] text-neutral-400">12x24 handcrafted leather boxes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs sm:text-sm text-white">Nakath Timing Sync</p>
              <p className="text-[11px] text-neutral-400">Flawless Poruwa schedule precision</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs sm:text-sm text-white">Same-Day Teasers</p>
              <p className="text-[11px] text-neutral-400">Instant Instagram reels on event night</p>
            </div>
          </div>
        </div>

        {/* Big Bottom Action CTA */}
        <div className="text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-brand-red/40 hover:shadow-brand-red/60 hover:-translate-y-0.5 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>LAUNCH INTERACTIVE WEDDING BOOKING PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-neutral-500 text-xs mt-3">
            Check real-time slot availability, customize luxury add-ons, and calculate your 25% date-lock advance.
          </p>
        </div>

      </div>
    </section>
  );
};
