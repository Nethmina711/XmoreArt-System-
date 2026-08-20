"use client";

import React, { useState, useRef } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import { CompanySettings } from "@/lib/types";
import { CloudSync } from "@/lib/data/cloudSync";
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
  Globe,
  Cloud,
  CloudUpload,
  CloudDownload,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useSettings();
  const [form, setForm] = useState<CompanySettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cloud Sync state
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handlePushAllToCloud = async () => {
    setIsSyncing(true);
    setSyncStatus("Broadcasting all laptop data to central cloud server...");
    try {
      const res = await CloudSync.pushAllToCloud();
      if (res.success) {
        setSyncStatus("✅ All laptop customizations successfully synced to Cloud! Mobile devices & visitors will now see your live data.");
      } else {
        setSyncStatus(`❌ Sync error: ${res.message}`);
      }
    } catch (err: any) {
      setSyncStatus(`❌ Network error: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 8000);
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatus("Fetching latest cloud data...");
    try {
      const res = await CloudSync.pullFromCloud(true);
      if (res.success) {
        setSyncStatus(`✅ Updated local database from Cloud (${res.count || 0} collections refreshed).`);
      } else {
        setSyncStatus("ℹ️ Already up-to-date with cloud server.");
      }
    } catch (err: any) {
      setSyncStatus(`❌ Error pulling cloud data: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSyncing(true);
    setSyncStatus("Importing database snapshot...");
    try {
      const res = await CloudSync.importBackupJson(file);
      setSyncStatus(res.success ? `✅ ${res.message}` : `❌ ${res.message}`);
    } catch (err: any) {
      setSyncStatus(`❌ Import failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 8000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl text-white selection:bg-brand-red selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            System & Company Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure central studio contact numbers, WhatsApp triggers, addresses & cloud sync
          </p>
        </div>

        <button
          onClick={handleResetData}
          type="button"
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-semibold flex items-center gap-2 border border-red-500/20 transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* CLOUD SYNCHRONIZATION & MULTI-DEVICE SUITE */}
      <div className="bg-gradient-to-br from-brand-dark-card to-neutral-900 border-2 border-brand-red/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="w-5 h-5 text-brand-red animate-pulse" />
              <h2 className="font-heading font-extrabold text-lg text-white uppercase tracking-wider">
                Multi-Device Cloud Synchronization
              </h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Broadcast your laptop customizations (Shoot Pricing, Packages, CMS, Employees, Bookings) to the central server so that all mobile phones, other browsers, and customers see your live data.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Universal Sync Enabled</span>
            </span>
          </div>
        </div>

        {syncStatus && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-200 animate-fade-in flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-brand-red ${isSyncing ? "animate-spin" : ""}`} />
            <span>{syncStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Push to Cloud Button */}
          <button
            type="button"
            disabled={isSyncing}
            onClick={handlePushAllToCloud}
            className="p-4 rounded-2xl bg-brand-red hover:bg-brand-red-dark text-white text-left transition-all shadow-lg shadow-brand-red/25 border border-brand-red/40 group disabled:opacity-50 flex items-start gap-3.5"
          >
            <CloudUpload className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform mt-0.5" />
            <div>
              <span className="font-heading font-bold text-sm uppercase block tracking-wider">
                1. Push Laptop Data to Cloud
              </span>
              <span className="text-[11px] text-white/80 block mt-0.5 leading-snug">
                Broadcasts all your current custom prices, packages, and shoot rates so every other device updates immediately.
              </span>
            </div>
          </button>

          {/* Pull from Cloud Button */}
          <button
            type="button"
            disabled={isSyncing}
            onClick={handlePullFromCloud}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-left transition-all border border-white/10 group disabled:opacity-50 flex items-start gap-3.5"
          >
            <CloudDownload className="w-6 h-6 text-brand-red shrink-0 group-hover:scale-110 transition-transform mt-0.5" />
            <div>
              <span className="font-heading font-bold text-sm uppercase block tracking-wider">
                2. Pull Latest from Cloud
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5 leading-snug">
                Refreshes this browser with the latest bookings and edits submitted across any device.
              </span>
            </div>
          </button>
        </div>

        {/* Backup & Restore Tools */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-neutral-400">
            Database Snapshot & Offline Backup:
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={CloudSync.exportBackupJson}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-brand-red" />
              <span>Export Backup (.json)</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json,application/json"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Backup (.json)</span>
            </button>
          </div>
        </div>
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
                value={form.whatsappNumber}
                onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="94716666643"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                WhatsApp Display Format
              </label>
              <input
                type="text"
                value={form.whatsappDisplay}
                onChange={e => setForm({ ...form, whatsappDisplay: e.target.value })}
                placeholder="+94 71 666 6643"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Hotline Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Official Business Email
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
