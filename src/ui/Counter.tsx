"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a number the first time it scrolls into view.
 *
 * Renders the final value on the server, so the correct figure is in the HTML
 * for crawlers and for anyone without JavaScript. The animation only ever
 * replaces a value that is already correct.
 */
export function Counter({
  value,
  suffix = "",
  decimals = 0,
  duration = 1100,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Held at effect scope so unmounting mid-count actually cancels the loop.
    // Returning a cleanup from inside the observer callback does nothing.
    let raf = 0;
    let safety: number | undefined;
    // Once the final value is committed, nothing may overwrite it. Cancelling
    // the pending frame is not enough on its own: a throttled tick can already
    // be in flight and will happily write a stale intermediate value back.
    let settled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();

        const tick = (now: number) => {
          if (settled) return;
          // Clamped at both ends. requestAnimationFrame passes the timestamp of
          // the frame's *start*, which can predate the `start` captured above —
          // that made progress briefly negative and rendered "-0".
          const t = Math.min(Math.max((now - start) / duration, 0), 1);
          // Ease-out cubic: fast first, settling. A linear count reads as a
          // loading spinner rather than a result landing.
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(value * eased);
          if (t < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            settled = true;
            setDisplay(value);
          }
        };

        setDisplay(0);
        raf = requestAnimationFrame(tick);

        // Guarantee the true value regardless of what happens to the animation.
        // Browsers throttle requestAnimationFrame in backgrounded or occluded
        // tabs, and a stalled counter would sit at 0 — displaying "0% model
        // accuracy" instead of 95%. A decorative animation must never be able
        // to show a wrong number.
        safety = window.setTimeout(() => {
          settled = true;
          cancelAnimationFrame(raf);
          setDisplay(value);
        }, duration + 400);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
