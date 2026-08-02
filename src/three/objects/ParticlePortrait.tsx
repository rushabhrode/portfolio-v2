"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  ShaderMaterial,
  Vector2,
  type Group,
  type Points,
} from "three";
import { GRID_W, GRID_H, PACKED, POINT_COUNT } from "../portraitData";

/**
 * The hero — a portrait assembled from points.
 *
 * The dots sit where the photograph was dark, so hair, glasses and the jawline
 * carry the likeness while flat areas stay sparse. Moving the cursor across it
 * pushes the points aside and they settle back.
 *
 * Every point is animated in the vertex shader. With 9,000 of them, doing the
 * repulsion on the CPU would mean rewriting a 27,000-float buffer every frame
 * and re-uploading it; here the cursor is one uniform and the GPU does the rest,
 * so the object costs essentially nothing to run.
 */

/** World height of the portrait. Sized to sit comfortably in the hero canvas. */
const HEIGHT = 3.25;
const WIDTH = (HEIGHT * GRID_W) / GRID_H;

function decode(): Uint8Array {
  const binary = atob(PACKED);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const vertexShader = /* glsl */ `
  attribute float aLum;
  attribute float aSeed;

  uniform vec2 uCursor;
  uniform float uActive;
  uniform float uTime;
  uniform float uSize;

  varying float vLum;
  varying float vPush;

  void main() {
    vLum = aLum;
    vec3 pos = position;

    // Idle drift, so the portrait breathes instead of sitting frozen.
    float wobble = sin(uTime * 0.55 + aSeed * 6.283) * 0.012;
    pos.z += wobble;
    pos.x += sin(uTime * 0.31 + aSeed * 4.0) * 0.006;

    // Cursor repulsion, falling off smoothly with distance.
    vec2 delta = pos.xy - uCursor;
    float dist = length(delta);
    float influence = 1.0 - smoothstep(0.0, 0.85, dist);
    influence *= influence * uActive;

    // Points scatter outward and toward the viewer, so the face opens up
    // rather than simply sliding sideways.
    vec2 dir = dist > 0.0001 ? delta / dist : vec2(0.0, 1.0);
    pos.xy += dir * influence * 0.42;
    pos.z += influence * 0.55;

    vPush = influence;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Darker source pixels get slightly larger points, which thickens hair and
    // features without needing more of them.
    float size = uSize * (0.75 + (1.0 - aLum) * 0.75);
    gl_PointSize = size * (300.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uBone;

  varying float vLum;
  varying float vPush;

  void main() {
    // Round points with a soft edge. Square points read as a glitch.
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = dot(c, c);
    if (d > 0.25) discard;
    float alpha = smoothstep(0.25, 0.06, d);

    // Bright areas of the photograph tend toward bone, dark toward accent, so
    // the features read in the accent colour.
    vec3 color = mix(uAccent, uBone, smoothstep(0.35, 0.95, vLum));

    // Disturbed points flare, which makes the interaction visible.
    color += uAccent * vPush * 0.75;

    // Opacity follows darkness, not brightness. Keying it to brightness lit up
    // the flat cheeks and left the hair, glasses and eye sockets faint — the
    // face washed out into a blob. The dark pixels are the ones carrying the
    // likeness, so they are the ones that should be solid.
    alpha *= 0.22 + (1.0 - vLum) * 0.78 + vPush * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function ParticlePortrait() {
  const group = useRef<Group>(null);
  const points = useRef<Points>(null);
  const cursor = useRef(new Vector2(0, -99));
  const active = useRef(0);

  const geometry = useMemo(() => {
    const bytes = decode();
    const positions = new Float32Array(POINT_COUNT * 3);
    const lums = new Float32Array(POINT_COUNT);
    const seeds = new Float32Array(POINT_COUNT);

    for (let i = 0; i < POINT_COUNT; i++) {
      const gx = bytes[i * 3];
      const gy = bytes[i * 3 + 1];
      const lum = bytes[i * 3 + 2] / 255;

      positions[i * 3] = (gx / GRID_W - 0.5) * WIDTH;
      // Image rows run top-to-bottom; world Y runs bottom-to-top.
      positions[i * 3 + 1] = -(gy / GRID_H - 0.5) * HEIGHT;
      // Darker points sit slightly forward, giving the cloud real depth.
      positions[i * 3 + 2] = (1 - lum) * 0.34 - 0.17;

      lums[i] = lum;
      seeds[i] = (i % 997) / 997;
    }

    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("aLum", new BufferAttribute(lums, 1));
    g.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uCursor: { value: new Vector2(0, -99) },
          uActive: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 0.019 },
          uAccent: { value: new Color("#c6ff4a") },
          uBone: { value: new Color("#dfe4ea") },
        },
      }),
    [],
  );

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;

    u.uCursor.value.lerp(cursor.current, 1 - Math.exp(-12 * delta));
    u.uActive.value = MathUtils.damp(u.uActive.value, active.current, 6, delta);

    // A little parallax, so the cloud reads as volume rather than a flat wall
    // of dots.
    if (group.current) {
      group.current.rotation.y = MathUtils.damp(
        group.current.rotation.y,
        state.pointer.x * 0.16,
        3,
        delta,
      );
      group.current.rotation.x = MathUtils.damp(
        group.current.rotation.x,
        -state.pointer.y * 0.1,
        3,
        delta,
      );
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} material={material} />

      {/* Invisible pick plane. Raycasting 9,000 points every frame would be
          wasteful; one plane gives the cursor position in the portrait's own
          space, and tells us when the cursor has left so the face can settle. */}
      <mesh
        position={[0, 0, 0.4]}
        onPointerMove={(e) => {
          if (e.point) {
            cursor.current.set(e.point.x, e.point.y);
            active.current = 1;
          }
        }}
        onPointerOut={() => {
          active.current = 0;
        }}
      >
        <planeGeometry args={[WIDTH * 1.6, HEIGHT * 1.2]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
