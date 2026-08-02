"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { Lighting } from "../Lighting";

/**
 * The hero object — an eye that watches your cursor.
 *
 * It earns its place by being about him: the published research detects autism
 * from gaze behaviour, so the one thing the site does before you read a word is
 * look back at you. A generic spinning shape would be decoration; this is the
 * argument of the portfolio in one object.
 */
export function IrisCore() {
  const eye = useRef<Group>(null);
  const iris = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!eye.current) return;

    // Damped rather than snapped: an eye that tracks instantly reads as a
    // mechanism, one with a little lag reads as attention.
    // Kept under ~20°. A wider range technically tracks the cursor more
    // accurately but reads as cross-eyed, because a real eye moves far less
    // than the thing it is following.
    eye.current.rotation.y = MathUtils.damp(
      eye.current.rotation.y,
      target.current.x * 0.34,
      4,
      delta,
    );
    eye.current.rotation.x = MathUtils.damp(
      eye.current.rotation.x,
      -target.current.y * 0.26,
      4,
      delta,
    );

    // The pupil dilates slowly and continuously, so the object is never
    // completely static even when the cursor is still.
    if (iris.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.045;
      iris.current.scale.setScalar(s);
    }
  });

  return (
    <>
      <Lighting />
      <group ref={eye}>
        {/* Sclera — matte, near-black, so the iris is the only bright thing. */}
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          {/* Rough enough that the key light gives a broad sheen rather than a
              hard white blob — a glossy sphere reads as plastic. */}
          <meshStandardMaterial color="#0d1014" roughness={0.62} metalness={0.1} />
        </mesh>

        {/* Iris, sitting proud of the sphere surface.
            The sphere has radius 1.35, so anything at z=1.16 with a radial
            offset under ~0.7 is geometrically *inside* it and invisible. At
            z=1.30 the whole assembly clears the surface. */}
        <group position={[0, 0, 1.3]}>
          <group ref={iris}>
            {/* The coloured iris body. Without this the ring alone reads as a
                glowing donut rather than an eye. */}
            <mesh position={[0, 0, -0.01]}>
              <circleGeometry args={[0.47, 64]} />
              <meshStandardMaterial
                color="#6f9130"
                emissive="#c6ff4a"
                emissiveIntensity={0.22}
                roughness={0.45}
              />
            </mesh>

            {/* Limbal ring — the dark rim around a real iris. */}
            <mesh>
              <torusGeometry args={[0.46, 0.035, 20, 72]} />
              <meshStandardMaterial
                color="#c6ff4a"
                emissive="#c6ff4a"
                emissiveIntensity={0.85}
                roughness={0.35}
                toneMapped={false}
              />
            </mesh>
          </group>

          {/* Pupil — unlit black, reads as a hole rather than a surface. */}
          <mesh position={[0, 0, 0.015]}>
            <circleGeometry args={[0.2, 48]} />
            <meshBasicMaterial color="#05070a" toneMapped={false} />
          </mesh>

          {/* Catchlight. One small highlight is what makes an eye look alive
              rather than rendered. */}
          <mesh position={[-0.16, 0.16, 0.03]}>
            <circleGeometry args={[0.055, 24]} />
            <meshBasicMaterial color="#eaf6d8" toneMapped={false} transparent opacity={0.9} />
          </mesh>

          {/* Radial fibres. Twelve is enough to suggest an iris; more reads as
              a gear. */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.33, Math.sin(a) * 0.33, 0.005]}
                rotation={[0, 0, a]}
              >
                {/* Short strokes inside the iris, not rays outside it. */}
                <planeGeometry args={[0.2, 0.012]} />
                <meshBasicMaterial
                  color="#dcff9a"
                  transparent
                  opacity={0.32}
                  toneMapped={false}
                />
              </mesh>
            );
          })}
        </group>

        {/* Latitude wires — turns a plain sphere into an instrument. */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.36, 0.005, 8, 96]} />
          <meshBasicMaterial color="#c6ff4a" transparent opacity={0.28} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.6, 0]} scale={0.88}>
          <torusGeometry args={[1.36, 0.004, 8, 96]} />
          <meshBasicMaterial color="#c6ff4a" transparent opacity={0.16} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} scale={0.88}>
          <torusGeometry args={[1.36, 0.004, 8, 96]} />
          <meshBasicMaterial color="#c6ff4a" transparent opacity={0.16} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
