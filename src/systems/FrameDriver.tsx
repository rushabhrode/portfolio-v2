"use client";

import { useEffect } from "react";
import { advance, useStore } from "@react-three/fiber";

/**
 * Drives one canvas's render loop.
 *
 * Two jobs. First, R3F's built-in scheduler does not run in this stack
 * (Next 16 / Turbopack / React 19.2): the canvas mounts and the scene graph
 * builds correctly, but the internal loop executes a single frame and then
 * stops without ever issuing a draw call. Verified by isolation — plain
 * three.js in the same app renders at full rate — so the canvas runs with
 * frameloop="demand" and this component owns a plain rAF loop instead.
 *
 * Second, it renders only while the object is on screen. `advance()` without a
 * state argument advances *every* mounted root, so with several objects on the
 * page one visible canvas would render all of them. Passing this root's own
 * state keeps each canvas paying only for itself.
 */
export function FrameDriver({ active = true }: { active?: boolean }) {
  const store = useStore();

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      advance(performance.now(), true, store.getState());
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, store]);

  return null;
}
