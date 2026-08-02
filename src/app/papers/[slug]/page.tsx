import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingLayout, BackLink } from "@/ui/Chrome";
import { papers, getPaper, person } from "@/content/portfolio.data";

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) return {};
  return {
    title: paper.title,
    description: paper.abstract,
    openGraph: { title: paper.title, description: paper.abstract, type: "article" },
  };
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    datePublished: paper.iso,
    abstract: paper.abstract,
    keywords: paper.keywords.join(", "),
    author: { "@type": "Person", name: person.name, url: person.url },
    publisher: { "@type": "Organization", name: paper.venue },
  };

  return (
    <ReadingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackLink href="/#papers" label="publications" />

      <article className="mt-7">
        <header className="border-l-2 border-accent pl-5">
          <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
            {paper.venue} · <time dateTime={paper.iso}>{paper.date}</time>
          </p>
          <h1 className="mt-2 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
            {paper.title}
          </h1>
        </header>

        <section className="mt-8">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
            abstract
          </h2>
          <p className="mt-2.5 leading-relaxed text-text/75">{paper.abstract}</p>
        </section>

        <section className="mt-7">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
            my contribution
          </h2>
          <p className="mt-2.5 leading-relaxed text-text/75">{paper.contribution}</p>
        </section>

        <section className="mt-7">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
            keywords
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {paper.keywords.map((k) => (
              <li
                key={k}
                className="rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] text-text/70"
              >
                {k}
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label="Paper links" className="mt-10">
          <a
            href={person.ieee}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm border border-accent/50 px-4 py-2 font-mono text-[11px] tracking-wider text-accent uppercase transition-colors hover:bg-accent hover:text-bg"
          >
            ieee author profile ↗
          </a>
        </nav>
      </article>
    </ReadingLayout>
  );
}
