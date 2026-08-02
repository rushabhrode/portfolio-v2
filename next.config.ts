import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: deliberately NOT setting transpilePackages: ["three"].
  // That is legacy webpack guidance from the R3F docs. Next 16 builds with
  // Turbopack, which consumes three's ESM directly, and forcing it through
  // transpilation there produced a module graph that hung the renderer on
  // mount — a frozen main thread, no rAF, and a permanently blank canvas.

  async redirects() {
    return [
      // The previous site published its writing at /blogs; this one uses
      // /blog. Without these, every existing bookmark and every Google result
      // for the old path 404s the moment the domain is repointed.
      //
      // Permanent (308), so search engines transfer the old URL's standing to
      // the new one instead of treating it as a temporary detour.
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
