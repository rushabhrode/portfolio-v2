import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/ui/og";
import { papers, getPaper } from "@/content/portfolio.data";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Publication";

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaper(slug);

  return ogImage({
    eyebrow: paper?.venue ?? "publication",
    title: paper?.title ?? "Publication",
    meta: paper?.keywords.slice(0, 3),
  });
}
