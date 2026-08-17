"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";

import { BrandLogo } from "@/components/common/BrandLogo";

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const services = [
    { name: "Printing & Large Format", href: "/services/printing" },
    { name: "Graphic Design & Packaging", href: "/services/graphic-design" },
    { name: "Digital Marketing & Ads", href: "/services/digital-marketing" },
    { name: "Commercial & Wedding Photography", href: "/services/photography" },
    { name: "4K Videography & Reels", href: "/services/videography" },
    { name: "Corporate Branding & Signage", href: "/services/branding" },
  ];

  const quickLinks = [
    { name: "About Xmore", href: "/about" },
    { name: "Portfolio & Case Studies", href: "/portfolio" },
    { name: "Pricing Packages", href: "/packages" },
    { name: "Book Wedding / Shoot", href: "/book" },
    { name: "Request a Quote", href: "/quote" },
    { name: "Creative Blog & Insights", href: "/blog" },
    { name: "Contact & Studio Location", href: "/contact" },
  ];

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello XMORE ART SOLUTIONS, I would like to consult on a creative project."
  );

  return (
    <footer className="bg-brand-black text-neutral-300 border-t border-neutral-800 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle red ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" href="/" showTagline={true} />

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Sri Lanka&apos;s integrated creative powerhouse. We combine precision printing, brand architecture, commercial video production, and high-impact digital marketing under one roof.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red hover:text-white flex items-center justify-center text-neutral-400 transition-all border border-white/5"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red hover:text-white flex items-center justify-center text-neutral-400 transition-all border border-white/5"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-emerald-400 transition-all border border-white/5"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red hover:text-white flex items-center justify-center text-neutral-400 transition-all border border-white/5"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
                Registered Sri Lankan Creative Enterprise
              </span>
            </div>
          </div>

          {/* Services Col */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Creative Verticals
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((srv) => (
                <li key={srv.name}>
                  <Link
                    href={srv.href}
                    className="text-neutral-400 hover:text-white hover:text-brand-red transition-colors flex items-center justify-between group"
                  >
                    <span>{srv.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Company & Work
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white hover:text-brand-red transition-colors flex items-center justify-between group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Location & Contact Col */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Studio & Contact
            </h3>
            <div className="space-y-3 text-sm text-neutral-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.district}, Sri Lanka</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-red shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {settings.whatsappDisplay} (Direct WhatsApp)
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-red shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </p>
              <p className="flex items-start gap-2.5 text-xs text-neutral-500 pt-1 border-t border-white/5">
                <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} <span className="text-white font-medium">XMORE ART SOLUTIONS</span>. All Rights Reserved. Monaragala, Sri Lanka.
          </p>
          <div className="flex items-center gap-6">
            <span>Currency: LKR (Rs.)</span>
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-neutral-400 hover:text-white hover:underline transition-colors"
            >
              <Lock className="w-3 h-3 text-brand-red" />
              <span>Internal Management Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
