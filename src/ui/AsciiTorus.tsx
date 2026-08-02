"use client";

import { useEffect, useRef } from "react";

/**
 * A rotating torus, rendered as text.
 *
 * This is the donut — the shading demo every engineer has seen, computed here
 * rather than faked: for each frame the surface is sampled, transformed,
 * projected, depth-buffered, and mapped to a character by how much light hits
 * it. It fits a site typeset in monospace, it needs no WebGL and no assets, and
 * it costs one string assignment per frame.
 *
 * The cursor tilts it. Nothing else in the hero moves, so the interaction is
 * unmistakable when it happens.
 */

/** Dim to bright. The ramp *is* the lighting model. */
const RAMP = ".,-~:;=!*#$@";

const COLS = 74;
const ROWS = 32;

/** Torus radii and viewer distance, tuned so the shape fills the grid. */
const R1 = 1;
const R2 = 2;
const K2 = 5;
/** Projection scale, derived so the torus spans the grid width. */
const K1 = (COLS * K2 * 3) / (8 * (R1 + R2));

/** ~24fps. Smooth enough to read as motion, a third of the work of 60. */
const FRAME_MS = 42;

function render(a: number, b: number): string {
  const output = new Array(COLS * ROWS).fill(" ");
  const zBuffer = new Float32Array(COLS * ROWS);

  const cosA = Math.cos(a);
  const sinA = Math.sin(a);
  const cosB = Math.cos(b);
  const sinB = Math.sin(b);

  // theta sweeps the tube's cross-section, phi sweeps it around the ring.
  for (let theta = 0; theta < Math.PI * 2; theta += 0.09) {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    for (let phi = 0; phi < Math.PI * 2; phi += 0.025) {
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);

      const circleX = R2 + R1 * cosT;
      const circleY = R1 * sinT;

      const x =
        circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB;
      const y =
        circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB;
      const z = K2 + cosA * circleX * sinP + circleY * sinA;
      const ooz = 1 / z;

      const xp = Math.floor(COLS / 2 + K1 * ooz * x);
      const yp = Math.floor(ROWS / 2 - (K1 * ooz * y) / 2);
      if (xp < 0 || xp >= COLS || yp < 0 || yp >= ROWS) continue;

      // Luminance: surface normal against a light behind the viewer.
      const lum =
        cosP * cosT * sinB -
        cosA * cosT * sinP -
        sinA * sinT +
        cosB * (cosA * sinT - cosT * sinA * sinP);

      const idx = xp + COLS * yp;
      // Depth test. Without it the far wall of the torus paints over the near
      // one and the shape reads inside out.
      if (ooz > zBuffer[idx]) {
        zBuffer[idx] = ooz;
        const rampIndex = Math.max(0, Math.floor(lum * 8));
        output[idx] = RAMP[Math.min(rampIndex, RAMP.length - 1)];
      }
    }
  }

  let out = "";
  for (let row = 0; row < ROWS; row++) {
    out += output.slice(row * COLS, (row + 1) * COLS).join("") + "\n";
  }
  return out;
}

export function AsciiTorus({ className = "" }: { className?: string }) {
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = pre.current;
    if (!el) return;

    // Paint one frame immediately, before any animation is scheduled. A browser
    // that throttles requestAnimationFrame — a background tab, a low-power
    // device — would otherwise leave an empty <pre> and a blank hero. The shape
    // should exist even if it never turns.
    // A three-quarter view. Near zero the torus is almost edge-on and reads as
    // a flat band, which is a poor still for anyone who never sees it turn.
    const START_A = 1.05;
    const START_B = 0.35;
    el.textContent = render(START_A, START_B);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Continue from the frame already on screen rather than snapping back.
    let a = START_A;
    let b = START_B;
    let tiltX = 0;
    let tiltY = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;
    let last = 0;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.6;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.6;
    };

    // Stop computing entirely when scrolled away. The work is cheap, but it is
    // not free, and nothing should burn a phone battery off screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(el);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || now - last < FRAME_MS) return;
      last = now;

      tiltX += (targetX - tiltX) * 0.06;
      tiltY += (targetY - tiltY) * 0.06;

      a += 0.035;
      b += 0.018;
      el.textContent = render(a + tiltY, b + tiltX);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    // Container query unit rather than a viewport unit. The grid is a fixed
    // COLS characters wide, so the type size has to derive from the column it
    // sits in — sized against the viewport it overflowed its own container at
    // wide window sizes and the torus was clipped.
    // A monospace glyph is ~0.6em, so COLS * 0.6em must equal 100cqw.
    <div className={className} style={{ containerType: "inline-size" }}>
      <pre
        ref={pre}
        aria-hidden="true"
        className="pointer-events-none m-0 font-mono leading-[0.95] whitespace-pre text-accent select-none"
        style={{
          fontSize: `${100 / (COLS * 0.6)}cqw`,
          // Fades the outer characters so the shape sits in the page rather
          // than ending at a hard rectangular edge.
          maskImage:
            "radial-gradient(ellipse 72% 72% at 50% 50%, #000 55%, transparent 100%)",
          textShadow: "0 0 12px rgba(198, 255, 74, 0.35)",
        }}
      />
    </div>
  );
}
