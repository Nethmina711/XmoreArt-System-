"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { initialEmployees } from "@/lib/data/seedData";
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Clock, 
  User, 
  AlertCircle, 
  Check, 
  X, 
  Trash2, 
  Edit, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(DataStore.getTasks());
  const [projects, setProjects] = useState(DataStore.getProjects());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectId: "",
    projectTitle: "",
    title: "",
    description: "",
    assignedToId: "emp-2",
    priority: "MEDIUM" as TaskPriority,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "TODO" as TaskStatus,
  });

  const loadData = () => {
    setTasks(DataStore.getTasks());
    setProjects(DataStore.getProjects());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: "TODO", label: "To Do / Backlog", color: "border-neutral-500" },
    { id: "IN_PROGRESS", label: "In Progress", color: "border-blue-500" },
    { id: "REVIEW", label: "Review & Quality Check", color: "border-purple-500" },
    { id: "COMPLETED", label: "Completed", color: "border-emerald-500" },
  ];

  const filteredTasks = tasks.filter(t => {
    const matchesAssignee = selectedAssignee === "ALL" || t.assignedToId === selectedAssignee;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAssignee && matchesSearch;
  });

  const handleMoveStatus = (task: Task, direction: "next" | "prev") => {
    const statusOrder: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];
    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      DataStore.saveTask({ ...task, status: statusOrder[newIndex] });
      loadData();
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    const firstPrj = projects[0];
    setFormData({
      projectId: firstPrj ? firstPrj.id : "prj-1",
      projectTitle: firstPrj ? firstPrj.title : "Apex Healthcare Awareness Campaign",
      title: "",
      description: "",
      assignedToId: "emp-2",
      priority: "MEDIUM",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "TODO",
    });
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const assignedStaff = initialEmployees.find(e => e.id === formData.assignedToId);
    const selectedPrj = projects.find(p => p.id === formData.projectId);

    const taskToSave: Task = {
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      projectId: formData.projectId,
      projectTitle: selectedPrj ? selectedPrj.title : formData.projectTitle,
      title: formData.title,
      description: formData.description,
      assignedToId: formData.assignedToId,
      assignedToName: assignedStaff ? assignedStaff.name : "Team Member",
      priority: formData.priority,
      deadline: formData.deadline,
      status: formData.status,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveTask(taskToSave);
    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Delete this task?")) {
      DataStore.deleteTask(id);
      loadData();
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "URGENT": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "HIGH": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "MEDIUM": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Task & Assignment Board
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Kanban workflow across design, prepress, photography, and video editing
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search task title, project, or assignee..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-dark-card border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedAssignee("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedAssignee === "ALL" ? "bg-brand-red text-white" : "bg-white/5 text-neutral-400"
            }`}
          >
            All Staff
          </button>
          {initialEmployees.map(emp => (
            <button
              key={emp.id}
              onClick={() => setSelectedAssignee(emp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedAssignee === emp.id ? "bg-brand-red text-white" : "bg-white/5 text-neutral-400"
              }`}
            >
              {emp.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-brand-dark-card border border-white/10 rounded-3xl p-5 flex flex-col justify-between min-h-[500px]"
            >
              <div>
                {/* Column Title */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col.id === "TODO" ? "bg-neutral-400" :
                      col.id === "IN_PROGRESS" ? "bg-blue-500" :
                      col.id === "REVIEW" ? "bg-purple-500" : "bg-emerald-500"
                    }`} />
                    <h2 className="font-heading font-bold text-sm text-white">
                      {col.label}
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 text-xs font-mono font-bold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards List */}
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-neutral-600 text-xs italic">
                      No tasks in this stage
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-2xl p-4 transition-all shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h3 className="font-heading font-bold text-xs text-white mb-1.5 leading-snug">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="pt-2 border-t border-white/5 text-[10px] text-neutral-400 space-y-1">
                          <p className="text-neutral-300 font-medium line-clamp-1">{task.projectTitle}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-brand-red font-semibold">{task.assignedToName}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              {task.deadline}
                            </span>
                          </div>
                        </div>

                        {/* Kanban Step Shift Buttons */}
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                          {col.id !== "TODO" ? (
                            <button
                              onClick={() => handleMoveStatus(task, "prev")}
                              className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Back</span>
                            </button>
                          ) : <div />}

                          {col.id !== "COMPLETED" ? (
                            <button
                              onClick={() => handleMoveStatus(task, "next")}
                              className="text-[10px] text-brand-red hover:text-white font-bold flex items-center gap-1 ml-auto"
                            >
                              <span>Advance</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 ml-auto">
                              <Check className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Add in column */}
              <button
                onClick={openAddModal}
                className="w-full mt-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-dashed border-white/10"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Create New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Proofread 350 GSM Menu Board"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Assign to Project
                </label>
                <select
                  value={formData.projectId}
                  onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Assignee
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
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Instructions / Description
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
