"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Project, ProjectStatus, StaffRole } from "@/lib/types";
import { formatCurrency, formatDate, generateProjectNumber } from "@/lib/utils";
import { initialEmployees } from "@/lib/data/seedData";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  Edit, 
  X, 
  DollarSign, 
  ArrowUpRight 
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(DataStore.getProjects());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    service: "Printing",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    deadline: "",
    budget: 25000,
    progressPercentage: 25,
    status: "IN_PROGRESS" as ProjectStatus,
    assignedTeam: ["emp-2"],
    notes: "",
  });

  const loadData = () => {
    setProjects(DataStore.getProjects());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const allStatuses: ProjectStatus[] = [
    "PLANNED",
    "IN_PROGRESS",
    "REVIEW",
    "REVISION",
    "COMPLETED",
    "DELIVERED",
    "CANCELLED"
  ];

  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      customerName: "",
      service: "Printing",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      budget: 35000,
      progressPercentage: 10,
      status: "IN_PROGRESS",
      assignedTeam: ["emp-2", "emp-4"],
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      customerName: project.customerName,
      service: project.service,
      description: project.description,
      startDate: project.startDate,
      deadline: project.deadline,
      budget: project.budget,
      progressPercentage: project.progressPercentage,
      status: project.status,
      assignedTeam: project.assignedTeam.map(t => t.id),
      notes: project.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.customerName) return;

    const projectNumber = editingProject ? editingProject.projectNumber : generateProjectNumber();
    const assignedStaffMembers = initialEmployees
      .filter(emp => formData.assignedTeam.includes(emp.id))
      .map(emp => ({ id: emp.id, name: emp.name, role: emp.role }));

    const projectToSave: Project = {
      id: editingProject ? editingProject.id : `prj-${Date.now()}`,
      projectNumber,
      title: formData.title,
      customerId: editingProject ? editingProject.customerId : `cust-${Date.now()}`,
      customerName: formData.customerName,
      service: formData.service,
      description: formData.description,
      startDate: formData.startDate,
      deadline: formData.deadline,
      status: formData.status,
      assignedTeam: assignedStaffMembers,
      budget: Number(formData.budget) || 0,
      progressPercentage: Number(formData.progressPercentage) || 0,
      notes: formData.notes,
      createdAt: editingProject ? editingProject.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveProject(projectToSave);
    setIsModalOpen(false);
    loadData();
  };

  const handleUpdateProgress = (proj: Project, delta: number) => {
    const newProgress = Math.max(0, Math.min(100, proj.progressPercentage + delta));
    const newStatus: ProjectStatus = newProgress === 100 ? "COMPLETED" : proj.status;
    DataStore.saveProject({
      ...proj,
      progressPercentage: newProgress,
      status: newStatus,
    });
    loadData();
  };

  const getStatusBadge = (st: ProjectStatus) => {
    switch (st) {
      case "PLANNED": return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
      case "IN_PROGRESS": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "REVIEW": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "REVISION": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "COMPLETED":
      case "DELIVERED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Project Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active creative production workflows, milestones, team assignments & budgets
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects, client, service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {["ALL", "PLANNED", "IN_PROGRESS", "REVIEW", "COMPLETED"].map((st) => (
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

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-12 text-center shadow-xl">
          <div className="max-w-xs mx-auto space-y-3">
            <p className="font-semibold text-neutral-300">No active projects found</p>
            <p className="text-[11px] text-neutral-500">
              Create a new creative project or convert client orders directly from the Orders tab to begin tracking milestones.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider"
            >
              + Create First Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">{proj.projectNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(proj.status)}`}>
                    {proj.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-1 line-clamp-1">
                {proj.title}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">{proj.customerName} • <span className="text-brand-red">{proj.service}</span></p>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-6">
                {proj.description}
              </p>

              {/* Progress Slider */}
              <div className="space-y-2 mb-6 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Milestone Progress</span>
                  <span className="font-bold text-white font-mono">{proj.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full bg-brand-red rounded-full transition-all duration-300"
                    style={{ width: `${proj.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <button
                    onClick={() => handleUpdateProgress(proj, -10)}
                    className="text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(proj, 10)}
                    className="text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
                  >
                    +10%
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-6">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1.5">
                  Assigned Team:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.assignedTeam.map((mem) => (
                    <span
                      key={mem.id}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-neutral-300 font-medium"
                    >
                      {mem.name} ({mem.role.slice(0, 3)})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Budget</span>
                <span className="font-bold text-emerald-400 font-mono">{formatCurrency(proj.budget)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase block">Target Date</span>
                <span className="text-neutral-300">{proj.deadline}</span>
              </div>
              <button
                onClick={() => openEditModal(proj)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-lg bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingProject ? `Edit Project ${editingProject.projectNumber}` : "Create New Project"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ella Resort 4K Video Commercial"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Service Category
                  </label>
                  <select
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="Printing">Printing</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Budget (LKR)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Project Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                >
                  {allStatuses.map(st => (
                    <option key={st} value={st}>{st.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Project Description / Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
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
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
