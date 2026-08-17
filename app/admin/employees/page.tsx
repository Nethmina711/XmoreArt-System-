"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Employee, StaffRole } from "@/lib/types";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Briefcase, 
  CheckSquare, 
  Shield, 
  X, 
  Check, 
  Edit,
  KeyRound,
  Lock,
  UserX,
  Sparkles
} from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(DataStore.getEmployees());
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "DESIGNER" as StaffRole,
    password: "",
    specialization: "",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    active: true,
  });

  const loadData = () => {
    setEmployees(DataStore.getEmployees());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const roles: StaffRole[] = [
    "SUPER_ADMIN",
    "MANAGER",
    "DESIGNER",
    "PHOTOGRAPHER",
    "VIDEOGRAPHER",
    "MARKETING",
    "STAFF"
  ];

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.specialization && e.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "+94 77 ",
      role: "DESIGNER",
      password: "admin" + Math.floor(1000 + Math.random() * 9000),
      specialization: "",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPassword = (formData.password || (editingEmployee?.password || "admin1234")).trim();

    const empToSave: Employee = {
      id: editingEmployee ? editingEmployee.id : `emp-${Date.now()}`,
      name: formData.name.trim(),
      email: cleanEmail,
      phone: formData.phone.trim(),
      role: formData.role,
      password: cleanPassword,
      specialization: formData.specialization?.trim() || undefined,
      photo: formData.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      active: formData.active,
      assignedProjectsCount: editingEmployee ? editingEmployee.assignedProjectsCount : 0,
      assignedTasksCount: editingEmployee ? editingEmployee.assignedTasksCount : 0,
      createdAt: editingEmployee ? editingEmployee.createdAt : new Date().toISOString().split("T")[0],
    };

    DataStore.saveEmployee(empToSave);
    setIsModalOpen(false);
    loadData();
  };

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MANAGER": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "MARKETING": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "DESIGNER": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PHOTOGRAPHER": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "VIDEOGRAPHER": return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Team & Staff Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage staff login credentials, roles, specialized creative domains & task allocations
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search staff by name, role, specialization..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
        />
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className={`bg-brand-dark-card border rounded-3xl p-6 transition-all flex flex-col justify-between shadow-xl group ${
              emp.active ? "border-white/10 hover:border-white/20" : "border-red-500/20 opacity-70"
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-red transition-colors">
                        {emp.name}
                      </h3>
                      {!emp.active && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                          Inactive
                        </span>
                      )}
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1 ${getRoleBadge(emp.role)}`}>
                      {emp.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {emp.specialization && (
                <p className="text-xs text-neutral-300 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  <strong className="text-neutral-400 block text-[10px] uppercase font-bold mb-0.5">Specialization:</strong>
                  {emp.specialization}
                </p>
              )}

              <div className="space-y-2 text-xs text-neutral-400 pt-2 border-t border-white/5">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{emp.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{emp.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="text-[11px] text-neutral-400">
                    Access Password: <span className="font-mono text-neutral-400">••••••••</span>
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-neutral-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Briefcase className="w-3 h-3 text-brand-red" />
                  {emp.assignedProjectsCount || 0} projects
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <CheckSquare className="w-3 h-3 text-brand-red" />
                  {emp.assignedTasksCount || 0} tasks
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingEmployee(emp);
                  setFormData({
                    name: emp.name,
                    email: emp.email,
                    phone: emp.phone,
                    role: emp.role,
                    password: emp.password || "admin1234",
                    specialization: emp.specialization || "",
                    photo: emp.photo,
                    active: emp.active,
                  });
                  setIsModalOpen(true);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Edit staff & password"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingEmployee ? "Edit Staff Account" : "Add New Staff Member"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Name *
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
                    Staff Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as StaffRole })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Staff Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Login Password / PIN *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter access password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Staff member will use this password and their email to sign in to the workspace.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Specialization / Tools
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4K Drone, DaVinci Resolve, Offset Prepress"
                  value={formData.specialization}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-red focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-300">Account Active (Staff can sign in)</span>
                </label>
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
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
