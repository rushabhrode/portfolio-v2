import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: deliberately NOT setting transpilePackages: ["three"].
  // That is legacy webpack guidance from the R3F docs. Next 16 builds with
  // Turbopack, which consumes three's ESM directly, and forcing it through
  // transpilation there produced a module graph that hung the renderer on
  // mount — a frozen main thread, no rAF, and a permanently blank canvas.
};

export default nextConfig;
