/**
 * The page's depth layers.
 *
 * Three fixed, non-interactive layers behind everything: a fading blueprint
 * grid, two slow accent glows, and a grain overlay. All three are painted once
 * and composited — there is no per-frame JavaScript here at all, which is the
 * point. Most of what makes a dark site look expensive is depth, and depth is
 * much cheaper than motion.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />

      <div
        className="glow absolute -top-[20%] -right-[10%] h-[60vh] w-[60vh] rounded-full"
        style={{ background: "radial-gradient(circle, #c6ff4a26, transparent 65%)" }}
      />
      <div
        className="glow absolute top-[45%] -left-[15%] h-[55vh] w-[55vh] rounded-full"
        style={{
          background: "radial-gradient(circle, #4ab8ff1a, transparent 65%)",
          animationDelay: "-11s",
        }}
      />

      <div className="bg-noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
