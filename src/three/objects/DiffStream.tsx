"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { Lighting } from "../Lighting";

/**
 * Code Review Assistant.
 *
 * A stream of diff hunks scrolling upward, most of them ignored and a few
 * flagged. That ratio is the whole point of the project: a reviewer that
 * comments on everything gets muted, so the tool's value is in how much it
 * stays silent about.
 */
const ROWS = 14;
/** Indices that get flagged. Deliberately sparse. */
const FLAGGED = new Set([3, 9]);

export function DiffStream() {
  const group = useRef<Group>(null);
  const rows = useRef<(Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.25) * 0.16;
    }

    // Rows travel upward and wrap, so the stream never ends.
    for (const row of rows.current) {
      if (!row) continue;
      row.position.y += delta * 0.42;
      if (row.position.y > 1.9) row.position.y -= 3.8;
    }
  });

  return (
    <>
      <Lighting />
      <group ref={group} rotation={[0, -0.5, 0]}>
        {Array.from({ length: ROWS }).map((_, i) => {
          const flagged = FLAGGED.has(i);
          // Varied widths so it reads as code rather than as a bar chart.
          const width = 0.55 + ((i * 37) % 11) / 11 * 1.15;
          return (
            <mesh
              key={i}
              ref={(el) => {
                rows.current[i] = el;
              }}
              position={[width / 2 - 0.9, -1.9 + i * 0.27, flagged ? 0.12 : 0]}
            >
              <boxGeometry args={[width, 0.1, 0.1]} />
              <meshStandardMaterial
                color={flagged ? "#c6ff4a" : "#2b323b"}
                emissive={flagged ? "#c6ff4a" : "#000000"}
                emissiveIntensity={flagged ? 1.1 : 0}
                roughness={0.5}
                metalness={0.1}
                toneMapped={!flagged}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
