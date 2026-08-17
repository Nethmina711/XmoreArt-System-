import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Hero } from "@/components/public/Hero";
import { WhatWeDo } from "@/components/public/WhatWeDo";
import { WhyXmore } from "@/components/public/WhyXmore";
import { FeaturedWork } from "@/components/public/FeaturedWork";
import { ProcessSection } from "@/components/public/ProcessSection";
import { SocialProof } from "@/components/public/SocialProof";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      {/* Global Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* What We Do - 6 Core Service Verticals */}
      <WhatWeDo />

      {/* Why Xmore - 4 Strategic Pillars */}
      <WhyXmore />

      {/* Dynamic Featured Portfolio Projects */}
      <FeaturedWork />

      {/* 5-Step Production Methodology */}
      <ProcessSection />

      {/* Social Proof & Verified Testimonials */}
      <SocialProof />

      {/* Bottom Conversion CTA */}
      <CtaBanner />

      {/* Floating WhatsApp Action */}
      <WhatsAppFloatingButton />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
