"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { useSettings } from "@/lib/context/SettingsContext";
import { DataStore } from "@/lib/data/dataStore";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Building 
} from "lucide-react";

export default function ContactPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "Printing",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    try {
      // Save as lead
      DataStore.saveLead({
        id: `lead-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        company: formData.company || undefined,
        email: formData.email || undefined,
        source: "Website",
        service: formData.service,
        status: "NEW",
        notes: `Contact Form Message: ${formData.message}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Save notification for admin
      DataStore.addNotification({
        title: "New Contact Message",
        message: `${formData.name} sent a message regarding ${formData.service}.`,
        type: "ENQUIRY",
        link: "/admin/leads",
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error("Contact submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello XMORE ART SOLUTIONS! I'm reaching out through your website contact page."
  );

  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Contact Hero Header */}
      <section className="pt-36 pb-16 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Studio & Production Lab</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
            Let&apos;s Connect in Monaragala
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Visit our central studio, call our direct line, or send a message to discuss your next creative or commercial print project.
          </p>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-brand-black uppercase mb-2">
                  Studio Headquarters
                </h2>
                <p className="text-neutral-600 text-sm">
                  Our fully equipped design lab, print workshop, and photo/video equipment depot.
                </p>
              </div>

              <div className="space-y-4">
                {/* Address Card */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-brand-black uppercase tracking-wider">
                      Physical Location
                    </h3>
                    <p className="text-sm text-neutral-700 mt-1">
                      {settings.address}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {settings.district}, {settings.province}, Sri Lanka
                    </p>
                  </div>
                </div>

                {/* Phone & WhatsApp Card */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-brand-black uppercase tracking-wider">
                      Phone & Hotlines
                    </h3>
                    <p className="text-sm font-semibold text-neutral-800 mt-1">
                      <a href={`tel:${settings.phone}`} className="hover:text-brand-red">
                        {settings.phoneDisplay}
                      </a>
                    </p>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp: {settings.whatsappDisplay}</span>
                    </p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-brand-black uppercase tracking-wider">
                      Direct Email
                    </h3>
                    <p className="text-sm text-neutral-700 mt-1">
                      <a href={`mailto:${settings.email}`} className="hover:text-brand-red">
                        {settings.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Business Hours Card */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-black text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-brand-black uppercase tracking-wider">
                      Operating Hours
                    </h3>
                    <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                      {settings.businessHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Box */}
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg text-center"
              >
                <div className="flex items-center justify-center gap-2 font-heading font-bold text-xs uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </div>
              </a>
            </div>

            {/* Right: Contact Inquiry Form */}
            <div className="lg:col-span-7 bg-neutral-50 border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-brand-black uppercase">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto">
                    Thank you for reaching out. Our Monaragala creative desk will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", company: "", phone: "", email: "", service: "Printing", message: "" });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-brand-black text-white text-xs font-heading font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-heading font-extrabold text-2xl text-brand-black uppercase">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Fill in the details below and we will contact you with answers or sample works.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Priyantha Kumara"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Uva Agro / Private"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 077 123 4567"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. info@business.lk"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Interested Service
                    </label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white"
                    >
                      <option value="Printing">Printing & Large Format</option>
                      <option value="Graphic Design">Graphic Design & Art</option>
                      <option value="Digital Marketing">Digital Marketing & Ads</option>
                      <option value="Photography">Photography</option>
                      <option value="Videography">Videography & Films</option>
                      <option value="Branding">Corporate Branding</option>
                      <option value="Other">Other Creative Solution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Message / Project Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you are looking to achieve..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Sending..." : "SEND MESSAGE"}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-12 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="font-heading font-bold text-xl text-brand-black uppercase">
              Location Map • Monaragala Studio
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Easily accessible on Wellawaya Road, Monaragala.
            </p>
          </div>

          <div className="w-full h-96 rounded-3xl overflow-hidden shadow-xl border border-neutral-300 bg-neutral-200">
            <iframe
              title="XMORE ART SOLUTIONS Location Map"
              src={settings.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
}
