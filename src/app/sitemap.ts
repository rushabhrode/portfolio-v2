import type { MetadataRoute } from "next";
import { person, projects, papers, posts } from "@/content/portfolio.data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = person.url;

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
    ...papers.map((p) => ({
      url: `${base}/papers/${p.slug}`,
      lastModified: new Date(p.iso),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.iso),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
