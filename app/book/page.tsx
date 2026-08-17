"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { useSettings } from "@/lib/context/SettingsContext";
import { DataStore } from "@/lib/data/dataStore";
import { ShootBooking, ShootType, AuspiciousTimes, ShootPackageOption, ShootAddonOption } from "@/lib/types";
import { initialShootPackages, initialShootAddons } from "@/lib/data/seedData";
import { generateBookingNumber, formatCurrency, getWhatsAppLink } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  Video,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Send,
  HelpCircle,
  Film,
  Layers,
  Award,
  DollarSign
} from "lucide-react";

export default function BookShootPage() {
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<ShootBooking | null>(null);

  // Dynamic Shoot Options & Addons from CMS
  const [shootOptions, setShootOptions] = useState<ShootPackageOption[]>(initialShootPackages);
  const [availableAddons, setAvailableAddons] = useState<ShootAddonOption[]>(initialShootAddons);

  useEffect(() => {
    try {
      const pkgs = DataStore.getShootPackages();
      if (pkgs && pkgs.length > 0) setShootOptions(pkgs);
      const addons = DataStore.getShootAddons();
      if (addons && addons.length > 0) setAvailableAddons(addons);
    } catch {
      // Fallback to defaults
    }
  }, []);

  // Form State
  const [selectedType, setSelectedType] = useState<ShootType>("WEDDING_FULL");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("06:30 AM");
  const [endTime, setEndTime] = useState("11:30 PM");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  
  // Auspicious times
  const [dressingTime, setDressingTime] = useState("");
  const [poruwaCeremony, setPoruwaCeremony] = useState("");
  const [cakeCutting, setCakeCutting] = useState("");
  const [goingAway, setGoingAway] = useState("");

  // Addons
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(["drone", "album_luxury"]);

  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("+94 ");
  const [clientWhatsapp, setClientWhatsapp] = useState("+94 ");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Min Date is tomorrow
  const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const currentOption = shootOptions.find(o => o.type === selectedType) || shootOptions[0] || initialShootPackages[0];
  const selectedAddonObjects = availableAddons.filter(a => selectedAddonIds.includes(a.id));
  const addonsTotal = selectedAddonObjects.reduce((acc, curr) => acc + curr.price, 0);
  const totalAmount = (currentOption?.basePrice || 0) + addonsTotal;
  const advanceRequired = Math.round(totalAmount * 0.25); // 25% booking advance

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (step === 2 && !eventDate) {
      alert("Please select your event date to continue.");
      return;
    }
    if (step === 3 && !locationName) {
      alert("Please provide the venue or shoot location.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert("Please enter your name and phone number.");
      return;
    }

    const newBooking: ShootBooking = {
      id: `bkg-${Date.now()}`,
      bookingNumber: generateBookingNumber(),
      shootType: selectedType,
      title: `${clientName} - ${currentOption.title}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientWhatsapp: clientWhatsapp.trim() || clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      eventDate,
      startTime,
      endTime,
      locationName: locationName.trim(),
      locationAddress: locationAddress.trim() || undefined,
      auspiciousTimes: (dressingTime || poruwaCeremony || cakeCutting || goingAway) ? {
        dressingTime: dressingTime || undefined,
        poruwaCeremony: poruwaCeremony || undefined,
        cakeCutting: cakeCutting || undefined,
        goingAway: goingAway || undefined,
      } : undefined,
      packageName: currentOption.title,
      packagePrice: currentOption.basePrice,
      addons: selectedAddonObjects.map(a => ({ id: a.id, name: a.name, price: a.price })),
      totalAmount,
      advancePaid: 0,
      balanceDue: totalAmount,
      paymentStatus: "UNPAID",
      crew: [],
      deliverables: {
        rawPhotosDelivered: false,
        teaserVideoDelivered: false,
        cinematicFilmDelivered: false,
        albumProofApproved: false,
        albumPrinted: false,
        woodenBoxDelivered: false,
      },
      notes: notes.trim() || undefined,
      status: "INQUIRY",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.saveBooking(newBooking);
    setCreatedBooking(newBooking);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappMessage = createdBooking
    ? `Hello XMORE ART SOLUTIONS! 📸 I have submitted a shoot booking request on your website:
*Booking Ref*: ${createdBooking.bookingNumber}
*Shoot*: ${createdBooking.title}
*Date*: ${createdBooking.eventDate} (${createdBooking.startTime} - ${createdBooking.endTime})
*Venue*: ${createdBooking.locationName}
*Estimated Value*: Rs. ${createdBooking.totalAmount.toLocaleString()}
*Contact*: ${createdBooking.clientName} (${createdBooking.clientPhone})

Please confirm date availability and advance payment instructions!`
    : "";

  const whatsappDirectUrl = getWhatsAppLink(settings.whatsappNumber || "94716666643", whatsappMessage);

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-red/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

          {!isSubmitted ? (
            <div>
              {/* Heading */}
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs uppercase font-bold tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Production Booking</span>
                </span>
                <h1 className="font-heading font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
                  Book Your <span className="text-brand-red">Wedding & Shoot</span>
                </h1>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Lock in your special date with Monaragala&apos;s premier creative production studio. Check availability, customize luxury deliverables, and receive an instant price estimation.
                </p>

                {/* Step Progress Bar */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
                  {[
                    { num: 1, label: "Shoot Type" },
                    { num: 2, label: "Date & Time" },
                    { num: 3, label: "Location & Logistics" },
                    { num: 4, label: "Deliverables & Addons" },
                    { num: 5, label: "Confirm & Reserve" },
                  ].map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          step === s.num
                            ? "bg-brand-red text-white ring-4 ring-brand-red/20"
                            : step > s.num
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-neutral-400"
                        }`}
                      >
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span className={`hidden md:inline text-xs font-medium ${step === s.num ? "text-white font-bold" : "text-neutral-500"}`}>
                        {s.label}
                      </span>
                      {s.num < 5 && <div className="w-4 sm:w-8 h-[1px] bg-white/10" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Forms */}
              <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
                
                {/* STEP 1: Select Shoot Category */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-1">
                        Step 1: Select Your Shoot Experience
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Choose the production category that best describes your celebration or media requirement.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shootOptions.map((opt) => {
                        const getIconForType = (t: ShootType) => {
                          switch (t) {
                            case "WEDDING_FULL": return Heart;
                            case "PRE_WEDDING": return Camera;
                            case "WEDDING_HOMECOMING": return Film;
                            case "MODEL_PORTFOLIO": return Sparkles;
                            case "COMMERCIAL_VIDEO": return Video;
                            case "EVENT_COVERAGE": return Layers;
                            case "STUDIO_PORTRAIT": return Camera;
                            default: return Camera;
                          }
                        };
                        const Icon = getIconForType(opt.type);
                        const isSelected = selectedType === opt.type;

                        return (
                          <div
                            key={opt.type}
                            onClick={() => setSelectedType(opt.type)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                              isSelected
                                ? "bg-brand-red/10 border-brand-red ring-2 ring-brand-red/30"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            {opt.popular && (
                              <span className="absolute top-3 right-3 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-red text-white">
                                Most Popular
                              </span>
                            )}
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isSelected ? "bg-brand-red text-white" : "bg-white/10 text-neutral-300"
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-heading font-bold text-base text-white">
                                  {opt.title}
                                </h3>
                              </div>
                              <p className="text-xs text-neutral-400 leading-relaxed">
                                {opt.subtitle}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[11px] text-neutral-400">Starting from:</span>
                              <span className="font-mono font-bold text-sm text-brand-red">
                                {formatCurrency(opt.basePrice)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-red/25 transition-all"
                      >
                        <span>Continue to Date & Time</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Date & Timing */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-1">
                        Step 2: Choose Date & Timing
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Select the scheduled date for your shoot. We take limited bookings per day to ensure dedicated master crew presence.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Event / Shoot Date *
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="date"
                            required
                            min={minDate}
                            value={eventDate}
                            onChange={e => setEventDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-sm"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-2">
                          💡 Tip: For high-season wedding dates (August - December), we recommend reserving 3 to 6 months in advance.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Estimated Coverage Start Time
                          </label>
                          <div className="relative">
                            <Clock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <select
                              value={startTime}
                              onChange={e => setStartTime(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-brand-red focus:outline-none text-white text-sm"
                            >
                              <option value="05:30 AM">05:30 AM (Early Bridal Dressing)</option>
                              <option value="06:30 AM">06:30 AM (Morning Dressing & Groom Prep)</option>
                              <option value="08:00 AM">08:00 AM (Auspicious Morning Shoot)</option>
                              <option value="10:00 AM">10:00 AM (Church / Reception Morning)</option>
                              <option value="02:00 PM">02:00 PM (Afternoon Golden Hour Shoot)</option>
                              <option value="05:30 PM">05:30 PM (Evening Reception / Gala)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Estimated Coverage End Time
                          </label>
                          <div className="relative">
                            <Clock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <select
                              value={endTime}
                              onChange={e => setEndTime(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-brand-red focus:outline-none text-white text-sm"
                            >
                              <option value="02:00 PM">02:00 PM (Half Day Session)</option>
                              <option value="06:00 PM">06:00 PM (Sunset Wrap-up)</option>
                              <option value="11:30 PM">11:30 PM (Full Night Reception & Going Away)</option>
                              <option value="01:00 AM">01:00 AM (Late Night After-Party)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-red/25"
                      >
                        <span>Continue to Location</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Venue & Auspicious Times */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-1">
                        Step 3: Location & Auspicious Timetable
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Let us know the venue details and any specific Nakath (auspicious) times for your ceremony.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Venue / Hotel / Studio Location *
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Grand Monarch Hotel, Wellawaya"
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          City / Region
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Monaragala / Ella / Badulla / Colombo"
                          value={locationAddress}
                          onChange={e => setLocationAddress(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
                        />
                      </div>
                    </div>

                    {/* Wedding Auspicious Times (Nakath) */}
                    {(selectedType === "WEDDING_FULL" || selectedType === "WEDDING_HOMECOMING") && (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-brand-red font-heading font-bold text-xs uppercase tracking-wider">
                          <Clock className="w-4 h-4" />
                          <span>Sri Lankan Wedding Auspicious (Nakath) Schedule (Optional)</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                              Dressing Time
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 06:15 AM"
                              value={dressingTime}
                              onChange={e => setDressingTime(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                              Poruwa Ceremony
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 09:24 AM"
                              value={poruwaCeremony}
                              onChange={e => setPoruwaCeremony(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                              Cake Cutting
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 11:45 AM"
                              value={cakeCutting}
                              onChange={e => setCakeCutting(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                              Going Away
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 03:15 PM"
                              value={goingAway}
                              onChange={e => setGoingAway(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-red/25"
                      >
                        <span>Continue to Add-ons</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Deliverables & Add-ons */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-1">
                        Step 4: Customize Luxury Deliverables & Add-ons
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Elevate your coverage with high-end production features like 4K drone cinematography and handmade flush mount leather albums.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {availableAddons.map((addon) => {
                        const isChecked = selectedAddonIds.includes(addon.id);

                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isChecked
                                ? "bg-brand-red/10 border-brand-red"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isChecked ? "bg-brand-red border-brand-red text-white" : "border-white/20 bg-black/40"
                              }`}>
                                {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <h4 className="font-heading font-bold text-sm text-white">
                                  {addon.name}
                                </h4>
                                <p className="text-xs text-neutral-400">
                                  {addon.desc}
                                </p>
                              </div>
                            </div>

                            <span className="font-mono font-bold text-sm text-white shrink-0 ml-4">
                              +{formatCurrency(addon.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Live Total Card */}
                    <div className="p-5 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-brand-red tracking-wider block">
                          Current Estimated Total:
                        </span>
                        <p className="text-xs text-neutral-300">
                          {currentOption.title} + {selectedAddonIds.length} Add-ons
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-2xl text-white">
                          {formatCurrency(totalAmount)}
                        </span>
                        <p className="text-[10px] text-neutral-400">
                          (25% Booking Advance: {formatCurrency(advanceRequired)})
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-red/25"
                      >
                        <span>Final Step: Client Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Client Contact & Reserve Confirmation */}
                {step === 5 && (
                  <form onSubmit={handleSubmitBooking} className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-1">
                        Step 5: Client Details & Date Reservation
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Enter your primary contact details to generate your official booking reservation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Full Name / Couple Names *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kasun & Sanduni"
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Phone Number (Calls) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            placeholder="+94 77 123 4567"
                            value={clientPhone}
                            onChange={e => setClientPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          WhatsApp Number *
                        </label>
                        <div className="relative">
                          <Send className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            placeholder="+94 71 666 6643"
                            value={clientWhatsapp}
                            onChange={e => setClientWhatsapp(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="email"
                            placeholder="couple@example.com"
                            value={clientEmail}
                            onChange={e => setClientEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                        Special Requests, Story Concepts or Venue Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your wedding theme, bridal dress colors, special family moments, or specific shot requests..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500 resize-none"
                      />
                    </div>

                    {/* Booking Summary Box */}
                    <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs uppercase font-bold text-neutral-400">Package Base:</span>
                        <span className="font-mono text-xs text-white">{currentOption.title} ({formatCurrency(currentOption.basePrice)})</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs uppercase font-bold text-neutral-400">Scheduled Date:</span>
                        <span className="font-mono text-xs text-white">{eventDate || "Not chosen"} ({startTime} - {endTime})</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs uppercase font-bold text-neutral-400">Venue:</span>
                        <span className="text-xs text-white">{locationName || "Monaragala Studio"}</span>
                      </div>
                      <div className="flex items-center justify-between text-base font-bold text-white pt-2">
                        <span>Total Package Estimate:</span>
                        <span className="text-brand-red font-mono text-xl">{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>25% Advance to Lock Date:</span>
                        <span className="font-mono text-white">{formatCurrency(advanceRequired)}</span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-brand-red/30 transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>SUBMIT & RESERVE SHOOT</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          ) : (
            /* SUCCESS CONFIRMATION STATE */
            <div className="max-w-2xl mx-auto bg-brand-dark-card border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center animate-scale-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="inline-block text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-3">
                Booking Request Registered
              </span>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                Your Date Is Reserved!
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto mb-6">
                Thank you, <strong className="text-white">{createdBooking?.clientName}</strong>. Your shoot booking reference is <span className="font-mono text-brand-red font-bold">{createdBooking?.bookingNumber}</span> for <strong className="text-white">{createdBooking?.eventDate}</strong>.
              </p>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-left text-xs space-y-2 mb-8">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Shoot Experience:</span>
                  <span className="font-bold text-white">{createdBooking?.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Venue Location:</span>
                  <span className="text-white">{createdBooking?.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Estimate:</span>
                  <span className="font-mono font-bold text-brand-red">{formatCurrency(createdBooking?.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Booking Advance (25%):</span>
                  <span className="font-mono text-white">{formatCurrency(createdBooking ? Math.round(createdBooking.totalAmount * 0.25) : 0)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Confirmation to Studio WhatsApp (+94 71 666 6643)</span>
                </a>

                <Link
                  href="/"
                  className="inline-block text-xs text-neutral-400 hover:text-white py-2"
                >
                  Return to Public Website
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
