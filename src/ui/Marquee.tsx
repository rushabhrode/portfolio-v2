/**
 * An infinite horizontal ticker.
 *
 * The list is rendered twice inside a track that translates by exactly -50%,
 * which makes the wrap seamless without any JavaScript. Pausing on hover is a
 * CSS animation-play-state change — the whole component costs one compositor
 * animation and no main-thread work.
 */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div
      className="marquee relative overflow-hidden border-y border-line py-3"
      // Fade both edges so items enter and leave rather than being cut off.
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <ul className="marquee-track flex w-max gap-8" aria-hidden="true">
        {[...items, ...items].map((item, i) => (
          <li
            key={i}
            className="flex shrink-0 items-center gap-8 font-mono text-[11px] tracking-wider text-dim uppercase"
          >
            {item}
            <span className="text-accent/50">/</span>
          </li>
        ))}
      </ul>

      {/* The real, readable copy for assistive tech — the visual track is
          duplicated and would otherwise be announced twice. */}
      <span className="sr-only-keep">{items.join(", ")}</span>
    </div>
  );
}
