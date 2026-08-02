"use client";

/** Substrings identifying software renderers that cannot carry real-time 3D. */
const WEAK_GPU = [
  "swiftshader",
  "llvmpipe",
  "software",
  "microsoft basic render",
  "mesa offscreen",
];

export interface Capability {
  webgl: boolean;
  weakGpu: boolean;
  reducedMotion: boolean;
  /** The only question callers actually need answered. */
  can3d: boolean;
}

function probe(): Capability {
  if (typeof window === "undefined") {
    return { webgl: false, weakGpu: false, reducedMotion: false, can3d: false };
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let webgl = false;
  let weakGpu = false;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;

    if (gl) {
      webgl = true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        const renderer = String(
          gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? "",
        ).toLowerCase();
        weakGpu = WEAK_GPU.some((needle) => renderer.includes(needle));
      }
    }
    // Note: deliberately not calling WEBGL_lose_context to free this probe.
    // On Windows/ANGLE that can cascade a context reset into real canvases.
  } catch {
    webgl = false;
  }

  return {
    webgl,
    weakGpu,
    reducedMotion,
    // Reduced motion does not disqualify 3D outright — the objects simply stop
    // animating — but a software renderer does.
    can3d: webgl && !weakGpu,
  };
}

/**
 * Probed once per session and cached. The GPU does not change mid-visit, and a
 * stable reference is required by useSyncExternalStore to avoid a snapshot loop.
 */
let cached: Capability | null = null;
export function getCapability(): Capability {
  if (!cached) cached = probe();
  return cached;
}

export const subscribeNever = () => () => {};
export const serverCapability = (): Capability => ({
  webgl: false,
  weakGpu: false,
  reducedMotion: false,
  can3d: false,
});
