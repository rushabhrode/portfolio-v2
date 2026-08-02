"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Object3D, type Group, type InstancedMesh } from "three";
import { Lighting } from "../Lighting";

/**
 * Teams Data Platform.
 *
 * Three plates — Bronze, Silver, Gold — with records descending through them.
 * A particle changes colour as it passes each layer, and a few are rejected
 * sideways at the Silver boundary rather than continuing: that is the
 * quarantine path, and it is the part of the pipeline the project actually
 * argues for. A clean funnel would misrepresent the work.
 *
 * The layer colours are the one deliberate departure from the site's single
 * accent. "Medallion" means bronze/silver/gold, and muting them into the
 * palette keeps the reference legible while the payoff layer stays accent lime.
 */
const LAYERS = [
  { y: 0.95, color: "#7a5c3a", scale: 1.0 }, // bronze — faithful copy
  { y: 0.0, color: "#8b93a1", scale: 0.86 }, // silver — typed, deduplicated
  { y: -0.95, color: "#c6ff4a", scale: 0.72 }, // gold — business marts
];

const COUNT = 34;
/** Roughly mirrors the pipeline's real hard-reject rate — a small minority. */
const QUARANTINE_EVERY = 9;

const dummy = new Object3D();
const tint = new Color();

const BRONZE = new Color("#7a5c3a");
const SILVER = new Color("#8b93a1");
const GOLD = new Color("#c6ff4a");

export function MedallionPipeline() {
  const group = useRef<Group>(null);
  const records = useRef<InstancedMesh>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        phase: (i * 0.137) % 1,
        x: (((i * 0.37) % 1) - 0.5) * 1.05,
        z: (((i * 0.71) % 1) - 0.5) * 1.05,
        quarantined: i % QUARANTINE_EVERY === 0,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.24) * 0.42 + 0.35;
      group.current.rotation.x = 0.28 + Math.sin(t * 0.19) * 0.05;
    }

    if (!records.current) return;

    seeds.forEach((s, i) => {
      const p = (t * 0.26 + s.phase) % 1;
      // Travel from above Bronze to below Gold.
      const y = 1.5 - p * 3.0;

      if (s.quarantined && p > 0.5) {
        // Rejected at the Silver boundary: pushed out sideways and fading,
        // rather than quietly continuing into Gold.
        const escape = (p - 0.5) / 0.5;
        dummy.position.set(
          s.x + escape * 1.5,
          -0.05 - escape * 0.35,
          s.z + escape * 0.6,
        );
        dummy.scale.setScalar(0.05 * (1 - escape));
        tint.copy(SILVER);
      } else {
        dummy.position.set(s.x, y, s.z);
        dummy.scale.setScalar(0.055);
        // Colour follows the layer the record has reached.
        if (p < 0.34) tint.copy(BRONZE);
        else if (p < 0.66) tint.copy(SILVER);
        else tint.copy(GOLD);
      }

      dummy.updateMatrix();
      records.current!.setMatrixAt(i, dummy.matrix);
      records.current!.setColorAt(i, tint);
    });

    records.current.instanceMatrix.needsUpdate = true;
    if (records.current.instanceColor) {
      records.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <Lighting />
      <group ref={group}>
        {LAYERS.map((layer) => (
          <group key={layer.y} position={[0, layer.y, 0]}>
            <mesh>
              <boxGeometry args={[1.9 * layer.scale, 0.05, 1.9 * layer.scale]} />
              <meshStandardMaterial
                color={layer.color}
                transparent
                opacity={0.22}
                roughness={0.35}
                metalness={0.4}
              />
            </mesh>
            {/* Outline — a translucent slab with no edge reads as haze. */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[1.9 * layer.scale * 0.705, 1.9 * layer.scale * 0.72, 4]}
              />
              <meshBasicMaterial
                color={layer.color}
                transparent
                opacity={0.75}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        <instancedMesh ref={records} args={[undefined, undefined, COUNT]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
    </>
  );
}
