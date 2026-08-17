"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Lead, LeadStatus, LeadSource } from "@/lib/types";
import { formatCurrency, formatDate, getWhatsAppLink } from "@/lib/utils";
import { initialEmployees } from "@/lib/data/seedData";
import { 
  TrendingUp, 
  Search, 
  Plus, 
  Phone, 
  MessageCircle, 
  Filter, 
  Check, 
  X, 
  ArrowUpRight, 
  DollarSign, 
  Users 
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(DataStore.getLeads());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    email: "",
    source: "Facebook" as LeadSource,
    service: "Printing",
    estimatedValue: 35000,
    status: "NEW" as LeadStatus,
    assignedToId: "emp-3",
    notes: "",
  });

  const loadData = () => {
    setLeads(DataStore.getLeads());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const allStatuses: LeadStatus[] = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "QUOTED",
    "CONVERTED",
    "LOST"
  ];

  const allSources: LeadSource[] = [
    "Facebook",
    "Instagram",
    "TikTok",
    "WhatsApp",
    "Website",
    "Google",
    "Walk-in",
    "Referral",
    "Other"
  ];

  const convertedCount = leads.filter(l => l.status === "CONVERTED").length;
  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;
  const pipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

  const filteredLeads = leads.filter(l => {
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.phone.includes(searchQuery) ||
      l.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (leadId: string, newStatus: LeadStatus) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    DataStore.saveLead({ ...target, status: newStatus });
    loadData();
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const assignedStaff = initialEmployees.find(emp => emp.id === formData.assignedToId);

    const leadToSave: Lead = {
      id: editingLead ? editingLead.id : `lead-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      company: formData.company || undefined,
      email: formData.email || undefined,
      source: formData.source,
      service: formData.service,
      estimatedValue: Number(formData.estimatedValue) || 0,
      status: formData.status,
      assignedToId: formData.assignedToId,
      assignedToName: assignedStaff ? assignedStaff.name : undefined,
      notes: formData.notes || undefined,
      createdAt: editingLead ? editingLead.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveLead(leadToSave);
    setIsModalOpen(false);
    loadData();
  };

  const getStatusBadge = (st: LeadStatus) => {
    switch (st) {
      case "NEW": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "CONTACTED": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "QUALIFIED": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "QUOTED": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "CONVERTED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "LOST": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Lead Acquisition & CRM Funnel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track inquiries from TikTok, Meta Ads, WhatsApp and walk-ins to conversion
          </p>
        </div>

        <button
          onClick={() => {
            setEditingLead(null);
            setFormData({
              name: "",
              phone: "",
              company: "",
              email: "",
              source: "Facebook",
              service: "Printing",
              estimatedValue: 35000,
              status: "NEW",
              assignedToId: "emp-3",
              notes: "",
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Leads</span>
          <div className="font-heading font-black text-2xl text-white mt-1">
            {leads.length}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Active inbound opportunities</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Pipeline Value</span>
          <div className="font-heading font-black text-2xl text-emerald-400 mt-1 font-mono">
            {formatCurrency(pipelineValue)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Estimated revenue potential</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Conversion Rate</span>
          <div className="font-heading font-black text-2xl text-purple-400 mt-1 font-mono">
            {conversionRate}%
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">{convertedCount} leads turned to paying clients</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Top Channel</span>
          <div className="font-heading font-black text-2xl text-brand-red mt-1">
            Facebook & TikTok
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Direct click-to-WhatsApp funnels</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search lead name, phone, source, service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === "ALL" ? "bg-brand-red text-white" : "bg-white/5 text-neutral-400"
            }`}
          >
            All ({leads.length})
          </button>
          {allStatuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                statusFilter === st ? "bg-brand-red text-white" : "bg-white/5 text-neutral-400"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Lead Name</th>
                <th className="py-3.5 px-4 font-semibold">Phone / WhatsApp</th>
                <th className="py-3.5 px-4 font-semibold">Source</th>
                <th className="py-3.5 px-4 font-semibold">Service & Value</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Assigned To</th>
                <th className="py-3.5 px-6 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p className="font-semibold text-neutral-300">No inbound leads recorded</p>
                      <p className="text-[11px] text-neutral-500">
                        Inquiries from Facebook Ads, TikTok, Google, or walk-in visits will be tracked here.
                      </p>
                      <button
                        onClick={() => {
                          setEditingLead(null);
                          setFormData({
                            name: "",
                            phone: "",
                            company: "",
                            email: "",
                            source: "Facebook",
                            service: "Printing",
                            estimatedValue: 35000,
                            status: "NEW",
                            assignedToId: "",
                            notes: "",
                          });
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider"
                      >
                        + Add First Lead
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-heading font-bold text-sm text-white">{lead.name}</p>
                      {lead.company && <p className="text-[10px] text-neutral-400">{lead.company}</p>}
                    </td>

                    <td className="py-4 px-4 text-neutral-300">
                      <div className="flex items-center gap-2">
                        <span>{lead.phone}</span>
                        <a
                          href={getWhatsAppLink(lead.phone, `Hello ${lead.name}! Following up on your inquiry with XMORE ART SOLUTIONS.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-white"
                          title="Direct WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                        {lead.source}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-medium text-white">{lead.service}</p>
                      <p className="text-[10px] text-emerald-400 font-mono font-bold">
                        {formatCurrency(lead.estimatedValue)}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold bg-black/40 border focus:outline-none ${getStatusBadge(lead.status)}`}
                      >
                        {allStatuses.map(st => (
                          <option key={st} value={st}>{st.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-4 text-neutral-400">
                      {lead.assignedToName || "Unassigned"}
                    </td>

                    <td className="py-4 px-6 text-right text-neutral-400 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Create New Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Lead / Prospect Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Acquisition Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    {allSources.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Service Interested
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    placeholder="e.g. Banners / Video"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Est. Value (LKR)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={e => setFormData({ ...formData, estimatedValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Assign Staff
                </label>
                <select
                  value={formData.assignedToId}
                  onChange={e => setFormData({ ...formData, assignedToId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                >
                  {initialEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Notes / Follow-up Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/25"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
