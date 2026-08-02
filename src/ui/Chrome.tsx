import Link from "next/link";
import { person } from "@/content/portfolio.data";
import { Backdrop } from "./Backdrop";

/**
 * Persistent chrome.
 *
 * Résumé, GitHub, LinkedIn, and email are reachable in one click from every
 * page. That is a hard constraint, not a layout preference — a portfolio has
 * about ninety seconds of a reader's attention and it should never spend any of
 * it on navigation.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs tracking-wider text-text uppercase transition-colors hover:text-accent"
        >
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent" />
          rushabh_rode
        </Link>

        <ul className="flex items-center gap-1 font-mono text-[11px] tracking-wider uppercase sm:gap-4">
          <li className="hidden sm:block">
            <a href="#work" className="px-2 py-1 text-dim transition-colors hover:text-text">
              work
            </a>
          </li>
          <li className="hidden sm:block">
            <a href="#papers" className="px-2 py-1 text-dim transition-colors hover:text-text">
              papers
            </a>
          </li>
          <li>
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-dim transition-colors hover:text-text"
            >
              github
            </a>
          </li>
          <li>
            <a
              href={person.resume}
              className="rounded-sm border border-accent/50 px-3 py-1.5 text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              résumé ↓
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <a
            href={`mailto:${person.email}`}
            className="font-mono text-lg text-accent transition-opacity hover:opacity-80"
          >
            {person.email}
          </a>
          <p className="mt-2 font-mono text-[11px] text-dim">
            {person.location} · {person.availability}
          </p>
        </div>
        <ul className="flex flex-wrap gap-4 font-mono text-[11px] tracking-wider uppercase">
          {[
            { label: "github", href: person.github },
            { label: "linkedin", href: person.linkedin },
            { label: "ieee", href: person.ieee },
            { label: "résumé", href: person.resume },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-dim transition-colors hover:text-accent"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Same depth layers as the home page — without them the reading routes
          look like a different site. */}
      <Backdrop />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-6">{children}</main>
      <SiteFooter />
    </>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-dim uppercase transition-colors hover:text-accent"
    >
      <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
        ←
      </span>
      {label}
    </Link>
  );
}

/** Numbered section rule. The index is the only decoration on the page. */
export function SectionHead({
  n,
  title,
  id,
}: {
  n: string;
  title: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="flex scroll-mt-20 items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase"
    >
      <span className="text-accent">{n}</span>
      <span className="text-dim">{title}</span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </h2>
  );
}
