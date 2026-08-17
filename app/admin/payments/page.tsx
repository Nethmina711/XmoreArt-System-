"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Payment, PaymentMethod } from "@/lib/types";
import { formatCurrency, formatDate, generatePaymentNumber } from "@/lib/utils";
import { 
  CreditCard, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  User, 
  X, 
  Check, 
  ArrowUpRight 
} from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(DataStore.getPayments());
  const [customers, setCustomers] = useState(DataStore.getCustomers());
  const [orders, setOrders] = useState(DataStore.getOrders());
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    orderId: "",
    amount: 10000,
    method: "Bank Transfer" as PaymentMethod,
    date: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  const loadData = () => {
    setPayments(DataStore.getPayments());
    setCustomers(DataStore.getCustomers());
    setOrders(DataStore.getOrders());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(p =>
    p.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.reference && p.reference.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || formData.amount <= 0) return;

    const paymentId = generatePaymentNumber();
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      paymentId,
      customerId: formData.customerId || `cust-${Date.now()}`,
      customerName: formData.customerName,
      orderId: formData.orderId || undefined,
      amount: Number(formData.amount),
      method: formData.method,
      date: formData.date,
      reference: formData.reference || undefined,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    DataStore.savePayment(newPayment);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Inbound Payments Ledger
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Cash receipts, bank transfers, credit card settlements & client accounts
          </p>
        </div>

        <button
          onClick={() => {
            const firstCust = customers[0];
            setFormData({
              customerId: firstCust ? firstCust.id : "cust-1",
              customerName: firstCust ? firstCust.name : "Kasun Jayasundara",
              orderId: "",
              amount: 25000,
              method: "Bank Transfer",
              date: new Date().toISOString().split("T")[0],
              reference: "",
              notes: "",
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* KPI Highlight Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Payments Collected</span>
          <div className="font-heading font-black text-2xl text-emerald-400 mt-1 font-mono">
            {formatCurrency(totalCollected)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">{payments.length} verified transactions</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Primary Method</span>
          <div className="font-heading font-black text-2xl text-white mt-1">
            Bank Transfer
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">BOC, Commercial Bank, HNB</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Studio Counter Cash</span>
          <div className="font-heading font-black text-2xl text-white mt-1 font-mono">
            {formatCurrency(payments.filter(p => p.method === "Cash").reduce((s, p) => s + p.amount, 0))}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Direct Monaragala counter</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search payment ref, client, or receipt number..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Payment ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                <th className="py-3.5 px-4 font-semibold">Amount (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Reference</th>
                <th className="py-3.5 px-6 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p className="font-semibold text-neutral-300">No payment transactions recorded</p>
                      <p className="text-[11px] text-neutral-500">
                        Record cash advances, bank deposits, and online settlements to maintain your agency accounts ledger.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider"
                      >
                        + Record First Payment
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      {pay.paymentId}
                    </td>
                    <td className="py-4 px-4 text-neutral-200 font-medium">
                      {pay.customerName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-300 font-semibold">
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(pay.amount)}
                    </td>
                    <td className="py-4 px-4 text-neutral-400 font-mono text-[11px]">
                      {pay.reference || "-"}
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-400 whitespace-nowrap">
                      {formatDate(pay.date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Record Customer Payment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Customer *
                </label>
                <select
                  value={formData.customerId}
                  onChange={e => {
                    const c = customers.find(cust => cust.id === e.target.value);
                    setFormData({
                      ...formData,
                      customerId: e.target.value,
                      customerName: c ? c.name : formData.customerName,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company && `(${c.company})`}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Amount Paid (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={e => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash (Counter)</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online / QR</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Transaction Reference / Slip #
                </label>
                <input
                  type="text"
                  placeholder="e.g. BOC-TXN-8849201"
                  value={formData.reference}
                  onChange={e => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
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
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
