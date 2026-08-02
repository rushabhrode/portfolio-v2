"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group, type Mesh } from "three";
import { Lighting } from "../Lighting";

/**
 * Library Management System.
 *
 * Stacked translucent wafers, one per service layer, with a single bright
 * packet travelling up through them — a JWT being minted and passing the auth
 * boundary. The project's actual substance is its layering and where
 * authorisation is enforced, so that is what the object shows.
 */
const LAYERS = [
  { label: "client", y: 0.72 },
  { label: "auth", y: 0.24 },
  { label: "api", y: -0.24 },
  { label: "data", y: -0.72 },
];

export function WaferLattice() {
  const group = useRef<Group>(null);
  const packet = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x = MathUtils.damp(
        group.current.rotation.x,
        0.32 + Math.sin(state.clock.elapsedTime * 0.3) * 0.06,
        3,
        delta,
      );
    }

    if (packet.current) {
      // Rises through the stack and repeats — the request path, looping.
      const t = (state.clock.elapsedTime * 0.5) % 1;
      packet.current.position.y = -0.95 + t * 1.9;
      const m = packet.current.material as { opacity: number };
      // Fade at both ends so it does not pop.
      m.opacity = Math.sin(t * Math.PI) * 0.95;
    }
  });

  return (
    <>
      <Lighting />
      <group ref={group} rotation={[0.32, 0, 0]}>
        {LAYERS.map((layer, i) => (
          <mesh key={layer.label} position={[0, layer.y, 0]}>
            <boxGeometry args={[1.7 - i * 0.06, 0.055, 1.7 - i * 0.06]} />
            <meshStandardMaterial
              color="#9fd0e8"
              transparent
              opacity={0.16}
              roughness={0.08}
              metalness={0.05}
            />
          </mesh>
        ))}

        {/* Edge outlines — transparent panes read as fog without them. */}
        {LAYERS.map((layer, i) => (
          <mesh key={`${layer.label}-edge`} position={[0, layer.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[(1.7 - i * 0.06) * 0.705, (1.7 - i * 0.06) * 0.72, 4]} />
            <meshBasicMaterial
              color="#c6ff4a"
              transparent
              opacity={0.3}
              toneMapped={false}
            />
          </mesh>
        ))}

        <mesh ref={packet}>
          <boxGeometry args={[0.13, 0.13, 0.13]} />
          <meshBasicMaterial color="#c6ff4a" transparent toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
