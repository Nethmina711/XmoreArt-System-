"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Order, OrderStatus, Project } from "@/lib/types";
import { formatCurrency, formatDate, generateProjectNumber } from "@/lib/utils";
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Check, 
  X, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  Filter
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(DataStore.getOrders());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadData = () => {
    setOrders(DataStore.getOrders());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const allStatuses: OrderStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "READY",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED"
  ];

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;
    const updated = { ...target, status: newStatus };
    DataStore.saveOrder(updated);
    loadData();
  };

  const handleConvertToProject = (order: Order) => {
    const projectNumber = generateProjectNumber();
    const newProject: Project = {
      id: `prj-${Date.now()}`,
      projectNumber,
      orderId: order.id,
      title: `${order.service} - ${order.customerName}`,
      customerId: order.customerId,
      customerName: order.customerName,
      service: order.service,
      description: order.description,
      startDate: new Date().toISOString().split("T")[0],
      deadline: order.deadline,
      status: "IN_PROGRESS",
      assignedTeam: [
        { id: "emp-2", name: "Dinuka Perera", role: "MANAGER" },
        { id: "emp-4", name: "Chathura Gamage", role: "DESIGNER" }
      ],
      budget: order.amount,
      progressPercentage: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveProject(newProject);
    alert(`Project ${projectNumber} created successfully from Order!`);
  };

  const getStatusBadge = (st: OrderStatus) => {
    switch (st) {
      case "PENDING": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "IN_PROGRESS": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "READY": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "DELIVERED":
      case "COMPLETED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Order & Production Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Confirmed jobs, production stages, delivery tracking & payment balances
          </p>
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
            placeholder="Search order #, customer, or service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {["ALL", "PENDING", "IN_PROGRESS", "READY", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
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

      {/* Orders Table */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-6 font-semibold">Order Ref</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Service Description</th>
                <th className="py-3.5 px-4 font-semibold">Amount & Paid</th>
                <th className="py-3.5 px-4 font-semibold">Deadline</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-neutral-300">No active customer orders</p>
                      <p className="text-[11px] text-neutral-500">
                        When quotations are approved by your clients, click &quot;Convert to Order&quot; in the Quotations panel to start production.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-heading font-bold text-sm text-white font-mono">{ord.orderNumber}</p>
                      <p className="text-[10px] text-neutral-400">{formatDate(ord.createdAt)}</p>
                    </td>

                    <td className="py-4 px-4 text-neutral-300">
                      <p className="font-semibold text-white">{ord.customerName}</p>
                    </td>

                    <td className="py-4 px-4 text-neutral-300 max-w-xs">
                      <p className="font-medium text-white line-clamp-1">{ord.service}</p>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{ord.description}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-emerald-400 font-mono">{formatCurrency(ord.amount)}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Paid: {formatCurrency(ord.paidAmount)} • Bal: {formatCurrency(ord.balance)}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-neutral-400 whitespace-nowrap">
                      {ord.deadline}
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold bg-black/40 border focus:outline-none ${getStatusBadge(ord.status)}`}
                      >
                        {allStatuses.map(st => (
                          <option key={st} value={st}>{st.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleConvertToProject(ord)}
                        className="p-1.5 rounded-lg bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white transition-colors"
                        title="Convert to Project"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
