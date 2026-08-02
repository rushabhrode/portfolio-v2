import type { MetadataRoute } from "next";
import { person } from "@/content/portfolio.data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${person.url}/sitemap.xml`,
  };
}
