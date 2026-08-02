"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group, type InstancedMesh, Object3D } from "three";
import { Lighting } from "../Lighting";

/**
 * Two-Tower RAG Pipeline.
 *
 * Two encoders, one on each side, projecting into a shared embedding space in
 * the middle. Particles leave both towers and converge on the same point —
 * which is precisely what the architecture does, and why retrieval stops
 * costing more as the corpus grows.
 */
const COUNT = 44;
const dummy = new Object3D();

export function TwinTowers() {
  const group = useRef<Group>(null);
  const particles = useRef<InstancedMesh>(null);

  // Each particle carries a side, a phase, and a vertical offset so the two
  // streams interleave instead of pulsing in lockstep.
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        side: i % 2 === 0 ? -1 : 1,
        phase: (i * 0.137) % 1,
        y: ((i * 0.311) % 1) * 1.6 - 0.8,
      })),
    [],
  );

  const from = useMemo(() => new Vector3(), []);
  const to = useMemo(() => new Vector3(0, 0, 0), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      // Oscillate rather than rotate. A full turn passes through an edge-on
      // angle where the two towers line up and the object collapses into a
      // single bar — which is the one reading that destroys the whole idea.
      group.current.rotation.y = Math.sin(t * 0.3) * 0.5;
      group.current.rotation.x = Math.sin(t * 0.21) * 0.1;
    }
    if (!particles.current) return;

    seeds.forEach((s, i) => {
      // 0..1 travel from tower to the shared space, wrapping.
      const p = (t * 0.35 + s.phase) % 1;
      from.set(s.side * 1.15, s.y, 0);
      dummy.position.lerpVectors(from, to, p);
      // Converge in Y as well, so the streams funnel rather than slide.
      dummy.position.y = s.y * (1 - p);
      const scale = 0.045 * (1 - p * 0.55);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      particles.current!.setMatrixAt(i, dummy.matrix);
    });
    particles.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <Lighting />
      <group ref={group}>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 1.15, 0, 0]}>
            <boxGeometry args={[0.34, 2.0, 0.34]} />
            <meshStandardMaterial
              color="#1b2027"
              roughness={0.45}
              metalness={0.25}
            />
          </mesh>
        ))}

        {/* The shared embedding space. */}
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color="#c6ff4a"
            emissive="#c6ff4a"
            emissiveIntensity={1.2}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>

        <instancedMesh ref={particles} args={[undefined, undefined, COUNT]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#c6ff4a" toneMapped={false} />
        </instancedMesh>
      </group>
    </>
  );
}
