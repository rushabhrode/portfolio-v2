"use client";

import dynamic from "next/dynamic";
import { Object3DFrame } from "./Object3DFrame";

/**
 * Each object is its own chunk, imported only when Object3DFrame decides to
 * mount it. A visitor who never scrolls to the projects never downloads their
 * geometry, and a visitor on a software renderer never downloads any of it.
 */
const Scanpath = dynamic(() => import("./objects/Scanpath").then((m) => m.Scanpath), {
  ssr: false,
});
const DiffStream = dynamic(
  () => import("./objects/DiffStream").then((m) => m.DiffStream),
  { ssr: false },
);
const TwinTowers = dynamic(
  () => import("./objects/TwinTowers").then((m) => m.TwinTowers),
  { ssr: false },
);
const WaferLattice = dynamic(
  () => import("./objects/WaferLattice").then((m) => m.WaferLattice),
  { ssr: false },
);
const MedallionPipeline = dynamic(
  () => import("./objects/MedallionPipeline").then((m) => m.MedallionPipeline),
  { ssr: false },
);

type Kind = "scanpath" | "diff" | "towers" | "wafers" | "pipeline";

const BY_SLUG: Record<string, Kind> = {
  "teams-data-platform": "pipeline",
  "autism-eye-tracking": "scanpath",
  "code-review-assistant": "diff",
  "two-tower-rag": "towers",
  "library-system": "wafers",
};

/**
 * Static stand-ins, used when WebGL is unavailable or motion is reduced.
 *
 * These are not placeholders for something missing — they are the designed
 * result for those visitors, and they carry the same idea in two dimensions.
 */
function Fallback({ kind }: { kind: Kind }) {
  const stroke = "#c6ff4a";
  const dim = "#2b323b";

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {kind === "scanpath" && (
        <>
          <polyline
            points="24,32 62,28 32,44 52,52 22,62 58,70"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            opacity="0.5"
          />
          {[
            [24, 32, 6],
            [62, 28, 5],
            [32, 44, 3.5],
            [52, 52, 3],
            [22, 62, 4.5],
            [58, 70, 3.5],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={stroke} opacity="0.8" />
          ))}
        </>
      )}

      {kind === "diff" && (
        <>
          {Array.from({ length: 10 }).map((_, i) => {
            const flagged = i === 3 || i === 7;
            return (
              <rect
                key={i}
                x="20"
                y={20 + i * 6.2}
                width={22 + ((i * 37) % 11) * 3}
                height="3"
                fill={flagged ? stroke : dim}
                opacity={flagged ? 0.95 : 0.8}
              />
            );
          })}
        </>
      )}

      {kind === "towers" && (
        <>
          <rect x="20" y="26" width="8" height="48" fill={dim} />
          <rect x="72" y="26" width="8" height="48" fill={dim} />
          <circle cx="50" cy="50" r="7" fill={stroke} />
          {[36, 50, 64].map((y, i) => (
            <g key={i} opacity="0.55">
              <line x1="30" y1={y} x2="43" y2="50" stroke={stroke} strokeWidth="0.8" />
              <line x1="70" y1={y} x2="57" y2="50" stroke={stroke} strokeWidth="0.8" />
            </g>
          ))}
        </>
      )}

      {kind === "pipeline" && (
        <>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={26 + i * 6}
              y={24 + i * 20}
              width={48 - i * 12}
              height="10"
              fill="none"
              stroke={i === 2 ? stroke : dim}
              strokeWidth="1.2"
              opacity={i === 2 ? 0.9 : 0.7}
            />
          ))}
          {[38, 50, 62].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1="18"
              x2={x}
              y2="78"
              stroke={stroke}
              strokeWidth="0.7"
              opacity="0.35"
            />
          ))}
          <circle cx="50" cy="70" r="3" fill={stroke} />
        </>
      )}

      {kind === "wafers" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={26 + i * 2}
              y={26 + i * 13}
              width={48 - i * 4}
              height="9"
              fill="none"
              stroke={stroke}
              strokeWidth="0.9"
              opacity={0.45}
            />
          ))}
          <rect x="47" y="44" width="6" height="6" fill={stroke} />
        </>
      )}
    </svg>
  );
}

export function ProjectVisual({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const kind = BY_SLUG[slug];
  if (!kind) return null;

  return (
    <Object3DFrame
      className={className}
      fallback={
        <div className="flex h-full w-full items-center justify-center p-3">
          <Fallback kind={kind} />
        </div>
      }
      camera={{ position: [0, 0, 4.2], fov: 42 }}
    >
      {kind === "pipeline" && <MedallionPipeline />}
      {kind === "scanpath" && <Scanpath />}
      {kind === "diff" && <DiffStream />}
      {kind === "towers" && <TwinTowers />}
      {kind === "wafers" && <WaferLattice />}
    </Object3DFrame>
  );
}

/** The hero object, split out because it uses a different camera framing. */
const ParticlePortrait = dynamic(
  () => import("./objects/ParticlePortrait").then((m) => m.ParticlePortrait),
  { ssr: false },
);

export function HeroVisual({ className = "" }: { className?: string }) {
  return (
    <Object3DFrame
      className={className}
      // The hero is above the fold, so there is no point deferring it.
      rootMargin="600px"
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          {/* A dotted head silhouette — the same idea at rest, for anyone
              without WebGL or with reduced motion enabled. */}
          <svg viewBox="0 0 100 120" className="h-full w-auto" aria-hidden="true">
            {Array.from({ length: 260 }).map((_, i) => {
              // Deterministic scatter inside a head-shaped ellipse.
              const a = (i * 2.399) % (Math.PI * 2);
              const r = Math.sqrt(((i * 37) % 100) / 100);
              const x = 50 + Math.cos(a) * r * 27;
              const y = 54 + Math.sin(a) * r * 36;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={0.8}
                  fill="#c6ff4a"
                  opacity={0.15 + (1 - r) * 0.45}
                />
              );
            })}
          </svg>
        </div>
      }
    >
      <ParticlePortrait />
    </Object3DFrame>
  );
}
