import { MetadataRoute } from "next";
import { initialServices, initialPortfolioProjects, initialBlogPosts } from "@/lib/data/seedData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xmoreart.lk";
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/services/printing",
    "/services/graphic-design",
    "/services/digital-marketing",
    "/services/photography",
    "/services/videography",
    "/services/branding",
    "/portfolio",
    "/packages",
    "/contact",
    "/quote",
    "/blog",
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = initialServices.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const portfolioRoutes = initialPortfolioProjects.map(project => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogRoutes = initialBlogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...blogRoutes];
}
