"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataStore } from "@/lib/data/dataStore";
import { ArrowUpRight, Sparkles, Filter } from "lucide-react";

export const FeaturedWork: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
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

  const filteredProjects = activeCategory === "All"
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              <span className="w-8 h-[2px] bg-brand-red" />
              <span>Selected Case Studies</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-black uppercase tracking-tight">
              Featured Work
            </h2>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, 6).map((project) => (
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

                {/* Date Tag */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-6">
                <p className="text-xs text-neutral-400 font-medium mb-1.5 uppercase tracking-wider">
                  {project.client}
                </p>
                <h3 className="font-heading font-bold text-lg text-brand-black group-hover:text-brand-red transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Deliverables Tags */}
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

        {/* View All Projects Button */}
        <div className="mt-16 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-brand-black hover:bg-brand-red text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>VIEW ALL PORTFOLIO PROJECTS</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
