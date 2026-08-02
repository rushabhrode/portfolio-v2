"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";
import { Lighting } from "../Lighting";

/**
 * Autism Detection via Eye Tracking.
 *
 * A scanpath: fixations as spheres sized by dwell duration, joined by the
 * saccades between them. This is the actual figure the research produces, drawn
 * live rather than screenshotted — the object *is* the method.
 *
 * Points are hard-coded rather than random so the shape is deterministic, and
 * so it reads as a face-scanning pattern (clustered around two upper points and
 * one lower — eyes and mouth) rather than as noise.
 */
const FIXATIONS: { p: [number, number, number]; dwell: number }[] = [
  { p: [-0.62, 0.55, 0.1], dwell: 1.0 },
  { p: [0.58, 0.6, -0.05], dwell: 0.85 },
  { p: [-0.5, 0.42, 0.25], dwell: 0.5 },
  { p: [0.12, 0.05, 0.15], dwell: 0.42 },
  { p: [0.66, 0.44, 0.2], dwell: 0.62 },
  { p: [-0.08, -0.52, -0.1], dwell: 0.78 },
  { p: [-0.72, 0.18, -0.2], dwell: 0.34 },
  { p: [0.34, -0.68, 0.05], dwell: 0.46 },
  { p: [0.02, 0.72, -0.15], dwell: 0.38 },
  { p: [-0.3, -0.2, 0.3], dwell: 0.3 },
];

export function Scanpath() {
  const group = useRef<Group>(null);

  const path = useMemo(
    () => FIXATIONS.map((f) => f.p as [number, number, number]),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.22;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <>
      <Lighting />
      <group ref={group} scale={1.25}>
        {/* Saccades — the jumps between fixations. */}
        <Line points={path} color="#c6ff4a" lineWidth={1.2} transparent opacity={0.55} />

        {FIXATIONS.map((f, i) => (
          <mesh key={i} position={f.p}>
            {/* Radius proportional to dwell, the convention in eye-tracking
                literature. */}
            <sphereGeometry args={[0.07 + f.dwell * 0.11, 20, 20]} />
            <meshStandardMaterial
              color="#c6ff4a"
              emissive="#c6ff4a"
              emissiveIntensity={0.4 + f.dwell * 0.8}
              roughness={0.35}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
