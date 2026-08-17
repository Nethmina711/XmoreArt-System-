"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DataStore } from "@/lib/data/dataStore";
import { Quotation, QuotationItem, QuotationStatus, Order } from "@/lib/types";
import { formatCurrency, formatDate, generateQuotationNumber, generateOrderNumber, getWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/lib/context/SettingsContext";
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Trash2, 
  Printer, 
  MessageCircle, 
  Check, 
  X, 
  ArrowUpRight, 
  ShoppingBag, 
  Sparkles, 
  Share2,
  Calendar,
  Building,
  DollarSign
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

function QuotationsContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const [quotations, setQuotations] = useState<Quotation[]>(DataStore.getQuotations());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  // Builder Form State
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerCompany: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    title: "",
    items: [
      { id: "item-1", description: "Design & Prepress Artwork Proofing", quantity: 1, rate: 5000, amount: 5000 },
    ] as QuotationItem[],
    discountPercentage: 0,
    taxPercentage: 0,
    notes: "Includes 3 rounds of creative revisions. Turnaround: 3-5 working days.",
    terms: settings.quotationTerms,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "DRAFT" as QuotationStatus,
  });

  const loadData = () => {
    setQuotations(DataStore.getQuotations());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  // Check if opened with an enquiry query param
  useEffect(() => {
    const enquiryId = searchParams.get("newForEnquiry");
    if (enquiryId) {
      const enq = DataStore.getEnquiryById(enquiryId);
      if (enq) {
        setFormData({
          customerId: enq.customerId || "",
          customerName: enq.customerName,
          customerCompany: enq.company || "",
          customerEmail: enq.email,
          customerPhone: enq.phone,
          customerAddress: enq.location || "",
          title: `${enq.service} - ${enq.description.slice(0, 50)}...`,
          items: [
            {
              id: "item-1",
              description: `${enq.service} Production & Custom Specification`,
              quantity: 1,
              rate: 25000,
              amount: 25000,
            }
          ],
          discountPercentage: 0,
          taxPercentage: 0,
          notes: `Based on enquiry ${enq.enquiryNumber}. ${enq.description}`,
          terms: settings.quotationTerms,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "DRAFT",
        });
        setIsBuilderOpen(true);
      }
    }
  }, [searchParams, settings.quotationTerms]);

  // Line item manipulation
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `item-${Date.now()}`,
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        }
      ]
    }));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    setFormData(prev => {
      const updated = [...prev.items];
      const item = { ...updated[index], [field]: value };
      if (field === "quantity" || field === "rate") {
        item.amount = Number(item.quantity) * Number(item.rate);
      }
      updated[index] = item;
      return { ...prev, items: updated };
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Calculations
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = (subtotal * formData.discountPercentage) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * formData.taxPercentage) / 100;
  const total = taxable + taxAmount;

  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || formData.items.length === 0) return;

    const quotationNumber = editingQuotation 
      ? editingQuotation.quotationNumber 
      : generateQuotationNumber();

    const quoteToSave: Quotation = {
      id: editingQuotation ? editingQuotation.id : `quot-${Date.now()}`,
      quotationNumber,
      customerId: formData.customerId || `cust-${Date.now()}`,
      customerName: formData.customerName,
      customerCompany: formData.customerCompany || undefined,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      title: formData.title || "Creative Production Scope",
      items: formData.items,
      subtotal,
      discountPercentage: formData.discountPercentage,
      discountAmount,
      taxPercentage: formData.taxPercentage,
      taxAmount,
      total,
      notes: formData.notes,
      terms: formData.terms,
      validUntil: formData.validUntil,
      status: formData.status,
      createdAt: editingQuotation ? editingQuotation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveQuotation(quoteToSave);
    setIsBuilderOpen(false);
    loadData();
  };

  const handleConvertToOrder = (quote: Quotation) => {
    const orderNumber = generateOrderNumber();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      quotationId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      service: quote.title,
      description: quote.items.map(i => `${i.quantity}x ${i.description}`).join(", "),
      amount: quote.total,
      paidAmount: 0,
      balance: quote.total,
      deadline: quote.validUntil,
      status: "IN_PROGRESS",
      assignedTeam: ["Dinuka Perera", "Chathura Gamage"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveOrder(newOrder);
    DataStore.saveQuotation({ ...quote, status: "APPROVED" });
    DataStore.addNotification({
      title: "Order Created From Quotation",
      message: `Order ${orderNumber} (Rs. ${quote.total.toLocaleString()}) created for ${quote.customerName}.`,
      type: "PROJECT",
      link: "/admin/orders",
    });
    loadData();
    alert(`Quotation successfully converted to Order ${orderNumber}!`);
  };

  const getStatusBadge = (st: QuotationStatus) => {
    switch (st) {
      case "DRAFT": return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
      case "SENT": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "APPROVED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "REJECTED": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "EXPIRED": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const filteredQuotes = quotations.filter(q => {
    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    const matchesSearch = 
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Quotation Generator & Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Build itemized quotations, calculate taxes/discounts & export to PDF / WhatsApp
          </p>
        </div>

        <button
          onClick={() => {
            setEditingQuotation(null);
            setFormData({
              customerId: "",
              customerName: "",
              customerCompany: "",
              customerEmail: "",
              customerPhone: "",
              customerAddress: "",
              title: "Creative Production Scope",
              items: [{ id: "item-1", description: "Design & Printing Production", quantity: 1, rate: 25000, amount: 25000 }],
              discountPercentage: 0,
              taxPercentage: 0,
              notes: "Includes 3 rounds of creative revisions.",
              terms: settings.quotationTerms,
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "DRAFT",
            });
            setIsBuilderOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search quotation #, customer, or title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {["ALL", "DRAFT", "SENT", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? "bg-brand-red text-white"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Quote Ref & Title</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Total (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Valid Until</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p className="font-semibold text-neutral-300">No quotations generated yet</p>
                      <p className="text-[11px] text-neutral-500">
                        Create your first itemized quotation to send PDF proposals or WhatsApp estimates to your clients.
                      </p>
                      <button
                        onClick={() => {
                          setEditingQuotation(null);
                          setFormData({
                            customerId: "",
                            customerName: "",
                            customerCompany: "",
                            customerEmail: "",
                            customerPhone: "",
                            customerAddress: "",
                            title: "Creative Production Scope",
                            items: [{ id: "item-1", description: "Design & Printing Production", quantity: 1, rate: 25000, amount: 25000 }],
                            discountPercentage: 0,
                            taxPercentage: 0,
                            notes: "Includes 3 rounds of creative revisions.",
                            terms: settings.quotationTerms,
                            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                            status: "DRAFT",
                          });
                          setIsBuilderOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider"
                      >
                        + Create First Quotation
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => {
                  const whatsappQuoteMsg = `*XMORE ART SOLUTIONS - Official Quotation*\n\n*Quote Ref:* ${quote.quotationNumber}\n*Customer:* ${quote.customerName}\n*Title:* ${quote.title}\n\n*Items:*\n${quote.items.map(i => `• ${i.description} (${i.quantity} @ Rs. ${i.rate.toLocaleString()}) = Rs. ${i.amount.toLocaleString()}`).join("\n")}\n\n*Total Amount:* Rs. ${quote.total.toLocaleString()}\n*Valid Until:* ${quote.validUntil}\n\nThank you for choosing XMORE ART SOLUTIONS, Monaragala.`;
                  const whatsappUrl = getWhatsAppLink(quote.customerPhone, whatsappQuoteMsg);

                  return (
                    <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-heading font-bold text-sm text-white font-mono">
                          {quote.quotationNumber}
                        </p>
                        <p className="text-[11px] text-neutral-400 line-clamp-1">{quote.title}</p>
                      </td>

                      <td className="py-4 px-4 text-neutral-300">
                        <p className="font-semibold text-white">{quote.customerName}</p>
                        <p className="text-[10px] text-neutral-500">{quote.customerPhone}</p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-emerald-400 font-mono text-sm">
                          {formatCurrency(quote.total)}
                        </p>
                        <p className="text-[10px] text-neutral-400">{quote.items.length} line items</p>
                      </td>

                      <td className="py-4 px-4 text-neutral-400 whitespace-nowrap">
                        {quote.validUntil}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        {/* PDF Print Preview */}
                        <button
                          onClick={() => setPreviewQuotation(quote)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                          title="Preview & Print PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp Share */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white inline-block"
                          title="Send via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* Convert to Order */}
                        {quote.status !== "APPROVED" && (
                          <button
                            onClick={() => handleConvertToOrder(quote)}
                            className="p-1.5 rounded-lg bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white"
                            title="Convert to Order"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUOTATION BUILDER MODAL */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsBuilderOpen(false)}
          />

          <div className="w-full max-w-4xl bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 my-8 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-heading font-bold text-xl text-white">
                  {editingQuotation ? `Edit Quotation ${editingQuotation.quotationNumber}` : "Quotation Builder"}
                </h2>
                <p className="text-xs text-neutral-400">XMORE ART SOLUTIONS Quotation Engine</p>
              </div>
              <button onClick={() => setIsBuilderOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-6">
              
              {/* Customer & Scope Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerCompany}
                    onChange={e => setFormData({ ...formData, customerCompany: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Customer Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Quotation Title / Scope Overview
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 5,000 Luxury Foil Business Cards"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Validity Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Line Items Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                    Itemized Deliverables & Rates
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Item description / specification..."
                          value={item.description}
                          onChange={e => updateItem(idx, "description", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={e => updateItem(idx, "quantity", parseFloat(e.target.value) || 1)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="Rate (LKR)"
                          value={item.rate}
                          onChange={e => updateItem(idx, "rate", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-1 text-right font-mono font-bold text-xs text-emerald-400">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount, Tax & Totals Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={e => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Notes & Special Conditions
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  {formData.discountPercentage > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>Discount ({formData.discountPercentage}%):</span>
                      <span className="font-mono">- {formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-emerald-400">
                    <span>Final Total (LKR):</span>
                    <span className="font-mono text-xl">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Submit / Save */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/25"
                >
                  Save & Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL PDF / PRINT PREVIEW MODAL */}
      {previewQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-white text-black rounded-3xl p-8 sm:p-12 shadow-2xl relative my-8 print-page animate-fade-in">
            
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-200 no-print">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-neutral-700">Official Document Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-brand-black text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button onClick={() => setPreviewQuotation(null)} className="p-2 text-neutral-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Quotation Document Template */}
            <div className="space-y-8 text-neutral-800">
              
              {/* Top Document Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-brand-red">
                <div>
                  <div className="mb-2">
                    <BrandLogo variant="light" size="lg" href={undefined} />
                  </div>
                  <p className="text-xs text-neutral-600 font-medium">Creative solutions under one roof.</p>
                  <p className="text-xs text-neutral-500 mt-1">{settings.address}, Sri Lanka</p>
                  <p className="text-xs text-neutral-500">Hotline: {settings.phoneDisplay} • WhatsApp: {settings.whatsappDisplay}</p>
                </div>

                <div className="text-right">
                  <span className="font-heading font-black text-2xl tracking-widest text-brand-red uppercase">
                    QUOTATION
                  </span>
                  <p className="font-mono font-bold text-sm text-neutral-900 mt-1">
                    {previewQuotation.quotationNumber}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Date: {formatDate(previewQuotation.createdAt)}</p>
                  <p className="text-xs text-neutral-500">Valid Until: {previewQuotation.validUntil}</p>
                </div>
              </div>

              {/* Customer & Scope Info */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div>
                  <span className="text-[11px] uppercase font-bold text-neutral-400 block mb-1">Quotation For:</span>
                  <p className="font-bold text-base text-black">{previewQuotation.customerName}</p>
                  {previewQuotation.customerCompany && <p className="text-neutral-700 font-medium">{previewQuotation.customerCompany}</p>}
                  <p className="text-neutral-600">{previewQuotation.customerPhone}</p>
                  <p className="text-neutral-600">{previewQuotation.customerEmail}</p>
                </div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-neutral-400 block mb-1">Project Scope:</span>
                  <p className="font-bold text-sm text-black">{previewQuotation.title}</p>
                  <p className="text-neutral-600 mt-1">{previewQuotation.notes}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-y border-neutral-300 text-neutral-700 uppercase">
                    <th className="py-2.5 px-3 font-bold">#</th>
                    <th className="py-2.5 px-3 font-bold">Description</th>
                    <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                    <th className="py-2.5 px-3 font-bold text-right">Unit Rate (LKR)</th>
                    <th className="py-2.5 px-3 font-bold text-right">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {previewQuotation.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 text-neutral-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-medium text-black">{item.description}</td>
                      <td className="py-3 px-3 text-center">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatCurrency(item.rate)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-black">{formatCurrency(previewQuotation.subtotal)}</span>
                  </div>
                  {previewQuotation.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({previewQuotation.discountPercentage}%):</span>
                      <span className="font-mono font-bold">- {formatCurrency(previewQuotation.discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t-2 border-black flex justify-between text-sm font-black text-black">
                    <span>Total Amount (LKR):</span>
                    <span className="font-mono text-base">{formatCurrency(previewQuotation.total)}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Payment Conditions */}
              <div className="pt-6 border-t border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                <strong className="text-black uppercase block">Terms & Conditions:</strong>
                <p className="whitespace-pre-line leading-relaxed">{previewQuotation.terms}</p>
              </div>

              {/* Signatures */}
              <div className="pt-12 flex justify-between text-xs text-neutral-600">
                <div className="text-center">
                  <div className="w-40 border-b border-neutral-400 mb-1" />
                  <span>Prepared By: Accounts Desk</span>
                </div>
                <div className="text-center">
                  <div className="w-40 border-b border-neutral-400 mb-1" />
                  <span>Authorized Signature / Stamp</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function QuotationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400 text-sm">Loading quotation suite...</div>}>
      <QuotationsContent />
    </Suspense>
  );
}
