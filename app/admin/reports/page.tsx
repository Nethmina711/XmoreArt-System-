"use client";

import React, { useState } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { formatCurrency } from "@/lib/utils";
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  PieChart, 
  Printer,
  Sparkles
} from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<"7D" | "30D" | "THIS_MONTH" | "ALL">("THIS_MONTH");

  const payments = DataStore.getPayments();
  const expenses = DataStore.getExpenses();
  const orders = DataStore.getOrders();
  const quotations = DataStore.getQuotations();
  const enquiries = DataStore.getEnquiries();
  const leads = DataStore.getLeads();
  const customers = DataStore.getCustomers();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const pendingReceivables = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

  const approvedQuotes = quotations.filter(q => q.status === "APPROVED").length;
  const quoteConversionRate = quotations.length > 0 ? Math.round((approvedQuotes / quotations.length) * 100) : 0;

  const convertedLeads = leads.filter(l => l.status === "CONVERTED").length;
  const leadConversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Financial & Operations Analytics
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Performance metrics, service profitability, channel ROI & conversion analytics
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-brand-dark-card border border-white/10 p-1 rounded-xl">
          {[
            { id: "7D", label: "Last 7 Days" },
            { id: "30D", label: "Last 30 Days" },
            { id: "THIS_MONTH", label: "This Month" },
            { id: "ALL", label: "All Time" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                dateRange === range.id
                  ? "bg-brand-red text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Revenue</span>
          <div className="font-heading font-black text-2xl text-emerald-400 mt-1 font-mono">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Paid invoice settlements</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Expenses</span>
          <div className="font-heading font-black text-2xl text-red-400 mt-1 font-mono">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Media, supplies & transport</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Estimated Net Profit</span>
          <div className="font-heading font-black text-2xl text-white mt-1 font-mono">
            {formatCurrency(netProfit)}
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
            {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}% Profit Margin
          </p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Outstanding Balances</span>
          <div className="font-heading font-black text-2xl text-amber-400 mt-1 font-mono">
            {formatCurrency(pendingReceivables)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Customer receivables</p>
        </div>
      </div>

      {/* Analytics Breakdown Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quotation & Lead Conversion Rates */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-heading font-bold text-lg text-white">
            Conversion & Close Ratios
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-300">Quotation Approval Rate</span>
                <span className="text-emerald-400 font-bold font-mono">{quoteConversionRate}% ({approvedQuotes}/{quotations.length})</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${quoteConversionRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-300">CRM Lead to Client Conversion</span>
                <span className="text-purple-400 font-bold font-mono">{leadConversionRate}% ({convertedLeads}/{leads.length})</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${leadConversionRate}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs">
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Inbound Enquiries</span>
              <span className="font-heading font-bold text-xl text-white mt-1 block">{enquiries.length}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Registered Clients</span>
              <span className="font-heading font-bold text-xl text-white mt-1 block">{customers.length}</span>
            </div>
          </div>
        </div>

        {/* Lead Sources Distribution */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-heading font-bold text-lg text-white">
            Inbound Channels & Acquisition
          </h2>

          <div className="space-y-3 text-xs">
            {[
              { source: "WhatsApp (Direct & Floating CTA)", share: 40, count: "High intent" },
              { source: "Website Quote Wizard", share: 30, count: "Detailed briefs" },
              { source: "Facebook & Meta Ads", share: 15, count: "Retainers & local leads" },
              { source: "Walk-in & Local Monaragala Studio", share: 10, count: "Immediate counter" },
              { source: "TikTok & Instagram", share: 5, count: "Reels & wedding inquires" },
            ].map((ch, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{ch.source}</p>
                  <p className="text-[10px] text-neutral-400">{ch.count}</p>
                </div>
                <span className="font-heading font-extrabold text-sm text-brand-red font-mono">
                  {ch.share}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
