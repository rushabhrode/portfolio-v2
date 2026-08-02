import type { Metadata } from "next";
import Link from "next/link";
import { ReadingLayout, BackLink } from "@/ui/Chrome";
import { posts } from "@/content/portfolio.data";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on building maintainable systems, applied machine learning, and shipping software.",
};

export default function BlogIndex() {
  return (
    <ReadingLayout>
      <BackLink href="/" label="home" />

      <header className="mt-7">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Writing</h1>
        <p className="mt-2 text-text/60">
          Notes on building things that stay maintainable.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block py-6">
              <time
                dateTime={post.iso}
                className="font-mono text-[11px] tracking-wider text-accent uppercase"
              >
                {post.date}
              </time>
              <h2 className="mt-1.5 text-lg font-medium transition-colors group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-1.5 leading-relaxed text-text/60">{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ReadingLayout>
  );
}
