"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CtaBanner } from "@/components/public/CtaBanner";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { DataStore } from "@/lib/data/dataStore";
import { ArrowUpRight, Sparkles, Search } from "lucide-react";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allProjects = DataStore.getPortfolioProjects().filter(p => p.published);

  const categories = [
    "All",
    "Branding",
    "Printing",
    "Graphic Design",
    "Photography",
    "Videography",
    "Digital Marketing",
  ];

  const filteredProjects = allProjects.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Creative Showcase</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
            Our Portfolio of Work
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore commercial printing, brand identity systems, cinematic video productions, and digital growth campaigns crafted by XMORE.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by client, industry, or tag..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 focus:border-brand-red focus:outline-none text-white text-sm placeholder-neutral-400 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-neutral-50 border-b border-neutral-200 sticky top-20 z-30 backdrop-blur-md bg-neutral-50/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105"
                    : "bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200">
              <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-xl text-brand-black">
                No projects found in this category
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                Try selecting &ldquo;All&rdquo; or changing your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group block bg-white border border-neutral-200 hover:border-brand-red/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-brand-black/80 backdrop-blur-md text-white text-[11px] font-heading font-semibold tracking-wider uppercase border border-white/10">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-6">
                    <p className="text-xs text-neutral-400 font-medium mb-1 uppercase tracking-wider">
                      {project.client}
                    </p>
                    <h3 className="font-heading font-bold text-lg text-brand-black group-hover:text-brand-red transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-medium text-neutral-600"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Bottom CTA */}
      <CtaBanner />

      <WhatsAppFloatingButton />
      <Footer />
    </main>
  );
}
