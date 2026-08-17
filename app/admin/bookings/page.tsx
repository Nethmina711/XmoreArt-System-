"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { 
  ShootBooking, 
  ShootType, 
  BookingStatus, 
  Employee, 
  CrewMemberAssignment 
} from "@/lib/types";
import { 
  formatCurrency, 
  formatDate, 
  generateBookingNumber, 
  getWhatsAppLink 
} from "@/lib/utils";
import { useSettings } from "@/lib/context/SettingsContext";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
  Camera,
  Video,
  Sparkles,
  MapPin,
  Clock,
  User,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  Film,
  Package,
  Layers,
  Edit,
  Trash2,
  X,
  Check,
  Briefcase,
  SlidersHorizontal,
  DollarSign,
  FileSpreadsheet,
  Share2
} from "lucide-react";

export default function AdminBookingsPage() {
  const { settings } = useSettings();
  const [bookings, setBookings] = useState<ShootBooking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Calendar Navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Selected Booking Drawer
  const [selectedBooking, setSelectedBooking] = useState<ShootBooking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal Form State
  const [formData, setFormData] = useState<Partial<ShootBooking>>({
    shootType: "WEDDING_FULL",
    title: "",
    clientName: "",
    clientPhone: "+94 77 ",
    clientWhatsapp: "+94 77 ",
    clientEmail: "",
    eventDate: new Date().toISOString().split("T")[0],
    startTime: "06:30 AM",
    endTime: "11:30 PM",
    locationName: "",
    locationAddress: "",
    packageName: "Full Day Wedding (Poruwa + Reception)",
    packagePrice: 185000,
    advancePaid: 0,
    status: "INQUIRY",
    notes: "",
  });

  const loadData = () => {
    setBookings(DataStore.getBookings());
    setEmployees(DataStore.getEmployees());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("xmore_data_updated", loadData);
    return () => window.removeEventListener("xmore_data_updated", loadData);
  }, []);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const jumpToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedCalendarDate(today.toISOString().split("T")[0]);
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesType = typeFilter === "ALL" || b.shootType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Shoots on the selected calendar date
  const shootsOnSelectedDate = bookings.filter(b => b.eventDate === selectedCalendarDate);

  // Status Badge Colors
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "INQUIRY":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "ADVANCE_PAID":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "CREW_ASSIGNED":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "SHOOTING_TODAY":
        return "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";
      case "POST_PRODUCTION":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "ALBUM_PROOFING":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "CANCELLED":
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getShootTypeColor = (type: ShootType) => {
    switch (type) {
      case "WEDDING_FULL":
      case "WEDDING_HOMECOMING":
        return "border-red-500 bg-red-500/10 text-red-400";
      case "PRE_WEDDING":
        return "border-purple-500 bg-purple-500/10 text-purple-400";
      case "MODEL_PORTFOLIO":
        return "border-pink-500 bg-pink-500/10 text-pink-400";
      case "COMMERCIAL_VIDEO":
        return "border-emerald-500 bg-emerald-500/10 text-emerald-400";
      case "EVENT_COVERAGE":
        return "border-amber-500 bg-amber-500/10 text-amber-400";
      default:
        return "border-blue-500 bg-blue-500/10 text-blue-400";
    }
  };

  // Open New Booking Modal
  const handleOpenAddModal = (defaultDate?: string) => {
    setFormData({
      shootType: "WEDDING_FULL",
      title: "",
      clientName: "",
      clientPhone: "+94 77 ",
      clientWhatsapp: "+94 77 ",
      clientEmail: "",
      eventDate: defaultDate || selectedCalendarDate || new Date().toISOString().split("T")[0],
      startTime: "06:30 AM",
      endTime: "11:30 PM",
      locationName: "",
      locationAddress: "",
      packageName: "Full Day Wedding (Poruwa + Reception)",
      packagePrice: 185000,
      advancePaid: 0,
      status: "INQUIRY",
      notes: "",
    });
    setIsAddModalOpen(true);
  };

  // Save Booking
  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.eventDate || !formData.locationName) {
      alert("Please fill in the client name, date, and venue.");
      return;
    }

    const packagePrice = Number(formData.packagePrice) || 0;
    const advancePaid = Number(formData.advancePaid) || 0;
    const totalAmount = packagePrice; // base calculation
    const balanceDue = Math.max(0, totalAmount - advancePaid);

    const bookingToSave: ShootBooking = {
      id: selectedBooking && !isAddModalOpen ? selectedBooking.id : `bkg-${Date.now()}`,
      bookingNumber: selectedBooking && !isAddModalOpen ? selectedBooking.bookingNumber : generateBookingNumber(),
      shootType: formData.shootType || "WEDDING_FULL",
      title: formData.title || `${formData.clientName} - ${formData.shootType?.replace("_", " ")}`,
      clientName: formData.clientName.trim(),
      clientPhone: formData.clientPhone?.trim() || "+94 71 666 6643",
      clientWhatsapp: formData.clientWhatsapp?.trim() || formData.clientPhone?.trim() || "+94 71 666 6643",
      clientEmail: formData.clientEmail?.trim() || undefined,
      eventDate: formData.eventDate,
      startTime: formData.startTime || "06:30 AM",
      endTime: formData.endTime || "11:30 PM",
      locationName: formData.locationName.trim(),
      locationAddress: formData.locationAddress?.trim() || undefined,
      packageName: formData.packageName || "Custom Package",
      packagePrice,
      addons: selectedBooking?.addons || [],
      totalAmount,
      advancePaid,
      balanceDue,
      paymentStatus: advancePaid >= totalAmount ? "FULLY_PAID" : advancePaid > 0 ? "ADVANCE_PAID" : "UNPAID",
      crew: selectedBooking?.crew || [],
      gearList: selectedBooking?.gearList || ["Sony FX3", "Mavic 3 Pro", "Godox AD600"],
      deliverables: selectedBooking?.deliverables || {
        rawPhotosDelivered: false,
        teaserVideoDelivered: false,
        cinematicFilmDelivered: false,
        albumProofApproved: false,
        albumPrinted: false,
        woodenBoxDelivered: false,
      },
      notes: formData.notes?.trim() || undefined,
      status: formData.status || "INQUIRY",
      createdAt: selectedBooking ? selectedBooking.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveBooking(bookingToSave);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedBooking(bookingToSave);
    loadData();
  };

  // Toggle Deliverable Milestone
  const handleToggleDeliverable = (b: ShootBooking, key: keyof ShootBooking["deliverables"]) => {
    const updated: ShootBooking = {
      ...b,
      deliverables: {
        ...b.deliverables,
        [key]: !b.deliverables[key],
      },
      updatedAt: new Date().toISOString(),
    };
    DataStore.saveBooking(updated);
    setSelectedBooking(updated);
    loadData();
  };

  // Assign Crew Member
  const handleAssignCrew = (b: ShootBooking, emp: Employee, role: string) => {
    const existingIndex = b.crew.findIndex(c => c.staffId === emp.id);
    let updatedCrew = [...b.crew];

    if (existingIndex >= 0) {
      updatedCrew.splice(existingIndex, 1);
    } else {
      updatedCrew.push({
        staffId: emp.id,
        staffName: emp.name,
        role,
        phone: emp.phone,
      });
    }

    const updated: ShootBooking = {
      ...b,
      crew: updatedCrew,
      status: updatedCrew.length > 0 && b.status === "INQUIRY" ? "CREW_ASSIGNED" : b.status,
      updatedAt: new Date().toISOString(),
    };
    DataStore.saveBooking(updated);
    setSelectedBooking(updated);
    loadData();
  };

  // Generate Call Sheet WhatsApp Message
  const getCallSheetWhatsAppUrl = (b: ShootBooking) => {
    const crewNames = b.crew.map(c => `• ${c.staffName} (${c.role})`).join("\n") || "• Master Studio Team";
    const gear = b.gearList?.join(", ") || "Sony FX3, Mavic 3 Pro Drone, Godox AD600 Lighting Kit";

    const msg = `📋 *XMORE ART SOLUTIONS — OFFICIAL CREW CALL SHEET*
*Shoot*: ${b.title}
*Booking Ref*: ${b.bookingNumber}
*Event Date*: ${formatDate(b.eventDate)}
*Call Time*: ${b.startTime} (Wrap: ${b.endTime})
*Venue*: ${b.locationName} ${b.locationAddress ? `(${b.locationAddress})` : ""}

👥 *Assigned Creative Crew*:
${crewNames}

🎥 *Equipment Checklist*:
${gear}

${b.auspiciousTimes?.poruwaCeremony ? `⏰ *Poruwa Ceremony*: ${b.auspiciousTimes.poruwaCeremony}` : ""}
${b.auspiciousTimes?.goingAway ? `⏰ *Going Away*: ${b.auspiciousTimes.goingAway}` : ""}

*Dress Code*: Official XMORE Black Crew Polo & Professional gear bags.
Please arrive 30 minutes before Call Time!`;

    return getWhatsAppLink("94716666643", msg);
  };

  // Generate Client WhatsApp Logistics Message
  const getClientReminderWhatsAppUrl = (b: ShootBooking) => {
    const msg = `Hello ${b.clientName}! ✨ This is Miyuru from XMORE ART SOLUTIONS.
We are excited for your upcoming *${b.packageName}* on *${formatDate(b.eventDate)}*!

📍 *Venue*: ${b.locationName}
⏰ *Coverage Starts*: ${b.startTime}
${b.balanceDue > 0 ? `💰 *Balance Due on Event Day*: Rs. ${b.balanceDue.toLocaleString()}` : "✅ *Financials*: Fully Settled"}

Our master photo & cinema crew is prepped and ready. Please feel free to reach out if you have any schedule updates!`;

    return getWhatsAppLink(b.clientWhatsapp || b.clientPhone || "94716666643", msg);
  };

  // Stats
  const activeShootsCount = bookings.filter(b => b.status !== "COMPLETED" && b.status !== "CANCELLED").length;
  const weddingsCount = bookings.filter(b => b.shootType === "WEDDING_FULL" || b.shootType === "WEDDING_HOMECOMING").length;
  const totalPipelineRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalAdvanceCollected = bookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-white selection:bg-brand-red selection:text-white">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Wedding & Shoot Calendar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-brand-red/10 text-brand-red border border-brand-red/30">
              Studio Suite
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Visual schedule, master crew allocations, Nakath auspicious timetables & 1-click WhatsApp Call Sheets
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-brand-dark-card border border-white/10">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "calendar" ? "bg-brand-red text-white shadow-md" : "text-neutral-400 hover:text-white"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "list" ? "bg-brand-red text-white shadow-md" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>List / Pipeline</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-red/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Shoot Booking</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Active Shoots</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono font-bold text-2xl text-white">{activeShootsCount}</span>
            <span className="text-xs text-neutral-500">scheduled</span>
          </div>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Weddings & Pre-shoots</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono font-bold text-2xl text-brand-red">{weddingsCount}</span>
            <span className="text-xs text-neutral-500">couples</span>
          </div>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Total Bookings Value</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono font-bold text-2xl text-white">{formatCurrency(totalPipelineRevenue)}</span>
          </div>
        </div>

        <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Advance Deposits Received</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono font-bold text-2xl text-emerald-400">{formatCurrency(totalAdvanceCollected)}</span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-brand-dark-card border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search shoot, couple name, venue..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
          >
            <option value="ALL">All Shoot Categories</option>
            <option value="WEDDING_FULL">Full Day Wedding</option>
            <option value="PRE_WEDDING">Pre-Wedding / Outdoor</option>
            <option value="WEDDING_HOMECOMING">Homecoming</option>
            <option value="MODEL_PORTFOLIO">Model / Fashion</option>
            <option value="COMMERCIAL_VIDEO">Commercial Video</option>
            <option value="EVENT_COVERAGE">Birthday / Event</option>
            <option value="STUDIO_PORTRAIT">Studio Session</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="INQUIRY">Inquiry / Held</option>
            <option value="ADVANCE_PAID">Advance Paid</option>
            <option value="CREW_ASSIGNED">Crew Assigned</option>
            <option value="SHOOTING_TODAY">Shooting Today</option>
            <option value="POST_PRODUCTION">Post-Production</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* MAIN VIEW AREA */}
      {viewMode === "calendar" ? (
        /* CALENDAR VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Month Calendar Grid */}
          <div className="lg:col-span-2 bg-brand-dark-card border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="font-heading font-extrabold text-xl text-white">
                  {monthName}
                </h2>
                <button
                  onClick={jumpToday}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-brand-red font-bold border border-white/10"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase text-neutral-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading padding days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[85px] rounded-2xl bg-white/[0.02] border border-transparent opacity-30" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNumber = i + 1;
                const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
                const isSelected = selectedCalendarDate === formattedDay;
                const isToday = new Date().toISOString().split("T")[0] === formattedDay;
                const shootsThisDay = bookings.filter(b => b.eventDate === formattedDay);

                return (
                  <div
                    key={formattedDay}
                    onClick={() => setSelectedCalendarDate(formattedDay)}
                    className={`min-h-[85px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-brand-red/10 border-brand-red ring-2 ring-brand-red/30 shadow-lg"
                        : isToday
                        ? "bg-white/5 border-white/30"
                        : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isToday ? "w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center -ml-1 -mt-1" : "text-neutral-300"}`}>
                        {dayNumber}
                      </span>
                      {shootsThisDay.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                      )}
                    </div>

                    {/* Shoot Mini Chips */}
                    <div className="space-y-1 mt-1">
                      {shootsThisDay.slice(0, 2).map(s => (
                        <div
                          key={s.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(s);
                          }}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate border ${getShootTypeColor(s.shootType)}`}
                          title={s.title}
                        >
                          {s.clientName}
                        </div>
                      ))}
                      {shootsThisDay.length > 2 && (
                        <span className="text-[8px] text-neutral-400 font-bold block text-right">
                          +{shootsThisDay.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Day Detail Column (Shoots on Selected Date) */}
          <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Selected Date</span>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    {formatDate(selectedCalendarDate)}
                  </h3>
                </div>
                <button
                  onClick={() => handleOpenAddModal(selectedCalendarDate)}
                  className="p-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-brand-red/20"
                  title="Add Shoot On This Date"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {shootsOnSelectedDate.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 text-neutral-500 flex items-center justify-center mx-auto">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs">No shoots scheduled for this date.</p>
                  <button
                    onClick={() => handleOpenAddModal(selectedCalendarDate)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10"
                  >
                    + Book Shoot on this Date
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {shootsOnSelectedDate.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedBooking?.id === b.id
                          ? "bg-brand-red/10 border-brand-red shadow-lg"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                          {b.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {b.startTime}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-sm text-white mb-1">
                        {b.title}
                      </h4>

                      <p className="text-xs text-neutral-400 flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                        <span className="truncate">{b.locationName}</span>
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                        <span className="text-neutral-400">{b.crew.length} Crew Assigned</span>
                        <span className="font-mono font-bold text-brand-red">{formatCurrency(b.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-6">
              <p className="text-[11px] text-neutral-500 text-center">
                Click any shoot card to open crew assignments, equipment prep & 1-click Call Sheets.
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* LIST / PIPELINE VIEW */
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-neutral-400 font-heading uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref / Title</th>
                  <th className="py-3.5 px-4">Client & Contact</th>
                  <th className="py-3.5 px-4">Date & Timing</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Crew</th>
                  <th className="py-3.5 px-4">Financials</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      No shoot bookings found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-[11px] text-brand-red block">
                          {b.bookingNumber}
                        </span>
                        <span className="font-bold text-white text-xs">
                          {b.title}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">{b.clientName}</span>
                        <span className="text-neutral-400 text-[11px]">{b.clientPhone}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">{formatDate(b.eventDate)}</span>
                        <span className="text-neutral-400 text-[11px]">{b.startTime} - {b.endTime}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-neutral-300">{b.locationName}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[10px] font-bold">
                          {b.crew.length} Assigned
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-white block">{formatCurrency(b.totalAmount)}</span>
                        <span className={`text-[10px] ${b.balanceDue > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                          {b.balanceDue > 0 ? `Due: ${formatCurrency(b.balanceDue)}` : "Fully Paid"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(b.status)}`}>
                          {b.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SHOOT OPERATIONS DETAIL DRAWER (MODAL) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          />

          <div className="w-full max-w-3xl bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-brand-red font-bold">
                    {selectedBooking.bookingNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status.replace("_", " ")}
                  </span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-white">
                  {selectedBooking.title}
                </h2>
                <p className="text-xs text-neutral-400">
                  {formatDate(selectedBooking.eventDate)} ({selectedBooking.startTime} - {selectedBooking.endTime}) @ {selectedBooking.locationName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFormData(selectedBooking);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                  title="Edit Booking"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={getCallSheetWhatsAppUrl(selectedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Send WhatsApp Call Sheet to Crew</span>
              </a>

              <a
                href={getClientReminderWhatsAppUrl(selectedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Logistics Reminder to Client</span>
              </a>
            </div>

            {/* Logistics & Auspicious Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Client & Venue Info
                </span>
                <p className="text-xs text-white">
                  <strong>Client:</strong> {selectedBooking.clientName}
                </p>
                <p className="text-xs text-neutral-300">
                  <strong>Phone:</strong> {selectedBooking.clientPhone}
                </p>
                <p className="text-xs text-neutral-300">
                  <strong>WhatsApp:</strong> {selectedBooking.clientWhatsapp}
                </p>
                <p className="text-xs text-neutral-300">
                  <strong>Venue:</strong> {selectedBooking.locationName} {selectedBooking.locationAddress ? `(${selectedBooking.locationAddress})` : ""}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Financial Ledger
                </span>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Total Package:</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(selectedBooking.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Advance Paid:</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(selectedBooking.advancePaid)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-neutral-400 font-bold">Balance Due:</span>
                  <span className="font-mono font-bold text-brand-red">{formatCurrency(selectedBooking.balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* CREW ASSIGNMENTS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-red" />
                  <span>Creative Crew Assigned ({selectedBooking.crew.length})</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {employees.map((emp) => {
                  const isAssigned = selectedBooking.crew.some(c => c.staffId === emp.id);

                  return (
                    <button
                      type="button"
                      key={emp.id}
                      onClick={() => handleAssignCrew(selectedBooking, emp, emp.role.replace("_", " "))}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isAssigned
                          ? "bg-brand-red/15 border-brand-red text-white"
                          : "bg-black/30 border-white/5 text-neutral-400 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                          alt={emp.name}
                          className="w-7 h-7 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{emp.name}</p>
                          <p className="text-[10px] text-neutral-400">{emp.role.replace("_", " ")}</p>
                        </div>
                      </div>

                      <span className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${
                        isAssigned ? "bg-brand-red border-brand-red text-white" : "border-white/10"
                      }`}>
                        {isAssigned && "✓"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DELIVERABLES CHECKLIST */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <span className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Post-Production Milestones</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: "rawPhotosDelivered" as const, label: "Raw Photos (48h)" },
                  { key: "teaserVideoDelivered" as const, label: "60s Teaser Video" },
                  { key: "cinematicFilmDelivered" as const, label: "Full Cinematic Film" },
                  { key: "albumProofApproved" as const, label: "Album Proof Approved" },
                  { key: "albumPrinted" as const, label: "Album Flush Printed" },
                  { key: "woodenBoxDelivered" as const, label: "Luxury Box Delivered" },
                ].map((item) => {
                  const isDone = selectedBooking.deliverables[item.key];

                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => handleToggleDeliverable(selectedBooking, item.key)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-medium transition-all ${
                        isDone
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-black/30 border-white/5 text-neutral-400 hover:border-white/20"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                        isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20"
                      }`}>
                        {isDone && "✓"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CREATE / EDIT BOOKING MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
            }}
          />

          <div className="w-full max-w-2xl bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-heading font-extrabold text-xl text-white">
                {isAddModalOpen ? "Schedule New Shoot Booking" : "Edit Shoot Details"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Shoot Category *
                  </label>
                  <select
                    value={formData.shootType}
                    onChange={e => setFormData({ ...formData, shootType: e.target.value as ShootType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="WEDDING_FULL">Full Day Wedding</option>
                    <option value="PRE_WEDDING">Pre-Wedding / Outdoor Shoot</option>
                    <option value="WEDDING_HOMECOMING">Homecoming</option>
                    <option value="MODEL_PORTFOLIO">Model / Fashion Portfolio</option>
                    <option value="COMMERCIAL_VIDEO">Commercial & Brand Video</option>
                    <option value="EVENT_COVERAGE">Birthday & Event</option>
                    <option value="STUDIO_PORTRAIT">Studio Portrait Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Shoot Title / Couple Names *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun & Sanduni Wedding"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Silva"
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.clientWhatsapp}
                    onChange={e => setFormData({ ...formData, clientWhatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Call / Start Time
                  </label>
                  <input
                    type="text"
                    placeholder="06:30 AM"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    End / Wrap Time
                  </label>
                  <input
                    type="text"
                    placeholder="11:30 PM"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Venue / Hotel Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Monarch Hotel, Wellawaya"
                    value={formData.locationName}
                    onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Booking Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="INQUIRY">Inquiry / Slot Hold</option>
                    <option value="ADVANCE_PAID">Advance Paid</option>
                    <option value="CREW_ASSIGNED">Crew Assigned</option>
                    <option value="SHOOTING_TODAY">Shooting Today</option>
                    <option value="POST_PRODUCTION">Post-Production</option>
                    <option value="ALBUM_PROOFING">Album Proofing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Total Package Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.packagePrice}
                    onChange={e => setFormData({ ...formData, packagePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Advance Deposit Paid (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.advancePaid}
                    onChange={e => setFormData({ ...formData, advancePaid: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-mono text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Logistics & Special Shot Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, family photo requests, lighting setup notes..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/25"
                >
                  Save Shoot Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
