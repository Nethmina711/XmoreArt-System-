"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Expense, ExpenseCategory, PaymentMethod } from "@/lib/types";
import { formatCurrency, formatDate, generateExpenseNumber } from "@/lib/utils";
import { 
  Receipt, 
  Plus, 
  Search, 
  DollarSign, 
  Layers, 
  Calendar, 
  X, 
  Check, 
  PieChart 
} from "lucide-react";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(DataStore.getExpenses());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: "Printing" as ExpenseCategory,
    description: "",
    amount: 5000,
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Bank Transfer" as PaymentMethod,
    notes: "",
  });

  const loadData = () => {
    setExpenses(DataStore.getExpenses());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categories: ExpenseCategory[] = [
    "Printing",
    "Equipment",
    "Transport",
    "Staff",
    "Marketing",
    "Office",
    "Software",
    "Other"
  ];

  const filteredExpenses = expenses.filter(e => {
    const matchesCat = categoryFilter === "ALL" || e.category === categoryFilter;
    const matchesSearch = 
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.expenseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || formData.amount <= 0) return;

    const expenseId = generateExpenseNumber();
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      expenseId,
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    DataStore.saveExpense(newExpense);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Studio Expense Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track material costs, equipment upgrades, courier logistics & software retainers
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              category: "Printing",
              description: "",
              amount: 5000,
              date: new Date().toISOString().split("T")[0],
              paymentMethod: "Bank Transfer",
              notes: "",
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Categories Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5 col-span-2 sm:col-span-1">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Total Outflow</span>
          <div className="font-heading font-black text-2xl text-brand-red mt-1 font-mono">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">{expenses.length} expense entries</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Paper & Print Media</span>
          <div className="font-heading font-black text-2xl text-white mt-1 font-mono">
            {formatCurrency(expenses.filter(e => e.category === "Printing").reduce((s, e) => s + e.amount, 0))}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Boards, vinyl, ink & plates</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Gear & Hardware</span>
          <div className="font-heading font-black text-2xl text-white mt-1 font-mono">
            {formatCurrency(expenses.filter(e => e.category === "Equipment").reduce((s, e) => s + e.amount, 0))}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Cameras, lights & memory</p>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Transport & Fuel</span>
          <div className="font-heading font-black text-2xl text-white mt-1 font-mono">
            {formatCurrency(expenses.filter(e => e.category === "Transport").reduce((s, e) => s + e.amount, 0))}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Studio trips & deliveries</p>
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
            placeholder="Search expense description, category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === "ALL" ? "bg-brand-red text-white" : "bg-white/5 text-neutral-400"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                categoryFilter === cat ? "bg-brand-red text-white" : "bg-white/5 text-neutral-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Expense ID</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Description</th>
                <th className="py-3.5 px-4 font-semibold">Amount (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                <th className="py-3.5 px-6 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p className="font-semibold text-neutral-300">No operational expenses recorded</p>
                      <p className="text-[11px] text-neutral-500">
                        Log paper board purchases, ink supplies, equipment maintenance, and studio overheads to track profitability.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider"
                      >
                        + Log First Expense
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      {exp.expenseId}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-neutral-300">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {exp.description}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-red-400 text-sm">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      {exp.paymentMethod}
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-400 whitespace-nowrap">
                      {formatDate(exp.date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Log Operational Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Description / Item *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Bundles 350 GSM Art Board"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Amount (LKR) *
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
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Expense Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Supplier / Internal Notes
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
