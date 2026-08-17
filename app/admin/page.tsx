"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataStore } from "@/lib/data/dataStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Users, 
  MessageSquare, 
  FileSpreadsheet, 
  Briefcase, 
  DollarSign, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const [customers, setCustomers] = useState(DataStore.getCustomers());
  const [enquiries, setEnquiries] = useState(DataStore.getEnquiries());
  const [quotations, setQuotations] = useState(DataStore.getQuotations());
  const [orders, setOrders] = useState(DataStore.getOrders());
  const [projects, setProjects] = useState(DataStore.getProjects());
  const [tasks, setTasks] = useState(DataStore.getTasks());
  const [payments, setPayments] = useState(DataStore.getPayments());
  const [expenses, setExpenses] = useState(DataStore.getExpenses());
  const [leads, setLeads] = useState(DataStore.getLeads());

  useEffect(() => {
    const handleDataUpdate = () => {
      setCustomers(DataStore.getCustomers());
      setEnquiries(DataStore.getEnquiries());
      setQuotations(DataStore.getQuotations());
      setOrders(DataStore.getOrders());
      setProjects(DataStore.getProjects());
      setTasks(DataStore.getTasks());
      setPayments(DataStore.getPayments());
      setExpenses(DataStore.getExpenses());
      setLeads(DataStore.getLeads());
    };
    window.addEventListener("xmore_data_updated", handleDataUpdate);
    return () => window.removeEventListener("xmore_data_updated", handleDataUpdate);
  }, []);

  // Financial calculations
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedProfit = totalRevenue - totalExpenses;
  const pendingCustomerBalance = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
  const newEnquiriesCount = enquiries.filter(e => e.status === "NEW").length;
  const pendingQuotationsCount = quotations.filter(q => q.status === "SENT" || q.status === "DRAFT").length;
  const activeProjectsCount = projects.filter(p => p.status === "IN_PROGRESS" || p.status === "PLANNED").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "HIGH": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "MEDIUM": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "QUOTATION_SENT": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "APPROVED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "IN_PROGRESS": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "COMPLETED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-brand-red font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Live Monaragala Studio Operations
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Executive Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotations"
            className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
          >
            <span>+ Build Quotation</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            View Enquiries ({newEnquiriesCount})
          </Link>
        </div>
      </div>

      {/* 6 Core KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Customers */}
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase">Customers</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-white">
            {customers.length}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Active business records</p>
        </div>

        {/* New Enquiries */}
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 hover:border-brand-red/50 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase">New Enquiries</span>
            <MessageSquare className="w-4 h-4 text-brand-red" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-brand-red">
            {newEnquiriesCount}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">{enquiries.length} total received</p>
        </div>

        {/* Pending Quotations */}
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase">Quotations</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-white">
            {pendingQuotationsCount}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Pending approval</p>
        </div>

        {/* Active Projects */}
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase">Active Projects</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-white">
            {activeProjectsCount}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">In design / production</p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-emerald-400">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Payments collected</p>
        </div>

        {/* Pending Balance */}
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase">Receivables</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-amber-400">
            {formatCurrency(pendingCustomerBalance)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Pending settlement</p>
        </div>

      </div>

      {/* Financial Health & Service Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue vs Expenses vs Profit Chart */}
        <div className="lg:col-span-7 bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-lg text-white">
                Financial Operations (LKR)
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Cash inflow, operational materials & calculated profit
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 font-medium">Net Profit</span>
              <p className="font-heading font-extrabold text-lg text-emerald-400">
                {formatCurrency(estimatedProfit)}
              </p>
            </div>
          </div>

          {/* Graphical Bars */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-300 font-medium">Total Inbound Payments</span>
                <span className="text-emerald-400 font-bold font-mono">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-300 font-medium">Materials & Operational Expenses</span>
                <span className="text-red-400 font-bold font-mono">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-brand-red rounded-full" 
                  style={{ width: `${Math.min(100, Math.round((totalExpenses / (totalRevenue || 1)) * 100))}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-300 font-medium">Pending Client Receivables</span>
                <span className="text-amber-400 font-bold font-mono">{formatCurrency(pendingCustomerBalance)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${Math.min(100, Math.round((pendingCustomerBalance / (totalRevenue || 1)) * 100))}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center text-xs">
            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-neutral-400 text-[10px] uppercase font-bold block">Profit Margin</span>
              <span className="font-heading font-extrabold text-base text-white mt-0.5">
                {totalRevenue > 0 ? Math.round((estimatedProfit / totalRevenue) * 100) : 0}%
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-neutral-400 text-[10px] uppercase font-bold block">Active Orders</span>
              <span className="font-heading font-extrabold text-base text-white mt-0.5">
                {orders.length}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-neutral-400 text-[10px] uppercase font-bold block">Quote Close Rate</span>
              <span className="font-heading font-extrabold text-base text-emerald-400 mt-0.5">
                72.4%
              </span>
            </div>
          </div>
        </div>

        {/* Demand by Service Channel */}
        <div className="lg:col-span-5 bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-white">
              Service Demand Breakdown
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Client requests by creative vertical
            </p>

            <div className="mt-6 space-y-4">
              {[
                { name: "Printing & Banners", share: 38, count: "42 jobs", color: "bg-brand-red" },
                { name: "Videography & 4K Ads", share: 24, count: "18 jobs", color: "bg-purple-500" },
                { name: "Branding & Identities", share: 18, count: "12 jobs", color: "bg-blue-500" },
                { name: "Digital Marketing", share: 12, count: "8 retainers", color: "bg-emerald-500" },
                { name: "Photography & Weddings", share: 8, count: "6 shoots", color: "bg-amber-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-300 font-medium">{item.name}</span>
                    <span className="text-neutral-400">{item.share}% ({item.count})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
            <span>Primary Driver: Offset & Large Format</span>
            <Link href="/admin/reports" className="text-brand-red hover:underline font-bold flex items-center gap-1">
              <span>Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Enquiries & Active Projects Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Enquiries Table */}
        <div className="lg:col-span-8 bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-lg text-white">
                Recent Quote Enquiries
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Inbound requests awaiting response or quotation
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-brand-red hover:underline uppercase tracking-wider"
            >
              View All ({enquiries.length}) &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Ref & Customer</th>
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500 text-xs italic">
                      No customer enquiries yet. Incoming requests from the website will appear here.
                    </td>
                  </tr>
                ) : (
                  enquiries.slice(0, 5).map((enq) => (
                    <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-white font-heading">{enq.customerName}</p>
                        <p className="text-[10px] font-mono text-neutral-400">{enq.enquiryNumber}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-neutral-300">
                        {enq.service}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                          {enq.source}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusColor(enq.status)}`}>
                          {enq.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-neutral-400 whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/enquiries?id=${enq.id}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-red text-neutral-300 hover:text-white transition-colors inline-block"
                          title="Manage enquiry"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-4 bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-lg text-white">
                  Studio Tasks
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Urgent and pending assignments
                </p>
              </div>
              <Link
                href="/admin/tasks"
                className="text-xs font-bold text-brand-red hover:underline uppercase tracking-wider"
              >
                Board &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs italic bg-white/5 rounded-2xl border border-white/5 p-4">
                  No active tasks. Click below to organize your studio workflow.
                </div>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {task.deadline}
                      </span>
                    </div>
                    <h4 className="font-medium text-xs text-white line-clamp-1">
                      {task.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2">
                      <span>{task.projectTitle}</span>
                      <span className="text-neutral-300 font-semibold">{task.assignedToName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link
              href="/admin/tasks"
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Complete Task Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Active Projects Pipeline */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-lg text-white">
              Active Production Projects
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live milestones and team progress
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-bold text-brand-red hover:underline uppercase tracking-wider"
          >
            View Projects Hub &rarr;
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 bg-white/5 border border-white/5 rounded-2xl p-6 text-neutral-500 text-xs italic">
            No production projects currently in progress. Convert customer orders into projects from the Orders tab or click &quot;New Project&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-neutral-400">{proj.projectNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(proj.status)}`}>
                      {proj.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-white line-clamp-1 mb-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-4">{proj.customerName}</p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Progress</span>
                      <span className="font-bold text-white font-mono">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className="h-full bg-brand-red rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Budget: <strong className="text-white font-mono">{formatCurrency(proj.budget)}</strong></span>
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    {proj.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
