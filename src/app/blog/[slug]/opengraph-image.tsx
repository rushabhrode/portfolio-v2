import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/ui/og";
import { posts, getPost } from "@/content/portfolio.data";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Post";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return ogImage({
    eyebrow: post?.date ?? "writing",
    title: post?.title ?? "Writing",
    meta: post?.tags.slice(0, 3),
  });
}
