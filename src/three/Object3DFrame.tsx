"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import {
  getCapability,
  serverCapability,
  subscribeNever,
} from "@/systems/capability";
import { FrameDriver } from "@/systems/FrameDriver";

/**
 * Hosts one small 3D object.
 *
 * The performance rules for this site live here, in one place:
 *
 *   - Nothing mounts until it scrolls into view, so a visitor who never
 *     reaches a project never pays for its object.
 *   - Once revealed the canvas stays mounted (remounting a WebGL context is
 *     far more expensive than keeping an idle one) but stops rendering the
 *     moment it leaves the viewport.
 *   - No post-processing, no shadow maps, DPR capped at 1.5.
 *   - Software renderers get the static fallback instead. So does anyone the
 *     browser reports as preferring reduced motion, since these objects exist
 *     to move.
 *
 * That last point matters: the fallback is not an error state. It is a
 * deliberate, designed panel, and most of these objects are decorative — the
 * page reads completely without any of them.
 */
export function Object3DFrame({
  children,
  fallback,
  className = "",
  /** Distance from the viewport at which to start loading. */
  rootMargin = "200px",
  camera = { position: [0, 0, 4] as [number, number, number], fov: 45 },
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
  className?: string;
  rootMargin?: string;
  camera?: { position: [number, number, number]; fov: number };
}) {
  const capability = useSyncExternalStore(
    subscribeNever,
    getCapability,
    serverCapability,
  );

  const hostRef = useRef<HTMLDivElement>(null);
  // `revealed` latches on first intersection; `inView` tracks live visibility
  // and gates the render loop.
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !capability.can3d) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [capability.can3d, rootMargin]);

  const show3d = capability.can3d && !capability.reducedMotion && revealed;

  return (
    <div ref={hostRef} className={className}>
      {show3d ? (
        <Canvas
          // See FrameDriver for why the built-in loop cannot be used.
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={camera}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <FrameDriver active={inView} />
          {children}
        </Canvas>
      ) : (
        fallback
      )}
    </div>
  );
}
