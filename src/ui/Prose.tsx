import type { Block } from "@/content/portfolio.data";

/**
 * Renders structured post content.
 *
 * Deliberately not MDX — four posts do not justify a markdown toolchain, and
 * typed blocks cannot produce invalid markup.
 */
export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.t) {
          case "h":
            return (
              <h2 key={i} className="pt-5 text-xl font-medium tracking-tight">
                {block.text}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="leading-relaxed text-text/75">
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-text/75">
                    <span aria-hidden className="text-accent">
                      ›
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-accent py-1 pl-5 text-lg leading-snug text-text/90"
              >
                {block.text}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
