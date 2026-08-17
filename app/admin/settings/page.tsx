"use client";

import React, { useState } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import { CompanySettings } from "@/lib/types";
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Check, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe 
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useSettings();
  const [form, setForm] = useState<CompanySettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm("Reset all CRM, quote, customer and portfolio records to fresh realistic Monaragala demo data?")) {
      resetAllData();
      alert("Database reset to pristine initial state!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            System & Company Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure central studio contact numbers, WhatsApp triggers, addresses & quotation terms
          </p>
        </div>

        <button
          onClick={handleResetData}
          type="button"
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-semibold flex items-center gap-2 border border-red-500/20 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Business Identity */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
            <span>Business Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Company Brand Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Brand Tagline / Positioning
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Address / Street
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                District / Province
              </label>
              <input
                type="text"
                value={form.district}
                onChange={e => setForm({ ...form, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global WhatsApp & Hotline Contacts */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Central Communication Triggers</span>
          </h2>
          <p className="text-xs text-neutral-400 -mt-2">
            This number automatically connects all WhatsApp CTAs across the entire website and quote dispatchers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                WhatsApp Raw Number (Numeric with Country Code)
              </label>
              <input
                type="text"
                placeholder="e.g. 94716666643"
                value={form.whatsappNumber}
                onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                WhatsApp Display Format
              </label>
              <input
                type="text"
                placeholder="e.g. +94 71 666 6643"
                value={form.whatsappDisplay}
                onChange={e => setForm({ ...form, whatsappDisplay: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Studio Direct Phone
              </label>
              <input
                type="text"
                value={form.phoneDisplay}
                onChange={e => setForm({ ...form, phoneDisplay: e.target.value, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Studio Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Studio Operating Hours
            </label>
            <input
              type="text"
              value={form.businessHours}
              onChange={e => setForm({ ...form, businessHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        {/* Currency & Quotation Default Terms */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
            <span>Currency & Quotation Engine Defaults</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={e => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Currency Code
              </label>
              <input
                type="text"
                value={form.currencyCode}
                onChange={e => setForm({ ...form, currencyCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Default Quotation Terms & Conditions
            </label>
            <textarea
              rows={4}
              value={form.quotationTerms}
              onChange={e => setForm({ ...form, quotationTerms: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Settings Saved & Synchronized Everywhere!
            </span>
          ) : (
            <span className="text-xs text-neutral-500">
              Changes apply instantly across all client & admin interfaces.
            </span>
          )}

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-xl shadow-brand-red/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE ALL SETTINGS</span>
          </button>
        </div>

      </form>
    </div>
  );
}
