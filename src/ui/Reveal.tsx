"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals its children once, when they first scroll into view.
 *
 * The animation itself is pure CSS — this only toggles a class. That keeps the
 * work on the compositor and means the page still renders correctly if this
 * component never hydrates: `.reveal` starts hidden, but anyone with JS
 * disabled or reduced motion enabled gets the `prefers-reduced-motion`
 * override in the stylesheet, which forces it visible.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at load should not animate in late.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
