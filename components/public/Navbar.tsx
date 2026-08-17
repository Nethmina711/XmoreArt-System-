"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  Menu, 
  X, 
  MessageCircle, 
  ArrowUpRight, 
  Sparkles, 
  Phone, 
  MapPin,
  ChevronDown,
  Camera,
  Calendar
} from "lucide-react";

import { BrandLogo } from "@/components/common/BrandLogo";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { 
      name: "Services", 
      href: "/services",
      subItems: [
        { name: "Printing & Large Format", href: "/services/printing", desc: "Cards, banners, brochures & packaging" },
        { name: "Graphic Design", href: "/services/graphic-design", desc: "Logos, brand art & packaging mockups" },
        { name: "Digital Marketing", href: "/services/digital-marketing", desc: "Meta ads, TikTok & growth retainers" },
        { name: "Photography", href: "/services/photography", desc: "Commercial, weddings & corporate portraits" },
        { name: "Videography", href: "/services/videography", desc: "4K films, commercial ads & reels" },
        { name: "Branding", href: "/services/branding", desc: "Identity architecture & brand style guides" },
      ]
    },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Packages", href: "/packages" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello XMORE ART SOLUTIONS! I would like to inquire about your creative services."
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl"
            : "bg-black/40 backdrop-blur-sm border-b border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Official Brand Logo */}
            <BrandLogo size="md" href="/" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                
                if (link.subItems) {
                  return (
                    <div 
                      key={link.name} 
                      className="relative group"
                      onMouseEnter={() => setServicesDropdown(true)}
                      onMouseLeave={() => setServicesDropdown(false)}
                    >
                      <Link
                        href={link.href}
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                          isActive
                            ? "text-brand-red font-semibold bg-white/5"
                            : "text-neutral-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                      </Link>

                      {/* Dropdown Menu */}
                      <div 
                        className={`absolute top-full left-0 w-80 pt-2 transition-all duration-200 ${
                          servicesDropdown ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        <div className="bg-brand-dark-card border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-xl">
                          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 py-1.5 mb-1 border-b border-white/5">
                            Creative Verticals
                          </div>
                          <div className="space-y-1">
                            {link.subItems.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group/sub"
                              >
                                <div className="text-sm font-medium text-white group-hover/sub:text-brand-red transition-colors flex items-center justify-between">
                                  {sub.name}
                                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-[11px] text-neutral-400">
                                  {sub.desc}
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <Link 
                              href="/services" 
                              className="text-xs text-brand-red hover:underline font-medium px-3 block text-center"
                            >
                              Explore All Services &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-brand-red font-semibold bg-white/5"
                        : "text-neutral-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* WhatsApp Quick Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Chat with creative director on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                <span>{settings.whatsappDisplay}</span>
              </a>

              {/* Book Shoot Button */}
              <Link
                href="/book"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-semibold text-xs tracking-wider uppercase transition-all hover:border-brand-red/40"
              >
                <Camera className="w-3.5 h-3.5 text-brand-red" />
                <span>BOOK SHOOT</span>
              </Link>

              {/* Get A Quote Primary Button */}
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-red hover:bg-brand-red-dark text-white font-heading font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>GET A QUOTE</span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-brand-dark-card border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto animate-slide-up z-50">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <BrandLogo size="sm" href="/" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.name}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? "bg-brand-red text-white font-semibold"
                            : "text-neutral-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Contact & Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-sm tracking-wider uppercase text-center flex items-center justify-center gap-2 shadow-lg shadow-brand-red/30"
              >
                <Sparkles className="w-4 h-4" />
                REQUEST A QUOTE
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Chat on WhatsApp
              </a>

              <div className="pt-2 text-xs text-neutral-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" />
                  {settings.address}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-red" />
                  {settings.phoneDisplay}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
