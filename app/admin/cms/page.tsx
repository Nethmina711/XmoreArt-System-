"use client";

import React, { useState, useEffect } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { useSettings } from "@/lib/context/SettingsContext";
import { 
  PortfolioProject, 
  PackageItem, 
  BlogPost, 
  ServiceItem, 
  ShootPackageOption, 
  ShootAddonOption,
  ShootType
} from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CloudSync } from "@/lib/data/cloudSync";
import { 
  Globe, 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  FileText, 
  Package, 
  ShieldCheck, 
  Image as ImageIcon, 
  Eye, 
  Save,
  Camera,
  Heart,
  Film,
  Video,
  DollarSign,
  CheckCircle2,
  Printer,
  Palette,
  TrendingUp,
  Shield,
  Cloud
} from "lucide-react";

export default function CmsPage() {
  const { websiteContent, updateWebsiteContent } = useSettings();
  const [activeTab, setActiveTab] = useState<"HERO" | "PORTFOLIO" | "PACKAGES" | "SHOOTS" | "BLOG" | "SERVICES">("SERVICES");

  // Dynamic lists
  const [portfolioProjects, setPortfolioProjects] = useState(DataStore.getPortfolioProjects());
  const [packages, setPackages] = useState(DataStore.getPackages());
  const [blogPosts, setBlogPosts] = useState(DataStore.getBlogPosts());
  const [services, setServices] = useState(DataStore.getServices());
  const [shootPackages, setShootPackages] = useState<ShootPackageOption[]>(DataStore.getShootPackages());
  const [shootAddons, setShootAddons] = useState<ShootAddonOption[]>(DataStore.getShootAddons());

  // Hero Form
  const [heroForm, setHeroForm] = useState(websiteContent.hero);
  const [heroSaved, setHeroSaved] = useState(false);

  // Portfolio Modal
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    slug: "",
    category: "Branding" as PortfolioProject["category"],
    client: "",
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
    description: "",
    challenge: "",
    solution: "",
    deliverables: "Brand Identity Book, Stationery Kit, Menu Cards",
    tags: "Branding, Hospitality, Eco Luxury",
    date: new Date().toISOString().split("T")[0],
    published: true,
  });

  // Package Modal (for /packages)
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    category: "Wedding" as PackageItem["category"],
    description: "",
    priceDisplay: "Rs. 185,000",
    features: "Full Day Coverage (Poruwa + Reception)\n2 Photographers + 2 Cinematographers\n4K Drone Aerial Coverage\n12x24 Flush Mount Leather Album",
    ctaText: "Reserve Package",
    popular: false,
    published: true,
  });

  // Shoot Package Modal (for /book wizard)
  const [isShootModalOpen, setIsShootModalOpen] = useState(false);
  const [editingShootPkg, setEditingShootPkg] = useState<ShootPackageOption | null>(null);
  const [shootPkgForm, setShootPkgForm] = useState({
    id: "",
    type: "WEDDING_FULL" as ShootType,
    title: "",
    subtitle: "",
    basePrice: 185000,
    popular: false,
  });

  // Shoot Addon Modal (for /book wizard)
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<ShootAddonOption | null>(null);
  const [addonForm, setAddonForm] = useState({
    id: "",
    name: "",
    price: 35000,
    desc: "",
  });

  // Service Modal (for /services)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    iconName: "Sparkles",
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
    startingPrice: "Starting from Rs. 25,000",
    subServices: "Sub-service 1, Sub-service 2, Sub-service 3",
    features: "Feature capability 1\nFeature capability 2\nFeature capability 3",
    published: true,
  });

  // Blog Modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    category: "Branding",
    excerpt: "",
    content: "# Blog Article Content\n\nWrite your insights here...",
    author: "Miyuru Senarathne",
    authorRole: "Creative Director",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
    tags: "Branding, Business Growth, Sri Lanka",
    published: true,
  });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({ hero: heroForm });
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 3000);
  };

  // Portfolio Handlers
  const openAddPortfolio = () => {
    setEditingProject(null);
    setPortfolioForm({
      title: "",
      slug: "",
      category: "Branding",
      client: "",
      coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
      description: "",
      challenge: "",
      solution: "",
      deliverables: "Brand Identity, Stationery, Signage",
      tags: "Branding, Sri Lanka, Design",
      date: new Date().toISOString().split("T")[0],
      published: true,
    });
    setIsPortfolioModalOpen(true);
  };

  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title) return;

    const slug = portfolioForm.slug || portfolioForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const projToSave: PortfolioProject = {
      id: editingProject ? editingProject.id : `port-${Date.now()}`,
      slug,
      title: portfolioForm.title,
      category: portfolioForm.category,
      client: portfolioForm.client,
      coverImage: portfolioForm.coverImage,
      gallery: [portfolioForm.coverImage],
      description: portfolioForm.description,
      challenge: portfolioForm.challenge || undefined,
      solution: portfolioForm.solution || undefined,
      deliverables: portfolioForm.deliverables.split(",").map(s => s.trim()).filter(Boolean),
      tags: portfolioForm.tags.split(",").map(s => s.trim()).filter(Boolean),
      date: portfolioForm.date,
      featured: true,
      published: portfolioForm.published,
    };

    DataStore.savePortfolioProject(projToSave);
    setPortfolioProjects(DataStore.getPortfolioProjects());
    setIsPortfolioModalOpen(false);
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm("Delete this portfolio project?")) {
      DataStore.deletePortfolioProject(id);
      setPortfolioProjects(DataStore.getPortfolioProjects());
    }
  };

  // Package Handlers
  const openAddPackage = () => {
    setEditingPackage(null);
    setPackageForm({
      name: "",
      category: "Wedding",
      description: "",
      priceDisplay: "Rs. 185,000",
      features: "Full Day Coverage (Poruwa + Reception)\n2 Photographers + 2 Cinematographers\n4K Drone Aerial Coverage\n12x24 Flush Mount Leather Album",
      ctaText: "Reserve Package",
      popular: false,
      published: true,
    });
    setIsPackageModalOpen(true);
  };

  const openEditPackage = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      category: pkg.category,
      description: pkg.description,
      priceDisplay: pkg.priceDisplay,
      features: pkg.features.join("\n"),
      ctaText: pkg.ctaText,
      popular: !!pkg.popular,
      published: pkg.published,
    });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name) return;

    const pkgToSave: PackageItem = {
      id: editingPackage ? editingPackage.id : `pkg-${Date.now()}`,
      name: packageForm.name,
      category: packageForm.category,
      description: packageForm.description,
      priceDisplay: packageForm.priceDisplay,
      features: packageForm.features.split("\n").map(s => s.trim()).filter(Boolean),
      ctaText: packageForm.ctaText,
      popular: packageForm.popular,
      published: packageForm.published,
    };

    DataStore.savePackage(pkgToSave);
    setPackages(DataStore.getPackages());
    setIsPackageModalOpen(false);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Delete this package tier?")) {
      DataStore.deletePackage(id);
      setPackages(DataStore.getPackages());
    }
  };

  // Shoot Packages (/book wizard) Handlers
  const openEditShootPkg = (pkg: ShootPackageOption) => {
    setEditingShootPkg(pkg);
    setShootPkgForm({
      id: pkg.id,
      type: pkg.type,
      title: pkg.title,
      subtitle: pkg.subtitle,
      basePrice: pkg.basePrice,
      popular: !!pkg.popular,
    });
    setIsShootModalOpen(true);
  };

  const handleSaveShootPkg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shootPkgForm.title) return;

    const pkgToSave: ShootPackageOption = {
      id: editingShootPkg ? editingShootPkg.id : `shoot-${Date.now()}`,
      type: shootPkgForm.type,
      title: shootPkgForm.title,
      subtitle: shootPkgForm.subtitle,
      basePrice: Number(shootPkgForm.basePrice) || 0,
      popular: shootPkgForm.popular,
    };

    DataStore.saveShootPackage(pkgToSave);
    setShootPackages(DataStore.getShootPackages());
    setIsShootModalOpen(false);
  };

  // Shoot Addons Handlers
  const openAddAddon = () => {
    setEditingAddon(null);
    setAddonForm({
      id: `addon-${Date.now()}`,
      name: "",
      price: 25000,
      desc: "",
    });
    setIsAddonModalOpen(true);
  };

  const openEditAddon = (addon: ShootAddonOption) => {
    setEditingAddon(addon);
    setAddonForm({
      id: addon.id,
      name: addon.name,
      price: addon.price,
      desc: addon.desc,
    });
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonForm.name) return;

    const addonToSave: ShootAddonOption = {
      id: editingAddon ? editingAddon.id : (addonForm.id || `addon-${Date.now()}`),
      name: addonForm.name,
      price: Number(addonForm.price) || 0,
      desc: addonForm.desc,
    };

    DataStore.saveShootAddon(addonToSave);
    setShootAddons(DataStore.getShootAddons());
    setIsAddonModalOpen(false);
  };

  const handleDeleteAddon = (id: string) => {
    if (confirm("Delete this add-on option?")) {
      DataStore.deleteShootAddon(id);
      setShootAddons(DataStore.getShootAddons());
    }
  };

  // Services Handlers
  const openAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      iconName: "Sparkles",
      coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
      startingPrice: "Starting from Rs. 25,000",
      subServices: "Commercial Delivery, Creative Direction, Fast Turnaround",
      features: "Premium Raw Assets\nLicensed Commercial Rights\nDedicated Creative Specialist",
      published: true,
    });
    setIsServiceModalOpen(true);
  };

  const openEditService = (svc: ServiceItem) => {
    setEditingService(svc);
    setServiceForm({
      name: svc.name,
      slug: svc.slug,
      shortDescription: svc.shortDescription,
      fullDescription: svc.fullDescription,
      iconName: svc.iconName,
      coverImage: svc.coverImage,
      startingPrice: svc.startingPrice,
      subServices: svc.subServices.join(", "),
      features: svc.features.join("\n"),
      published: svc.published,
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name) return;

    const slug = serviceForm.slug || serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const svcToSave: ServiceItem = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      slug,
      name: serviceForm.name,
      shortDescription: serviceForm.shortDescription,
      fullDescription: serviceForm.fullDescription || serviceForm.shortDescription,
      iconName: serviceForm.iconName,
      coverImage: serviceForm.coverImage,
      startingPrice: serviceForm.startingPrice,
      subServices: serviceForm.subServices.split(",").map(s => s.trim()).filter(Boolean),
      features: serviceForm.features.split("\n").map(s => s.trim()).filter(Boolean),
      gallery: editingService?.gallery || [serviceForm.coverImage],
      benefits: editingService?.benefits || ["Dedicated Art Director", "Fast Turnaround", "Satisfaction Guaranteed"],
      faq: editingService?.faq || [{ question: "What is included?", answer: "All design files, revisions, and production deliverables." }],
      processSteps: editingService?.processSteps || [
        { title: "Briefing & Concept", desc: "Understanding client goals and creative direction." },
        { title: "Production & Refinement", desc: "Crafting deliverables with precision." },
        { title: "Delivery & Sign-off", desc: "Final file transfer and implementation." }
      ],
      published: serviceForm.published,
    };

    DataStore.saveService(svcToSave);
    setServices(DataStore.getServices());
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service vertical?")) {
      DataStore.deleteService(id);
      setServices(DataStore.getServices());
    }
  };

  // Blog Handlers
  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: "",
      slug: "",
      category: "Branding",
      excerpt: "",
      content: "# Your Article Headline\n\nArticle paragraph content...",
      author: "Miyuru Senarathne",
      authorRole: "Creative Director",
      readTime: "4 min read",
      coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
      tags: "Branding, Printing, Growth",
      published: true,
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) return;

    const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const blogToSave: BlogPost = {
      id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
      slug,
      title: blogForm.title,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      coverImage: blogForm.coverImage,
      author: blogForm.author,
      authorRole: blogForm.authorRole,
      category: blogForm.category,
      tags: blogForm.tags.split(",").map(s => s.trim()).filter(Boolean),
      published: blogForm.published,
      publishedDate: new Date().toISOString().split("T")[0],
      readTime: blogForm.readTime,
    };

    DataStore.saveBlogPost(blogToSave);
    setBlogPosts(DataStore.getBlogPosts());
    setIsBlogModalOpen(false);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm("Delete this blog article?")) {
      DataStore.deleteBlogPost(id);
      setBlogPosts(DataStore.getBlogPosts());
    }
  };

  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  const handleQuickBroadcast = async () => {
    setBroadcasting(true);
    await CloudSync.pushAllToCloud();
    setBroadcasting(false);
    setBroadcastDone(true);
    setTimeout(() => setBroadcastDone(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white selection:bg-brand-red selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Website Content & CMS Suite
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Update services, packages, wedding pricing, homepage copy, portfolio & blog in real-time
          </p>
        </div>

        <button
          onClick={handleQuickBroadcast}
          disabled={broadcasting}
          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all self-start sm:self-auto shadow-lg shadow-emerald-500/10"
        >
          <Cloud className={`w-3.5 h-3.5 ${broadcasting ? "animate-spin" : ""}`} />
          <span>{broadcastDone ? "✅ Synced to All Devices!" : broadcasting ? "Broadcasting..." : "Sync All to Cloud"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: "SERVICES", label: `Services (${services.length})`, icon: Layers },
          { id: "SHOOTS", label: `Wedding & Shoot Pricing (/book)`, icon: Camera },
          { id: "PACKAGES", label: `Public Packages CMS (${packages.length})`, icon: Package },
          { id: "HERO", label: "Homepage Hero", icon: Sparkles },
          { id: "PORTFOLIO", label: `Portfolio CMS (${portfolioProjects.length})`, icon: ImageIcon },
          { id: "BLOG", label: `Blog CMS (${blogPosts.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-brand-red text-white shadow-lg shadow-brand-red/25"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SERVICES CMS */}
      {activeTab === "SERVICES" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-neutral-400">
              Manage your core service verticals displayed across the homepage, services index, and navigation
            </p>
            <button
              onClick={openAddService}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-brand-red/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-brand-red font-mono">
                      /{svc.slug}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      svc.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-500/10 text-neutral-400"
                    }`}>
                      {svc.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white mt-1">{svc.name}</h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">{svc.shortDescription}</p>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Starting Rate:</span>
                    <span className="font-heading font-bold text-base text-emerald-400">{svc.startingPrice}</span>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">Deliverables:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {svc.subServices.slice(0, 3).map((sub, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-300">
                          {sub}
                        </span>
                      ))}
                      {svc.subServices.length > 3 && (
                        <span className="text-[10px] text-neutral-500 self-center">
                          +{svc.subServices.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-xs">
                  <a
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-red hover:underline font-bold"
                  >
                    View Page &rarr;
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditService(svc)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5 text-brand-red" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteService(svc.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SHOOT & WEDDING PRICING CMS */}
      {activeTab === "SHOOTS" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Shoot Packages Section */}
          <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-brand-red" />
                  <span>Interactive Booking Wizard Packages (`/book`)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Edit the base pricing and descriptions shown to clients on the Book Your Wedding & Shoot page
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shootPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/10 text-neutral-300">
                        {pkg.type}
                      </span>
                      {pkg.popular && (
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-red text-white">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-base text-white">{pkg.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{pkg.subtitle}</p>
                    
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Base Rate:</span>
                      <span className="font-heading font-black text-xl text-emerald-400 font-mono">
                        {formatCurrency(pkg.basePrice)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => openEditShootPkg(pkg)}
                      className="px-3 py-1.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-brand-red/20"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Price & Info</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Deliverables & Upgrades Section */}
          <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-red" />
                  <span>Customizable Shoot Add-ons & Gear Upgrades</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage optional upgrades selectable in Step 4 of the booking wizard (Drone, Luxury Albums, Teasers, etc.)
                </p>
              </div>

              <button
                type="button"
                onClick={openAddAddon}
                className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-brand-red/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Add-on</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shootAddons.map((addon) => (
                <div
                  key={addon.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">{addon.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{addon.desc}</p>
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Add-on Fee:</span>
                      <span className="font-heading font-bold text-lg text-emerald-400 font-mono">
                        +{formatCurrency(addon.price)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openEditAddon(addon)}
                      className="text-xs text-brand-red hover:underline font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Price</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddon(addon.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                      title="Delete Addon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PACKAGES CMS */}
      {activeTab === "PACKAGES" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Manage tiered pricing packages displayed on the public packages page and wedding section
            </p>
            <button
              onClick={openAddPackage}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-red">{pkg.category}</span>
                  <h3 className="font-heading font-bold text-lg text-white mt-1">{pkg.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{pkg.description}</p>
                  <div className="font-heading font-extrabold text-2xl text-emerald-400 mt-4 font-mono">
                    {pkg.priceDisplay}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">{pkg.features.length} features listed</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditPackage(pkg)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                      title="Edit Package"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HERO CMS */}
      {activeTab === "HERO" && (
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl animate-fade-in">
          <form onSubmit={handleSaveHero} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Top Badge / Pill Text
              </label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={e => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Headline Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={heroForm.titleLine1}
                  onChange={e => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Headline Line 2 *
                </label>
                <input
                  type="text"
                  required
                  value={heroForm.titleLine2}
                  onChange={e => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Highlighted Word in Headline
              </label>
              <input
                type="text"
                value={heroForm.highlightWord}
                onChange={e => setHeroForm({ ...heroForm, highlightWord: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-bold text-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Sub-Headline Description
              </label>
              <textarea
                rows={3}
                value={heroForm.subtitle}
                onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaText}
                  onChange={e => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaText}
                  onChange={e => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {heroSaved ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4" /> Homepage Hero Updated!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-red/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: PORTFOLIO CMS */}
      {activeTab === "PORTFOLIO" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Manage client showcase case studies displayed on the portfolio page
            </p>
            <button
              onClick={openAddPortfolio}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioProjects.map((p) => (
              <div
                key={p.id}
                className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-44 object-cover border-b border-white/10"
                  />
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase text-brand-red">{p.category}</span>
                    <h3 className="font-heading font-bold text-base text-white mt-1">{p.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">Client: {p.client}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <span className="text-[10px] text-neutral-500">{p.date}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingProject(p);
                        setPortfolioForm({
                          title: p.title,
                          slug: p.slug,
                          category: p.category,
                          client: p.client,
                          coverImage: p.coverImage,
                          description: p.description,
                          challenge: p.challenge || "",
                          solution: p.solution || "",
                          deliverables: p.deliverables.join(", "),
                          tags: p.tags.join(", "),
                          date: p.date,
                          published: p.published,
                        });
                        setIsPortfolioModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePortfolio(p.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BLOG CMS */}
      {activeTab === "BLOG" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Publish editorial articles, guides & design tutorials
            </p>
            <button
              onClick={openAddBlog}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-40 object-cover border-b border-white/10"
                  />
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase text-brand-red">{post.category}</span>
                    <h3 className="font-heading font-bold text-base text-white mt-1 line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <span className="text-[10px] text-neutral-500">{post.readTime}</span>
                  <button
                    onClick={() => handleDeleteBlog(post.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsServiceModalOpen(false)} />
          <div className="w-full max-w-lg bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingService ? "Edit Service Vertical" : "Add New Service Vertical"}
              </h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. Commercial Photography & Aerial Cinema"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    URL Slug (e.g. photography)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.slug}
                    onChange={e => setServiceForm({ ...serviceForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                    placeholder="e.g. aerial-cinema"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Starting Rate Display *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.startingPrice}
                    onChange={e => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                    placeholder="e.g. Starting from Rs. 45,000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Cover Image URL (Unsplash or CDN)
                </label>
                <input
                  type="url"
                  required
                  value={serviceForm.coverImage}
                  onChange={e => setServiceForm({ ...serviceForm, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Short Summary Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.shortDescription}
                  onChange={e => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  placeholder="Concise overview shown in cards and headers..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Page Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.fullDescription}
                  onChange={e => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                  placeholder="In-depth explanation shown on the dedicated service page..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Deliverables & Sub-Services (Comma-separated)
                </label>
                <input
                  type="text"
                  value={serviceForm.subServices}
                  onChange={e => setServiceForm({ ...serviceForm, subServices: e.target.value })}
                  placeholder="Brand Architecture, Color Palette, Packaging Box"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Core Features & Strengths (One per line)
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.features}
                  onChange={e => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="4K Cinema Grade Sensors&#10;Color Graded Master Files&#10;Express 48-Hour Rush Delivery Available"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="svcPublished"
                  checked={serviceForm.published}
                  onChange={e => setServiceForm({ ...serviceForm, published: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-red focus:ring-0 cursor-pointer"
                />
                <label htmlFor="svcPublished" className="text-xs text-neutral-300 cursor-pointer select-none">
                  Published live on public website & service menus
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/30"
                >
                  {editingService ? "Update Service" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SHOOT PACKAGE MODAL (/book) */}
      {isShootModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsShootModalOpen(false)} />
          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Edit Shoot Package Price</h2>
              <button onClick={() => setIsShootModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShootPkg} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={shootPkgForm.title}
                  onChange={e => setShootPkgForm({ ...shootPkgForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Base Price in LKR (Numerals only) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={shootPkgForm.basePrice}
                  onChange={e => setShootPkgForm({ ...shootPkgForm, basePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-brand-red focus:outline-none font-mono text-emerald-400 font-bold"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Preview: {formatCurrency(shootPkgForm.basePrice)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Subtitle / Scope Description
                </label>
                <textarea
                  rows={2}
                  value={shootPkgForm.subtitle}
                  onChange={e => setShootPkgForm({ ...shootPkgForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="shootPopular"
                  checked={shootPkgForm.popular}
                  onChange={e => setShootPkgForm({ ...shootPkgForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-red focus:ring-0 cursor-pointer"
                />
                <label htmlFor="shootPopular" className="text-xs text-neutral-300 cursor-pointer select-none">
                  Highlight as &quot;Most Popular&quot; in Booking Wizard
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsShootModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SHOOT ADDON MODAL (/book) */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddonModalOpen(false)} />
          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingAddon ? "Edit Add-on Service" : "Add New Add-on Service"}
              </h2>
              <button onClick={() => setIsAddonModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Add-on Name *
                </label>
                <input
                  type="text"
                  required
                  value={addonForm.name}
                  onChange={e => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="e.g. 4K Drone Aerial Cinematography"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Add-on Price in LKR *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={addonForm.price}
                  onChange={e => setAddonForm({ ...addonForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-brand-red focus:outline-none font-mono text-emerald-400 font-bold"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Preview: +{formatCurrency(addonForm.price)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={addonForm.desc}
                  onChange={e => setAddonForm({ ...addonForm, desc: e.target.value })}
                  placeholder="e.g. Licensed aerial operator for cinematic overhead angles"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddonModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/30"
                >
                  Save Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PACKAGE MODAL */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPackageModalOpen(false)} />
          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingPackage ? "Edit Pricing Package" : "Add Pricing Package"}
              </h2>
              <button onClick={() => setIsPackageModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  value={packageForm.name}
                  onChange={e => setPackageForm({ ...packageForm, name: e.target.value })}
                  placeholder="e.g. Royal Signature Wedding Package"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Price Display *
                  </label>
                  <input
                    type="text"
                    required
                    value={packageForm.priceDisplay}
                    onChange={e => setPackageForm({ ...packageForm, priceDisplay: e.target.value })}
                    placeholder="e.g. Rs. 185,000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={packageForm.category}
                    onChange={e => setPackageForm({ ...packageForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none font-semibold"
                  >
                    <option value="Wedding">💒 Wedding & Shoots</option>
                    <option value="Branding">🎨 Branding & Identity</option>
                    <option value="Social Media">📱 Social Media Retainer</option>
                    <option value="Videography">🎬 Video Commercial</option>
                    <option value="Photography">📸 Photography</option>
                    <option value="Printing">🖨️ Printing & Large Format</option>
                    <option value="Custom">✨ Custom Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={packageForm.description}
                  onChange={e => setPackageForm({ ...packageForm, description: e.target.value })}
                  placeholder="e.g. Full Poruwa + Reception with 4K Drone & Album"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Features (One deliverable per line)
                </label>
                <textarea
                  rows={4}
                  value={packageForm.features}
                  onChange={e => setPackageForm({ ...packageForm, features: e.target.value })}
                  placeholder="Full Day Coverage (Poruwa + Reception)&#10;2 Master Photographers + 2 Cinematographers&#10;4K Drone Aerial Coverage&#10;12x24 Flush Mount Leather Album"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pkgPopular"
                  checked={packageForm.popular}
                  onChange={e => setPackageForm({ ...packageForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-red focus:ring-0 cursor-pointer"
                />
                <label htmlFor="pkgPopular" className="text-xs text-neutral-300 cursor-pointer select-none">
                  Highlight as &quot;Most Popular Package&quot; badge
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/30"
                >
                  {editingPackage ? "Update Package" : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTFOLIO MODAL */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPortfolioModalOpen(false)} />
          <div className="w-full max-w-lg bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
              </h2>
              <button onClick={() => setIsPortfolioModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={portfolioForm.title}
                  onChange={e => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={portfolioForm.client}
                    onChange={e => setPortfolioForm({ ...portfolioForm, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={portfolioForm.category}
                    onChange={e => setPortfolioForm({ ...portfolioForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  >
                    <option value="Branding">Branding</option>
                    <option value="Printing">Printing</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Cover Image URL (Unsplash or CDN)
                </label>
                <input
                  type="url"
                  required
                  value={portfolioForm.coverImage}
                  onChange={e => setPortfolioForm({ ...portfolioForm, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={portfolioForm.description}
                  onChange={e => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Deliverables (Comma-separated)
                </label>
                <input
                  type="text"
                  value={portfolioForm.deliverables}
                  onChange={e => setPortfolioForm({ ...portfolioForm, deliverables: e.target.value })}
                  placeholder="Brand Identity, 3D Mockup, Packaging"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
