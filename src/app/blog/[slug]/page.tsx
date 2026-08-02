import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingLayout, BackLink } from "@/ui/Chrome";
import { Prose } from "@/ui/Prose";
import { posts, getPost, person } from "@/content/portfolio.data";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.iso,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.iso,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: person.name, url: person.url },
  };

  return (
    <ReadingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackLink href="/blog" label="writing" />

      <article className="mt-7">
        <header className="border-b border-line pb-7">
          <time
            dateTime={post.iso}
            className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase"
          >
            {post.date}
          </time>
          <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li
                key={t}
                className="rounded-sm border border-line px-2.5 py-1 font-mono text-[10px] text-dim"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-8">
          <Prose blocks={post.body} />
        </div>
      </article>
    </ReadingLayout>
  );
}
