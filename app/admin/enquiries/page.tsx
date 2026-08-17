"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataStore } from "@/lib/data/dataStore";
import { Enquiry, EnquiryStatus, LeadSource } from "@/lib/types";
import { formatDate, getWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/lib/context/SettingsContext";
import { initialEmployees } from "@/lib/data/seedData";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Check, 
  X, 
  Calendar, 
  User, 
  Clock, 
  Sparkles, 
  ArrowUpRight,
  ChevronDown
} from "lucide-react";

export default function EnquiriesPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(DataStore.getEnquiries());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const loadData = () => {
    const list = DataStore.getEnquiries();
    setEnquiries(list);
    if (selectedEnquiry) {
      const refreshed = list.find(e => e.id === selectedEnquiry.id);
      if (refreshed) setSelectedEnquiry(refreshed);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, [selectedEnquiry?.id]);

  const allStatuses: EnquiryStatus[] = [
    "NEW",
    "CONTACTED",
    "REQUIREMENTS_COLLECTED",
    "QUOTATION_SENT",
    "NEGOTIATION",
    "APPROVED",
    "PROJECT_STARTED",
    "COMPLETED",
    "PAID",
    "ON_HOLD",
    "CANCELLED",
    "LOST"
  ];

  const filteredEnquiries = enquiries.filter(e => {
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesSearch = 
      e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (enquiryId: string, newStatus: EnquiryStatus) => {
    const target = enquiries.find(e => e.id === enquiryId);
    if (!target) return;
    const updated = { ...target, status: newStatus };
    DataStore.saveEnquiry(updated);
    loadData();
  };

  const handleAssignStaff = (enquiryId: string, staffId: string) => {
    const target = enquiries.find(e => e.id === enquiryId);
    const staff = initialEmployees.find(emp => emp.id === staffId);
    if (!target || !staff) return;
    const updated = { 
      ...target, 
      assignedStaffId: staff.id, 
      assignedStaffName: staff.name 
    };
    DataStore.saveEnquiry(updated);
    loadData();
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "CONTACTED": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "REQUIREMENTS_COLLECTED": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "QUOTATION_SENT": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "APPROVED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "PROJECT_STARTED": return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "COMPLETED": return "bg-emerald-600/20 text-emerald-400 border-emerald-600/30";
      case "ON_HOLD": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "CANCELLED":
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
            Enquiry & Quote Pipeline
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track incoming quote requests, assign coordinators & dispatch quotations
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by customer, ref #, phone, service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        {/* Status Filter Scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === "ALL"
                ? "bg-brand-red text-white"
                : "bg-white/5 text-neutral-400 hover:bg-white/10"
            }`}
          >
            All ({enquiries.length})
          </button>
          {["NEW", "QUOTATION_SENT", "APPROVED", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-brand-red text-white"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Listing Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Ref & Customer</th>
                <th className="py-3.5 px-4 font-semibold">Service Required</th>
                <th className="py-3.5 px-4 font-semibold">Budget & Deadline</th>
                <th className="py-3.5 px-4 font-semibold">Source</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Staff</th>
                <th className="py-3.5 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-neutral-300">No enquiries in pipeline</p>
                      <p className="text-[11px] text-neutral-500">
                        Inbound quote requests from your website Quote Wizard and contact forms will automatically land here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <p className="font-heading font-bold text-sm text-white group-hover:text-brand-red transition-colors">
                        {enq.customerName}
                      </p>
                      <p className="text-[10px] font-mono text-neutral-400">{enq.enquiryNumber}</p>
                      {enq.company && <p className="text-[10px] text-neutral-500">{enq.company}</p>}
                    </td>

                    <td className="py-4 px-4 text-neutral-300">
                      <span className="font-semibold text-white">{enq.service}</span>
                      {enq.secondaryServices && enq.secondaryServices.length > 0 && (
                        <p className="text-[10px] text-brand-red">+ {enq.secondaryServices.join(", ")}</p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-medium text-white">{enq.estimatedBudget || "Flexible"}</p>
                      <p className="text-[10px] text-neutral-400">Due: {enq.deadline || "ASAP"}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                        {enq.source}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(enq.status)}`}>
                        {enq.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-neutral-400">
                      {enq.assignedStaffName || (
                        <span className="text-[10px] text-neutral-600 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(enq);
                        }}
                        className="p-1.5 rounded-lg bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white transition-colors"
                        title="Inspect enquiry"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENQUIRY DETAIL & MANAGEMENT DRAWER */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEnquiry(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-brand-dark-card border-l border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between animate-slide-up">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-lg text-brand-red font-mono">
                      {selectedEnquiry.enquiryNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-white mt-1">
                    {selectedEnquiry.customerName}
                  </h2>
                  {selectedEnquiry.company && (
                    <p className="text-xs text-neutral-400">{selectedEnquiry.company}</p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Dropdown */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Update Pipeline Status
                </label>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-dark-card border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-brand-red"
                >
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Coordinator */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Assign Staff Coordinator
                </label>
                <select
                  value={selectedEnquiry.assignedStaffId || ""}
                  onChange={(e) => handleAssignStaff(selectedEnquiry.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-dark-card border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-brand-red"
                >
                  <option value="">-- Select Staff Member --</option>
                  {initialEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Communication Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>Call {selectedEnquiry.phone}</span>
                </a>

                <a
                  href={getWhatsAppLink(
                    selectedEnquiry.whatsapp || selectedEnquiry.phone,
                    `Hello ${selectedEnquiry.customerName}! Regarding your quotation inquiry (${selectedEnquiry.enquiryNumber}) for ${selectedEnquiry.service} at XMORE ART SOLUTIONS:`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Requirement Specifications */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                <h3 className="font-heading font-bold text-white uppercase text-xs">
                  Specifications & Brief
                </h3>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block">Service:</span>
                    <strong>{selectedEnquiry.service}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Budget:</span>
                    <strong>{selectedEnquiry.estimatedBudget}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Quantity:</span>
                    <span>{selectedEnquiry.quantity || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Deadline:</span>
                    <span>{selectedEnquiry.deadline || "Flexible"}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-neutral-500 block mb-1">Customer Notes / Description:</span>
                  <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {selectedEnquiry.description}
                  </p>
                </div>
              </div>

              {/* Action: Convert to Quotation */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    router.push(`/admin/quotations?newForEnquiry=${selectedEnquiry.id}`);
                  }}
                  className="w-full py-4 rounded-2xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official Quotation From Enquiry</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
