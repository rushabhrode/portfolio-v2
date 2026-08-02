import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/ui/Chrome";
import { Backdrop } from "@/ui/Backdrop";
import { featuredProjects } from "@/content/portfolio.data";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <>
      <Backdrop />
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-16 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
          {"// "}
          error 404
        </p>
        <h1
          className="mt-4 font-semibold tracking-tight"
          style={{ fontSize: "clamp(2.25rem, 8vw, 4.5rem)", lineHeight: 1 }}
        >
          No route here.
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-text/65">
          That address does not resolve. Nothing is broken — the page simply
          doesn&rsquo;t exist.
        </p>

        {/* A dead end should still offer somewhere worth going. */}
        <div className="mt-10">
          <p className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
            try instead
          </p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            <li>
              <Link
                href="/"
                className="group flex items-center justify-between gap-4 py-3.5"
              >
                <span className="transition-colors group-hover:text-accent">
                  Home
                </span>
                <span
                  aria-hidden
                  className="font-mono text-dim transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
            {featuredProjects.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex items-center justify-between gap-4 py-3.5"
                >
                  <span className="transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-dim transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
