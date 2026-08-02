import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/ui/og";
import { projects, getProject } from "@/content/portfolio.data";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return ogImage({
    eyebrow: `project · ${project?.year ?? ""}`,
    title: project?.title ?? "Project",
    // The metrics are the strongest thing about each project, so they are what
    // shows in a link preview.
    meta: project?.metrics.map((m) => m.value).slice(0, 3),
  });
}
