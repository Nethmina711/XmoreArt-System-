"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { DataStore } from "@/lib/data/dataStore";
import { initialServices } from "@/lib/data/seedData";
import { ServiceDetailView } from "@/components/public/ServiceDetailView";

export default function DynamicServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) return notFound();

  const service = DataStore.getServiceBySlug(slug) || initialServices.find(s => s.slug === slug);
  if (!service) return notFound();

  return <ServiceDetailView service={service} />;
}
