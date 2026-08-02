import Link from "next/link";
import {
  person,
  education,
  projects,
  featuredProjects,
  papers,
  roles,
  skills,
  posts,
  credentials,
  leadership,
} from "@/content/portfolio.data";
import { SectionHead } from "./Chrome";
import { Reveal } from "./Reveal";
import { Rise } from "./Rise";
import { Counter } from "./Counter";
import { Marquee } from "./Marquee";
import { HeroVisual, ProjectVisual } from "@/three/ProjectVisual";

export function StaticPortfolio() {
  return (
    <>
      <Hero />
      <Ticker />
      <Work />
      <Publications />
      <Experience />
      <Stack />
      <Writing />
      <Contact />
    </>
  );
}

function Hero() {
  return (
    <section className="grid min-h-[88vh] items-center gap-10 py-12 md:grid-cols-[1fr_420px] md:gap-14">
      <div>
        <Rise>
          <p className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
            <span aria-hidden className="pulse relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            open to work · graduating june 2026
          </p>
        </Rise>

        <Rise delay={80}>
          {/* Fluid down to a phone and up to a large desktop without a single
              breakpoint — the name should always be the biggest thing here. */}
          <h1
            className="mt-6 font-semibold tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.75rem, 10vw, 7rem)", lineHeight: 0.92 }}
          >
            Rushabh
            <br />
            <span className="text-dim">Rode</span>
          </h1>
        </Rise>

        <Rise delay={160}>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-text/70">
            {person.statement}
          </p>
        </Rise>

        <Rise delay={240}>
          <dl className="mt-9 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            <Stat label="model accuracy">
              <Counter value={95} suffix="%" />
            </Stat>
            <Stat label="published 2025">IEEE</Stat>
            <Stat label="cgpa">
              <Counter value={8.69} decimals={2} />
            </Stat>
            <Stat label="graduating">2026</Stat>
          </dl>
        </Rise>

        <Rise delay={320}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${person.email}`}
              className="group relative overflow-hidden rounded-sm bg-accent px-5 py-3 font-mono text-[11px] tracking-wider text-bg uppercase"
            >
              <span className="relative z-10">get in touch →</span>
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-white/30 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </a>
            <a
              href={person.resume}
              className="rounded-sm border border-line px-5 py-3 font-mono text-[11px] tracking-wider text-text uppercase transition-colors hover:border-accent/60 hover:text-accent"
            >
              résumé ↓
            </a>
          </div>
        </Rise>
      </div>

      {/* The eye. A soft glow sits behind it so it reads as lit rather than
          pasted onto the page. */}
      <Rise delay={200} className="relative mx-auto w-full max-w-[420px] md:mx-0">
        <div
          aria-hidden
          className="absolute inset-6 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, #c6ff4a2e, transparent 70%)" }}
        />
        <HeroVisual className="relative aspect-square w-full" />
      </Rise>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-panel p-4">
      <dt className="sr-only-keep">{label}</dt>
      <dd>
        <span className="block font-mono text-2xl text-accent sm:text-3xl">
          {children}
        </span>
        <span className="mt-1.5 block font-mono text-[10px] tracking-wider text-dim uppercase">
          {label}
        </span>
      </dd>
    </div>
  );
}

function Ticker() {
  const items = skills.flatMap((g) => g.items);
  return (
    <div className="-mx-5 sm:-mx-6">
      <Marquee items={items} />
    </div>
  );
}

function Work() {
  const others = projects.filter((p) => !p.featured);

  return (
    <section className="py-16">
      <Reveal>
        <SectionHead n="01" title="work" id="work" />
      </Reveal>

      <div className="mt-7 grid gap-px bg-line sm:grid-cols-2">
        {featuredProjects.map((project, i) => (
          <Reveal as="article" key={project.slug} delay={i * 70} className="flex">
            <div className="card flex w-full flex-col bg-panel p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="font-mono text-[11px] text-accent">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <h3 className="mt-2 text-lg font-medium sm:text-xl">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {project.title}
                    </Link>
                  </h3>
                </div>
                <ProjectVisual
                  slug={project.slug}
                  className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
                />
              </div>

              <p className="mt-3 leading-relaxed text-text/60">{project.tagline}</p>

              <dl className="mt-5 space-y-1.5 border-t border-line pt-4">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex justify-between gap-4 font-mono text-[11px]"
                  >
                    <dt className="text-dim">{m.label.toLowerCase()}</dt>
                    <dd className="text-right text-accent">{m.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 font-mono text-[10px] leading-relaxed text-dim">
                {project.stack.join(" · ")}
              </p>

              <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-[11px] tracking-wider uppercase">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group text-accent"
                >
                  case study
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                {project.links
                  .filter((l) => !l.pending)
                  .map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dim transition-colors hover:text-text"
                    >
                      {l.label.toLowerCase()} ↗
                    </a>
                  ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {others.length > 0 && (
        <Reveal>
          <p className="mt-10 font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
            also built
          </p>
          <ul className="mt-3 grid gap-px bg-line sm:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug} className="bg-panel">
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-panel-hi"
                >
                  <span>
                    <span className="font-medium transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-dim">
                      {p.stack.slice(0, 3).join(" · ")}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-dim transition-transform group-hover:translate-x-1 group-hover:text-accent"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </section>
  );
}

function Publications() {
  return (
    <section className="py-16">
      <Reveal>
        <SectionHead n="02" title="publications" id="papers" />
      </Reveal>

      <div className="mt-7 space-y-5">
        {papers.map((paper, i) => (
          <Reveal as="article" key={paper.slug} delay={i * 70}>
            <div className="card border-l-2 border-accent bg-panel p-5 sm:p-6">
              <p className="font-mono text-[11px] tracking-wider text-accent uppercase">
                {paper.venue} · <time dateTime={paper.iso}>{paper.date}</time>
              </p>
              <h3 className="mt-2 text-lg font-medium sm:text-xl">
                <Link
                  href={`/papers/${paper.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {paper.title}
                </Link>
              </h3>
              <p className="mt-2.5 max-w-3xl leading-relaxed text-text/60">
                {paper.abstract}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 font-mono text-[11px] tracking-wider uppercase">
                <Link href={`/papers/${paper.slug}`} className="text-accent">
                  read more →
                </Link>
                <a
                  href={person.ieee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dim transition-colors hover:text-text"
                >
                  ieee author profile ↗
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="py-16">
      <Reveal>
        <SectionHead n="03" title="experience" />
      </Reveal>

      <div className="mt-7 space-y-px bg-line">
        {roles.map((role) => (
          <Reveal as="article" key={role.slug}>
            <div className="card bg-panel p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium sm:text-xl">{role.title}</h3>
                <span className="font-mono text-[11px] text-dim">
                  {role.period} · {role.location}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-accent">{role.org}</p>
              <ul className="mt-4 space-y-2">
                {role.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-text/70">
                    <span aria-hidden className="text-accent">
                      ›
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}

        <Reveal>
          <div className="card bg-panel p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-medium sm:text-xl">{education.degree}</h3>
              <span className="font-mono text-[11px] text-dim">{education.period}</span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-accent">
              {education.institution}
            </p>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-dim">
              CGPA {education.cgpa} · {education.coursework.join(" · ")}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px bg-line sm:grid-cols-2">
          <Reveal>
            <div className="card h-full bg-panel p-5 sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
                certifications
              </p>
              <ul className="mt-3.5 space-y-2">
                {credentials.map((c) => (
                  <li key={c.name} className="text-text/75">
                    {c.name}
                    <span className="font-mono text-[11px] text-dim"> · {c.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={70}>
            <div className="card h-full bg-panel p-5 sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
                leadership
              </p>
              <ul className="mt-3.5 space-y-3.5">
                {leadership.map((l) => (
                  <li key={l.title + l.org}>
                    <p className="text-text/85">
                      {l.title}
                      <span className="font-mono text-[11px] text-dim"> · {l.org}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text/55">
                      {l.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section className="py-16">
      <Reveal>
        <SectionHead n="04" title="stack" />
      </Reveal>
      <div className="mt-7 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.group} delay={i * 50}>
            <div className="card h-full bg-panel p-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
                {group.group}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-text/70">
                {group.items.join(", ")}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section className="py-16">
      <Reveal>
        <SectionHead n="05" title="writing" />
      </Reveal>
      <ul className="mt-7 divide-y divide-line border-y border-line">
        {posts.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={i * 50}>
            <Link href={`/blog/${post.slug}`} className="group block py-5">
              <div className="flex flex-wrap items-baseline gap-x-4">
                <time dateTime={post.iso} className="font-mono text-[11px] text-dim">
                  {post.date}
                </time>
                <h3 className="font-medium transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
              </div>
              <p className="mt-1.5 max-w-3xl leading-relaxed text-text/55">
                {post.summary}
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  return (
    <section className="py-20">
      <Reveal>
        <div className="relative overflow-hidden border border-line bg-panel p-8 sm:p-12">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, #c6ff4a30, transparent 70%)" }}
          />
          <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
            {"// "}
            available june 2026
          </p>
          <h2
            className="relative mt-4 font-semibold tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: 1.05 }}
          >
            Let&rsquo;s build something.
          </h2>
          <p className="relative mt-4 max-w-lg leading-relaxed text-text/65">
            {person.availability} The fastest way to reach me is email — I reply to
            everything.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${person.email}`}
              className="rounded-sm bg-accent px-5 py-3 font-mono text-[11px] tracking-wider text-bg uppercase transition-opacity hover:opacity-90"
            >
              {person.email}
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-line px-5 py-3 font-mono text-[11px] tracking-wider text-text uppercase transition-colors hover:border-accent/60 hover:text-accent"
            >
              linkedin ↗
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
