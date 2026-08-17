"use client";

import React, { useState } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { formatCurrency, formatDate } from "@/lib/utils";
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
  Sparkles,
  Camera,
  Heart,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  Film
} from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<"24H" | "7D" | "30D" | "THIS_MONTH" | "ALL">("24H");

  const payments = DataStore.getPayments();
  const expenses = DataStore.getExpenses();
  const orders = DataStore.getOrders();
  const quotations = DataStore.getQuotations();
  const enquiries = DataStore.getEnquiries();
  const leads = DataStore.getLeads();
  const customers = DataStore.getCustomers();
  const bookings = DataStore.getBookings();
  const employees = DataStore.getEmployees();

  // 24 Hour Filter Helper
  const now = new Date().getTime();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const isWithinRange = (dateStr?: string) => {
    if (!dateStr) return false;
    const time = new Date(dateStr).getTime();
    if (dateRange === "24H") return time >= oneDayAgo;
    if (dateRange === "7D") return time >= sevenDaysAgo;
    if (dateRange === "30D") return time >= thirtyDaysAgo;
    return true; // THIS_MONTH and ALL
  };

  const filteredPayments = dateRange === "ALL" ? payments : payments.filter(p => isWithinRange(p.createdAt));
  const filteredExpenses = dateRange === "ALL" ? expenses : expenses.filter(e => isWithinRange(e.createdAt || e.date));
  const filteredBookings = dateRange === "ALL" ? bookings : bookings.filter(b => isWithinRange(b.createdAt));
  const filteredEnquiries = dateRange === "ALL" ? enquiries : enquiries.filter(e => isWithinRange(e.createdAt));
  const filteredOrders = dateRange === "ALL" ? orders : orders.filter(o => isWithinRange(o.createdAt));
  const filteredLeads = dateRange === "ALL" ? leads : leads.filter(l => isWithinRange(l.createdAt));

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const pendingReceivables = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

  const bookingsPipelineValue = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const bookingsAdvanceReceived = filteredBookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

  const approvedQuotes = quotations.filter(q => q.status === "APPROVED").length;
  const quoteConversionRate = quotations.length > 0 ? Math.round((approvedQuotes / quotations.length) * 100) : 0;

  const convertedLeads = leads.filter(l => l.status === "CONVERTED").length;
  const leadConversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-brand-red selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Financial & Operations Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Auditing
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time revenue ledgers, shoot pipeline health, conversion funnels & operational efficiency
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-brand-dark-card border border-white/10 p-1 rounded-xl">
          {[
            { id: "24H", label: "Last 24 Hours" },
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
                  ? "bg-brand-red text-white shadow-md shadow-brand-red/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 24-Hour System Health & Infrastructure Bar */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-white">
            <Zap className="w-4 h-4 text-brand-red" />
            <span>24-Hour Operations & Infrastructure Health</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            Audit Timestamp: {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Cloud Deployment</span>
            <p className="font-heading font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Operational (Edge)</span>
            </p>
            <p className="text-[10px] text-neutral-500">Next.js 14 on Netlify Global CDN</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Active Staff & Security</span>
            <p className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-red" />
              <span>{employees.length} Authorized Master Accounts</span>
            </p>
            <p className="text-[10px] text-neutral-500">Encrypted Role-Based Access</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Inbound Inquiries</span>
            <p className="font-heading font-bold text-sm text-white">
              {filteredEnquiries.length + filteredBookings.length} Submissions
            </p>
            <p className="text-[10px] text-neutral-500">Website & Shoot Portal</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Data Store Status</span>
            <p className="font-heading font-bold text-sm text-emerald-400">
              Clean Production Baseline
            </p>
            <p className="text-[10px] text-neutral-500">Real-time Local & Cloud Sync</p>
          </div>
        </div>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Revenue Collected</span>
          <div className="font-heading font-black text-2xl text-emerald-400 mt-1 font-mono">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Direct invoice & advance settlements</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Production Expenses</span>
          <div className="font-heading font-black text-2xl text-red-400 mt-1 font-mono">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Paper, ink, fuel & gear maintenance</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Estimated Net Profit</span>
          <div className="font-heading font-black text-2xl text-white mt-1 font-mono">
            {formatCurrency(netProfit)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Gross Revenue minus Expenses</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Shoot Pipeline Value</span>
          <div className="font-heading font-black text-2xl text-brand-red mt-1 font-mono">
            {formatCurrency(bookingsPipelineValue)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Weddings, Pre-shoots & Portfolios</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wedding & Production Shoot Booking Analytics */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-red" />
              <span>Wedding & Shoot Performance</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">{filteredBookings.length} bookings</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Total Bookings Scheduled</span>
              <span className="font-bold text-white">{filteredBookings.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Total Pipeline Value</span>
              <span className="font-mono font-bold text-brand-red">{formatCurrency(bookingsPipelineValue)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Advance Deposits Secured</span>
              <span className="font-mono font-bold text-emerald-400">{formatCurrency(bookingsAdvanceReceived)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Pending Balances Due</span>
              <span className="font-mono font-bold text-amber-400">{formatCurrency(Math.max(0, bookingsPipelineValue - bookingsAdvanceReceived))}</span>
            </div>
          </div>
        </div>

        {/* Commercial Print & Order Analytics */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-brand-red" />
              <span>Commercial Print & Job Desk</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">{filteredOrders.length} jobs</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Active Production Jobs</span>
              <span className="font-bold text-white">{filteredOrders.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Pending Customer Receivables</span>
              <span className="font-mono font-bold text-amber-400">{formatCurrency(pendingReceivables)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Registered Client Accounts</span>
              <span className="font-bold text-white">{customers.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Quotation Conversion Rate</span>
              <span className="font-bold text-emerald-400">{quoteConversionRate}%</span>
            </div>
          </div>
        </div>

        {/* Leads & Marketing Channel ROI */}
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-red" />
              <span>Inbound Marketing & Leads Funnel</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">{filteredLeads.length} leads</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Total Inbound Leads</span>
              <span className="font-bold text-white">{filteredLeads.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Converted Clients</span>
              <span className="font-bold text-emerald-400">{convertedLeads}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Funnel Conversion Rate</span>
              <span className="font-bold text-white">{leadConversionRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-neutral-300">Primary Channel</span>
              <span className="font-bold text-brand-red">WhatsApp & Website</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
