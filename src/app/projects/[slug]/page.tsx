import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingLayout, BackLink } from "@/ui/Chrome";
import { ProjectVisual } from "@/three/ProjectVisual";
import { projects, getProject, person } from "@/content/portfolio.data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — ${person.name}`,
      description: project.tagline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <ReadingLayout>
      <BackLink href="/#work" label="work" />

      <article className="mt-7">
        <header className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
              {project.year} · {project.role}
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-text/70">
              {project.tagline}
            </p>
            {/* Stated up front rather than buried. Where work started from
                someone else's scaffold, saying so is what makes the rest of
                the page credible. */}
            {project.attribution && (
              <p className="mt-4 max-w-xl border-l border-line pl-3 text-[13px] leading-relaxed text-dim">
                {project.attribution}
              </p>
            )}
          </div>
          <ProjectVisual slug={project.slug} className="h-24 w-24 sm:h-28 sm:w-28" />
        </header>

        <dl className="mt-8 grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="bg-panel px-4 py-3.5">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
                {m.label}
              </dt>
              <dd className="mt-1 font-mono text-lg text-accent">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 space-y-8">
          <Section title="the problem" body={project.problem} />
          <Section title="the approach" body={project.approach} />
          <Section title="the result" body={project.result} />
        </div>

        <section className="mt-10">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
            stack
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] text-text/70"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label="Project links" className="mt-10 flex flex-wrap gap-3">
          {project.links.map((l) =>
            l.pending ? (
              <span
                key={l.label}
                title="Link pending"
                className="cursor-not-allowed rounded-sm border border-line px-4 py-2 font-mono text-[11px] tracking-wider text-dim/60 uppercase"
              >
                {l.label} — soon
              </span>
            ) : (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-accent/50 px-4 py-2 font-mono text-[11px] tracking-wider text-accent uppercase transition-colors hover:bg-accent hover:text-bg"
              >
                {l.label} ↗
              </a>
            ),
          )}
        </nav>
      </article>
    </ReadingLayout>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
        {title}
      </h2>
      <p className="mt-2.5 leading-relaxed text-text/75">{body}</p>
    </section>
  );
}
