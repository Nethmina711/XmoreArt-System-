import React from "react";
import { initialServices } from "@/lib/data/seedData";
import { ServiceDetailView } from "@/components/public/ServiceDetailView";
import { notFound } from "next/navigation";

export default function DigitalMarketingPage() {
  const service = initialServices.find(s => s.slug === "digital-marketing");
  if (!service) return notFound();
  return <ServiceDetailView service={service} />;
}
