/**
 * Above-the-fold entrance animation.
 *
 * A server component on purpose. `Reveal` needs an IntersectionObserver, which
 * means it needs hydration, which means the hero would sit invisible for
 * however long the JavaScript takes to boot — the exact content a visitor
 * should see first. This is a pure CSS animation that begins when the element
 * is parsed, and degrades to plain visible content when the `data-js` flag is
 * absent.
 */
export function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`rise ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
