"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DataStore } from "@/lib/data/dataStore";
import { useSettings } from "@/lib/context/SettingsContext";
import { generateEnquiryNumber, getWhatsAppLink } from "@/lib/utils";
import { Enquiry, LeadSource } from "@/lib/types";
import { 
  Printer, 
  Palette, 
  TrendingUp, 
  Camera, 
  Video, 
  Shield, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  MessageCircle, 
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export const QuoteWizard: React.FC = () => {
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    service: "Printing",
    secondaryServices: [] as string[],
    quantity: "",
    dimensions: "",
    deadline: "",
    estimatedBudget: "Rs. 25,000 - 50,000",
    description: "",
    specialRequirements: "",
    uploadedFiles: [] as { name: string; size: string }[],
    // Customer Details
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    location: "Monaragala",
    source: "Website" as LeadSource,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const servicesList = [
    { id: "Printing", name: "Printing", desc: "Business cards, flyers, banners, stickers & packaging", icon: Printer },
    { id: "Graphic Design", name: "Graphic Design", desc: "Logos, brand artwork, social posts & packaging mockups", icon: Palette },
    { id: "Digital Marketing", name: "Digital Marketing", desc: "Meta ads, TikTok growth & monthly social retainers", icon: TrendingUp },
    { id: "Photography", name: "Photography", desc: "Weddings, events, commercial products & portraits", icon: Camera },
    { id: "Videography", name: "Videography", desc: "4K commercial films, wedding movies & vertical reels", icon: Video },
    { id: "Branding", name: "Branding", desc: "Full brand identity, style guides & corporate signage", icon: Shield },
    { id: "Other", name: "Other Creative", desc: "Signboards, 3D name boards, acrylics & event setups", icon: Layers },
  ];

  const handleServiceSelect = (srvId: string) => {
    setFormData(prev => ({ ...prev, service: srvId }));
  };

  const toggleSecondaryService = (srvId: string) => {
    setFormData(prev => {
      const exists = prev.secondaryServices.includes(srvId);
      return {
        ...prev,
        secondaryServices: exists
          ? prev.secondaryServices.filter(s => s !== srvId)
          : [...prev.secondaryServices, srvId]
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, { name: file.name, size: `${sizeMb} MB` }]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!formData.service) errs.service = "Please select a primary service";
    } else if (step === 2) {
      if (!formData.description.trim()) errs.description = "Please describe your project requirements";
    } else if (step === 3) {
      if (!formData.name.trim()) errs.name = "Full name is required";
      if (!formData.phone.trim()) errs.phone = "Contact phone number is required";
      if (!formData.email.trim()) errs.email = "Email address is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const enquiryNumber = generateEnquiryNumber();
      const newEnquiry: Enquiry = {
        id: `enq-${Date.now()}`,
        enquiryNumber,
        customerName: formData.name,
        company: formData.company || undefined,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email,
        location: formData.location,
        service: formData.service,
        secondaryServices: formData.secondaryServices,
        description: formData.description,
        quantity: formData.quantity || undefined,
        dimensions: formData.dimensions || undefined,
        deadline: formData.deadline || undefined,
        estimatedBudget: formData.estimatedBudget,
        source: formData.source,
        status: "NEW",
        attachments: formData.uploadedFiles.map((f, i) => ({
          id: `att-${i}`,
          name: f.name,
          url: "#",
          size: 1024 * 1024,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to DataStore & Cloud Firestore trigger
      DataStore.saveEnquiry(newEnquiry);

      // Also create a lead automatically for the CRM pipeline
      DataStore.saveLead({
        id: `lead-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        email: formData.email,
        source: "Website",
        service: formData.service,
        status: "NEW",
        notes: `Submitted online quote request ${enquiryNumber}. Budget: ${formData.estimatedBudget}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSubmittedEnquiry(newEnquiry);
      setCurrentStep(5);
    } catch (error) {
      console.error("Quote submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct WhatsApp message from submission
  const whatsappSubmissionUrl = submittedEnquiry
    ? getWhatsAppLink(
        settings.whatsappNumber,
        `Hello XMORE ART SOLUTIONS! I just submitted an online quote request.\n\n*Enquiry Ref:* ${submittedEnquiry.enquiryNumber}\n*Name:* ${submittedEnquiry.customerName}\n*Service:* ${submittedEnquiry.service}\n*Description:* ${submittedEnquiry.description}\n\nI would love to discuss this with your team.`
      )
    : "#";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-neutral-200 shadow-2xl rounded-3xl overflow-hidden">
      
      {/* Top Header & Step Progress */}
      {currentStep < 5 && (
        <div className="bg-brand-dark-card border-b border-white/10 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-red font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Step 0{currentStep} of 04
              </span>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1">
                {currentStep === 1 && "Select Primary & Supporting Services"}
                {currentStep === 2 && "Project Specifications & Requirements"}
                {currentStep === 3 && "Contact & Business Information"}
                {currentStep === 4 && "Review & Confirm Quotation Request"}
              </h2>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs text-neutral-400">Estimated Response Time</span>
              <p className="text-sm font-semibold text-emerald-400 font-heading">Under 2 Hours</p>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= step ? "bg-brand-red" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: SERVICE SELECTION */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-10 space-y-8 animate-fade-in">
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-black mb-1">
              Choose your primary creative vertical
            </h3>
            <p className="text-xs text-neutral-500">
              Select the main service you require. You can add additional services below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {servicesList.map((srv) => {
              const Icon = srv.icon;
              const isSelected = formData.service === srv.id;
              return (
                <button
                  type="button"
                  key={srv.id}
                  onClick={() => handleServiceSelect(srv.id)}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-brand-red bg-brand-red/5 shadow-md shadow-brand-red/10 scale-[1.02]"
                      : "border-neutral-200 hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-brand-red text-white" : "bg-neutral-100 text-neutral-700"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-heading font-bold text-base ${isSelected ? "text-brand-red" : "text-brand-black"}`}>
                      {srv.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {srv.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary Services (Multi-select) */}
          <div className="pt-6 border-t border-neutral-100">
            <h4 className="font-heading font-semibold text-sm text-brand-black mb-3">
              Need additional bundled services? (Optional)
            </h4>
            <div className="flex flex-wrap gap-2">
              {servicesList.filter(s => s.id !== formData.service).map((s) => {
                const isSelected = formData.secondaryServices.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleSecondaryService(s.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                      isSelected
                        ? "border-brand-red bg-brand-red text-white font-semibold"
                        : "border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-neutral-50"
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROJECT REQUIREMENTS */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-10 space-y-6 animate-fade-in">
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-black mb-1">
              Tell us about your project specifications
            </h3>
            <p className="text-xs text-neutral-500">
              The more details you share, the more accurate and fast your quotation will be.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quantity / Volume */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Quantity or Scope
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 500 Cards / 3 Videos / 1 Month Retainer"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>

            {/* Dimensions / Format */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Dimensions / Size (If applicable)
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="e.g. A4 / 10ft x 4ft / 1080x1920 Vertical"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>

            {/* Target Deadline */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Target Delivery Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm"
                />
              </div>
            </div>

            {/* Estimated Budget Range */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Estimated Budget Range (LKR)
              </label>
              <select
                value={formData.estimatedBudget}
                onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm bg-white"
              >
                <option value="Under Rs. 15,000">Under Rs. 15,000</option>
                <option value="Rs. 15,000 - 35,000">Rs. 15,000 – 35,000</option>
                <option value="Rs. 35,000 - 75,000">Rs. 35,000 – 75,000</option>
                <option value="Rs. 75,000 - 150,000">Rs. 75,000 – 150,000</option>
                <option value="Rs. 150,000+">Rs. 150,000+ (Enterprise / Wedding)</option>
              </select>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Project Brief & Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your design style, material preference (matte/gloss/foil), target audience, or event details..."
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.description ? "border-red-500" : "border-neutral-300"
              } focus:outline-none focus:border-brand-red text-sm leading-relaxed`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* File Upload Simulator */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Attach Reference Files / Brand Assets (Optional)
            </label>
            <div className="border-2 border-dashed border-neutral-300 hover:border-brand-red/60 rounded-2xl p-6 text-center transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs text-neutral-600">
                Drag and drop your logos, sample artwork, or photos here, or
              </p>
              <label className="mt-3 inline-block px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 cursor-pointer transition-colors">
                Browse Files
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
              </label>
              <p className="text-[10px] text-neutral-400 mt-2">
                Supported: PDF, AI, PSD, PNG, JPG, ZIP (Up to 50MB)
              </p>
            </div>

            {/* Uploaded File Badges */}
            {formData.uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs text-neutral-700 flex items-center gap-2 border border-neutral-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-red" />
                    <span>{file.name} ({file.size})</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-neutral-400 hover:text-red-500 text-xs font-bold ml-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-10 space-y-6 animate-fade-in">
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-black mb-1">
              Your Contact & Business Details
            </h3>
            <p className="text-xs text-neutral-500">
              Where should we dispatch your itemized quotation and artwork proofs?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kasun Jayasundara"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-500" : "border-neutral-300"
                  } focus:outline-none focus:border-brand-red text-sm`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Company / Organization (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Nilgiri Eco Resort / Private"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                  placeholder="e.g. 077 123 4567"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.phone ? "border-red-500" : "border-neutral-300"
                  } focus:outline-none focus:border-brand-red text-sm`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                WhatsApp Number (For fast proofing)
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="e.g. 077 123 4567"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. info@business.lk"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.email ? "border-red-500" : "border-neutral-300"
                  } focus:outline-none focus:border-brand-red text-sm`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Location / City */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Monaragala / Wellawaya / Colombo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-brand-red text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONFIRM */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-10 space-y-6 animate-fade-in">
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-black mb-1">
              Review Your Project Request Summary
            </h3>
            <p className="text-xs text-neutral-500">
              Verify all details before generating your official enquiry ref ID.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-neutral-200 text-sm">
              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Primary Service</span>
                <p className="font-bold text-brand-black">{formData.service}</p>
                {formData.secondaryServices.length > 0 && (
                  <p className="text-xs text-brand-red font-medium mt-0.5">
                    + {formData.secondaryServices.join(", ")}
                  </p>
                )}
              </div>

              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Budget Range</span>
                <p className="font-bold text-brand-black">{formData.estimatedBudget}</p>
              </div>

              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Quantity / Scope</span>
                <p className="text-neutral-700">{formData.quantity || "Not specified"}</p>
              </div>

              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Target Deadline</span>
                <p className="text-neutral-700">{formData.deadline || "Flexible"}</p>
              </div>
            </div>

            <div className="pb-4 border-b border-neutral-200 text-sm">
              <span className="text-xs text-neutral-500 uppercase font-semibold">Project Brief</span>
              <p className="text-neutral-800 mt-1 whitespace-pre-wrap leading-relaxed">
                {formData.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Contact Person</span>
                <p className="font-bold text-neutral-900">{formData.name} {formData.company && `(${formData.company})`}</p>
                <p className="text-xs text-neutral-600">{formData.location}</p>
              </div>

              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Communication Channels</span>
                <p className="text-neutral-900 font-medium">{formData.phone} (Call)</p>
                <p className="text-xs text-emerald-600">{formData.whatsapp} (WhatsApp)</p>
                <p className="text-xs text-neutral-600">{formData.email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Our studio coordinators will review your specs, verify artwork files, and dispatch an official PDF quotation with exact LKR pricing to your WhatsApp & Email within 2 hours.
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: THANK YOU & SUCCESS SCREEN */}
      {currentStep === 5 && submittedEnquiry && (
        <div className="p-8 sm:p-14 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xl shadow-emerald-600/20 animate-pulse-subtle">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Submission Successful
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-black uppercase">
              THANK YOU!
            </h2>
            <p className="text-neutral-600 text-sm max-w-md mx-auto mt-2">
              Your quotation enquiry has been successfully received by the XMORE ART SOLUTIONS production desk.
            </p>
          </div>

          {/* Unique Enquiry Number Badge */}
          <div className="bg-neutral-100 border border-neutral-300 rounded-2xl p-6 max-w-md mx-auto">
            <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider">
              Your Unique Enquiry Reference
            </span>
            <div className="font-heading font-black text-2xl sm:text-3xl text-brand-red tracking-wider mt-1">
              {submittedEnquiry.enquiryNumber}
            </div>
            <p className="text-[11px] text-neutral-500 mt-2">
              Please quote this number for faster tracking when contacting our studio.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
            <a
              href={whatsappSubmissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs tracking-wider uppercase transition-all shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT ON WHATSAPP NOW</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-heading font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <span>BACK TO WEBSITE</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-400">
            Assigned Studio: No. 48 Wellawaya Road, Monaragala • Direct Hotline: {settings.phoneDisplay}
          </div>
        </div>
      )}

      {/* Wizard Footer Navigation Buttons */}
      {currentStep < 5 && (
        <div className="bg-neutral-50 border-t border-neutral-200 p-6 sm:p-8 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-200 text-neutral-700 font-heading font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3.5 rounded-xl bg-brand-black hover:bg-brand-red text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ml-auto"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-red/30 flex items-center gap-2 ml-auto disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? "Generating Ref..." : "SUBMIT QUOTE REQUEST"}</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
