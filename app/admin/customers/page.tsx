"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Customer, Quotation, Order, Project, Payment } from "@/lib/types";
import { formatCurrency, formatDate, getWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/lib/context/SettingsContext";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Building, 
  FileText, 
  ShoppingBag, 
  Briefcase, 
  CreditCard, 
  X, 
  Edit, 
  Check, 
  ArrowUpRight,
  DollarSign
} from "lucide-react";

export default function CustomersPage() {
  const { settings } = useSettings();
  const [customers, setCustomers] = useState<Customer[]>(DataStore.getCustomers());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    notes: "",
    balance: 0,
  });

  const loadData = () => {
    const custs = DataStore.getCustomers();
    setCustomers(custs);
    if (selectedCustomer) {
      const refreshed = custs.find(c => c.id === selectedCustomer.id);
      if (refreshed) setSelectedCustomer(refreshed);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, [selectedCustomer?.id]);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      company: "",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      notes: "",
      balance: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      company: customer.company || "",
      phone: customer.phone,
      whatsapp: customer.whatsapp || customer.phone,
      email: customer.email,
      address: customer.address || "",
      notes: customer.notes || "",
      balance: customer.balance || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    const customerToSave: Customer = {
      id: editingCustomer ? editingCustomer.id : `cust-${Date.now()}`,
      name: formData.name,
      company: formData.company || undefined,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email,
      address: formData.address || undefined,
      notes: formData.notes || undefined,
      balance: Number(formData.balance) || 0,
      totalOrders: editingCustomer ? editingCustomer.totalOrders : 0,
      totalSpent: editingCustomer ? editingCustomer.totalSpent : 0,
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveCustomer(customerToSave);
    setIsModalOpen(false);
    loadData();
  };

  // Linked entities for 360 degree view
  const linkedQuotations = selectedCustomer 
    ? DataStore.getQuotations().filter(q => q.customerId === selectedCustomer.id) 
    : [];
  const linkedOrders = selectedCustomer 
    ? DataStore.getOrders().filter(o => o.customerId === selectedCustomer.id) 
    : [];
  const linkedProjects = selectedCustomer 
    ? DataStore.getProjects().filter(p => p.customerId === selectedCustomer.id) 
    : [];
  const linkedPayments = selectedCustomer 
    ? DataStore.getPayments().filter(p => p.customerId === selectedCustomer.id) 
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Customer CRM Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage client profiles, transaction history, orders & credit balances
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, company, phone, email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Customer / Company</th>
                <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                <th className="py-3.5 px-4 font-semibold">Orders & Spent</th>
                <th className="py-3.5 px-4 font-semibold">Balance</th>
                <th className="py-3.5 px-4 font-semibold">Registered</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p className="font-semibold text-neutral-300">No customers registered yet</p>
                      <p className="text-[11px] text-neutral-500">
                        Add your first client profile or receive quote requests from your public website to build your CRM.
                      </p>
                      <button
                        onClick={openAddModal}
                        className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider"
                      >
                        + Add First Customer
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-sm">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-sm text-white group-hover:text-brand-red transition-colors">
                            {cust.name}
                          </p>
                          {cust.company && (
                            <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {cust.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-neutral-300">
                      <p>{cust.phone}</p>
                      <p className="text-[11px] text-neutral-500">{cust.email}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-white font-mono">{formatCurrency(cust.totalSpent)}</p>
                      <p className="text-[10px] text-neutral-400">{cust.totalOrders || 0} completed orders</p>
                    </td>

                    <td className="py-4 px-4">
                      {(cust.balance || 0) > 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                          {formatCurrency(cust.balance)} Due
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-xs font-semibold">Settled</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-neutral-400 whitespace-nowrap">
                      {formatDate(cust.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(cust);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                        title="Edit Customer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        className="p-1.5 rounded-lg bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white transition-colors"
                        title="View 360 Profile"
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

      {/* 360-DEGREE CUSTOMER PROFILE DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-brand-dark-card border-l border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between animate-slide-up">
            <div className="space-y-6">
              
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center font-heading font-black text-xl">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-xl text-white">
                      {selectedCustomer.name}
                    </h2>
                    {selectedCustomer.company && (
                      <p className="text-xs text-neutral-400">{selectedCustomer.company}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Spent</span>
                  <span className="font-heading font-bold text-sm text-emerald-400 mt-1 block font-mono">
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Orders</span>
                  <span className="font-heading font-bold text-sm text-white mt-1 block">
                    {selectedCustomer.totalOrders || 0}
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Balance Due</span>
                  <span className={`font-heading font-bold text-sm mt-1 block font-mono ${
                    (selectedCustomer.balance || 0) > 0 ? "text-amber-400" : "text-neutral-400"
                  }`}>
                    {formatCurrency(selectedCustomer.balance)}
                  </span>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>Call {selectedCustomer.phone}</span>
                </a>

                <a
                  href={getWhatsAppLink(selectedCustomer.whatsapp || selectedCustomer.phone, `Hello ${selectedCustomer.name}! Reaching out from XMORE ART SOLUTIONS studio.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Address & Notes */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                {selectedCustomer.address && (
                  <p className="flex items-start gap-2 text-neutral-300">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>{selectedCustomer.address}</span>
                  </p>
                )}
                {selectedCustomer.notes && (
                  <div className="pt-2 border-t border-white/5 text-neutral-400">
                    <strong className="text-white block mb-1">Internal Notes:</strong>
                    <p className="italic">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>

              {/* Linked Quotations */}
              <div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-red" />
                  <span>Issued Quotations ({linkedQuotations.length})</span>
                </h3>
                {linkedQuotations.length === 0 ? (
                  <p className="text-xs text-neutral-500 bg-white/5 p-3 rounded-xl">No quotations on file</p>
                ) : (
                  <div className="space-y-2">
                    {linkedQuotations.map((q) => (
                      <div key={q.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white font-mono">{q.quotationNumber}</p>
                          <p className="text-neutral-400 text-[11px]">{q.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white font-mono">{formatCurrency(q.total)}</p>
                          <span className="text-[10px] text-brand-red uppercase font-semibold">{q.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Orders */}
              <div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-brand-red" />
                  <span>Orders & Production ({linkedOrders.length})</span>
                </h3>
                {linkedOrders.length === 0 ? (
                  <p className="text-xs text-neutral-500 bg-white/5 p-3 rounded-xl">No active orders</p>
                ) : (
                  <div className="space-y-2">
                    {linkedOrders.map((o) => (
                      <div key={o.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white font-mono">{o.orderNumber}</p>
                          <p className="text-neutral-400 text-[11px]">{o.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-400 font-mono">{formatCurrency(o.amount)}</p>
                          <span className="text-[10px] text-amber-400 uppercase font-semibold">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Payments */}
              <div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-brand-red" />
                  <span>Payment History ({linkedPayments.length})</span>
                </h3>
                {linkedPayments.length === 0 ? (
                  <p className="text-xs text-neutral-500 bg-white/5 p-3 rounded-xl">No payment logs</p>
                ) : (
                  <div className="space-y-2">
                    {linkedPayments.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{p.method} • {formatDate(p.date)}</p>
                          <p className="text-[10px] text-neutral-400">Ref: {p.reference || "N/A"}</p>
                        </div>
                        <p className="font-bold text-emerald-400 font-mono">{formatCurrency(p.amount)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom edit button */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                onClick={() => {
                  openEditModal(selectedCustomer);
                }}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors"
              >
                Edit Customer Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-lg bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingCustomer ? "Edit Customer Record" : "Add New Customer"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Address / City
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Outstanding Balance (LKR)
                </label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={e => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Private Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs"
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
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
