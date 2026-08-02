import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/ui/og";
import { person, education } from "@/content/portfolio.data";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${person.name} — ${person.role}`;

export default function Image() {
  return ogImage({
    eyebrow: person.role,
    title: person.name,
    meta: ["95% accuracy", "IEEE OTCON-2025", `CGPA ${education.cgpa}`],
  });
}
