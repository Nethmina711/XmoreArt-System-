"use client";

import React, { useState } from "react";
import { DataStore } from "@/lib/data/dataStore";
import { useSettings } from "@/lib/context/SettingsContext";
import { PortfolioProject, PackageItem, BlogPost, ServiceItem } from "@/lib/types";
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
  Save 
} from "lucide-react";

export default function CmsPage() {
  const { websiteContent, updateWebsiteContent } = useSettings();
  const [activeTab, setActiveTab] = useState<"HERO" | "PORTFOLIO" | "PACKAGES" | "BLOG" | "SERVICES">("HERO");

  // Dynamic lists
  const [portfolioProjects, setPortfolioProjects] = useState(DataStore.getPortfolioProjects());
  const [packages, setPackages] = useState(DataStore.getPackages());
  const [blogPosts, setBlogPosts] = useState(DataStore.getBlogPosts());
  const [services, setServices] = useState(DataStore.getServices());

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

  // Package Modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    category: "Branding" as PackageItem["category"],
    description: "",
    priceDisplay: "Rs. 35,000",
    features: "Feature 1\nFeature 2\nFeature 3",
    ctaText: "Choose Package",
    popular: false,
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

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Website Content & CMS Suite
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Update homepage copy, hero banners, portfolio projects, packages & articles without touching code
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: "HERO", label: "Homepage Hero", icon: Sparkles },
          { id: "PORTFOLIO", label: `Portfolio CMS (${portfolioProjects.length})`, icon: ImageIcon },
          { id: "PACKAGES", label: `Packages CMS (${packages.length})`, icon: Package },
          { id: "BLOG", label: `Blog CMS (${blogPosts.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
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

      {/* TAB 1: HOMEPAGE HERO CMS */}
      {activeTab === "HERO" && (
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl animate-fade-in">
          <form onSubmit={handleSaveHero} className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-white mb-4">
              Homepage Hero Section Configuration
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Badge Headline
              </label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={e => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Title Line 1
                </label>
                <input
                  type="text"
                  value={heroForm.titleLine1}
                  onChange={e => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Title Line 2
                </label>
                <input
                  type="text"
                  value={heroForm.titleLine2}
                  onChange={e => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Highlighted Word (Red)
                </label>
                <input
                  type="text"
                  value={heroForm.highlightWord}
                  onChange={e => setHeroForm({ ...heroForm, highlightWord: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-red font-bold text-xs focus:border-brand-red focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={heroForm.subtitle}
                onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Background Image URL
              </label>
              <input
                type="url"
                value={heroForm.bgImageUrl}
                onChange={e => setHeroForm({ ...heroForm, bgImageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              {heroSaved ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Live Website Updated!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-red/25 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PORTFOLIO CMS */}
      {activeTab === "PORTFOLIO" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Manage client projects, case studies, high-resolution galleries and tags
            </p>
            <button
              onClick={openAddPortfolio}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects.map((p) => (
              <div
                key={p.id}
                className="bg-brand-dark-card border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-900 relative">
                    <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-black/80 backdrop-blur-md text-[10px] uppercase font-bold text-white">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-neutral-500 uppercase font-semibold">{p.client}</p>
                    <h3 className="font-heading font-bold text-sm text-white line-clamp-1 mt-0.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{p.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Published</span>
                  <div className="flex items-center gap-2">
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

      {/* TAB 3: PACKAGES CMS */}
      {activeTab === "PACKAGES" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Manage tiered pricing packages displayed on the public packages page
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

      {/* TAB 4: BLOG CMS */}
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

      {/* TAB 5: SERVICES CMS */}
      {activeTab === "SERVICES" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Manage 6 core full-stack service verticals displayed across the website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-red font-mono">
                    /{svc.slug}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-white mt-1">{svc.name}</h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-3">{svc.shortDescription}</p>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Starting Rate:</span>
                    <span className="font-heading font-bold text-base text-emerald-400">{svc.startingPrice}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 text-[10px]">{svc.subServices.length} sub-services</span>
                  <a
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-red hover:underline font-bold"
                  >
                    View Page &rarr;
                  </a>
                </div>
              </div>
            ))}
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

      {/* BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsBlogModalOpen(false)} />
          <div className="w-full max-w-xl bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Create Blog Article</h2>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={blogForm.coverImage}
                  onChange={e => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Short Excerpt
                </label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Article Markdown Content
                </label>
                <textarea
                  rows={6}
                  value={blogForm.content}
                  onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
