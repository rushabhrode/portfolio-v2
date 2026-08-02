"use client";

/**
 * Shared lighting for the inline objects.
 *
 * Three lights, no shadow maps. A cool key from the upper left reads the form,
 * an accent-coloured rim from behind separates the object from the panel it
 * sits on, and a very low ambient keeps unlit faces from going pure black.
 *
 * The rim light is what stops these objects looking like grey plastic — the
 * usual result of a lone directional light and a bright ambient.
 */
export function Lighting({ accent = "#c6ff4a" }: { accent?: string }) {
  return (
    <>
      <ambientLight intensity={0.35} color="#8fa3b8" />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#eaf2ff" />
      <pointLight position={[-3, -1, -4]} intensity={34} color={accent} distance={14} />
    </>
  );
}
