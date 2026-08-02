/**
 * Turns the source photograph into the point cloud used by the hero object.
 *
 *   node scripts/build-portrait.mjs <photo.jpg>
 *
 * Only the extracted points are committed — never the photograph. The output is
 * a few thousand (x, y, luminance) triples, which is enough to recognise a face
 * as dots and nowhere near enough to reconstruct the original image. That keeps
 * a personal photo off a public repo and off the deployed site.
 *
 * Emits src/three/portraitData.ts so the data rides along in the hero's
 * already-lazy chunk instead of costing an extra request and a loading state.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SOURCE = process.argv[2] ?? "Passport.jpg";

/** Face box on the 777x960 source: hair crown to just below the chin. */
const FACE_BOX = { left: 222, top: 78, width: 344, height: 474 };

/** Sampling grid. Width drives the dot count; the eye reads ~130 as a face. */
const GRID_W = 132;

/** Never emit more than this many points. */
const MAX_POINTS = 9000;

/** How far a pixel must sit from the backdrop tone to count as subject. */
const BG_TOLERANCE = 14;

const gridH = Math.round((GRID_W * FACE_BOX.height) / FACE_BOX.width);

const { data, info } = await sharp(SOURCE)
  .extract(FACE_BOX)
  .resize(GRID_W, gridH, { fit: "fill" })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const W = info.width;
const H = info.height;
const lum = (x, y) => data[y * W + x];

// The backdrop is a flat grey, so the corners are a reliable sample of it.
const corners = [
  lum(1, 1),
  lum(W - 2, 1),
  lum(1, H - 2),
  lum(W - 2, H - 2),
];
const background = corners.reduce((a, b) => a + b, 0) / corners.length;

/**
 * Deterministic hash in [0,1). Used instead of Math.random so re-running the
 * script produces byte-identical output and does not churn the diff.
 */
function rand(i) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const cx = W / 2;
const cy = H / 2;

const points = [];
let index = 0;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    index++;
    const v = lum(x, y);

    // Elliptical mask. A rectangular crop of dots reads as a rectangle, not a
    // head, however good the interior is.
    const nx = (x - cx) / (W * 0.5);
    const ny = (y - cy) / (H * 0.5);
    const r = Math.hypot(nx, ny * 0.92);
    if (r > 1.02) continue;

    // Skin highlights can be brighter than the backdrop, so a plain luminance
    // threshold eats the face. Near the centre everything is kept; only the
    // outer band has to prove it differs from the background.
    const isSubject = r < 0.72 || Math.abs(v - background) > BG_TOLERANCE;
    if (!isSubject) continue;

    // Denser where the image is dark — hair, glasses, eyes, the jawline. Even
    // sampling wastes points on flat cheeks and loses the features that carry
    // the likeness.
    const darkness = 1 - v / 255;
    const keep = 0.22 + darkness * 0.95;
    if (rand(index) > keep) continue;

    points.push([x, y, v]);
  }
}

// Thin uniformly if we overshot, preserving the density distribution above.
let selected = points;
if (points.length > MAX_POINTS) {
  const stride = points.length / MAX_POINTS;
  selected = [];
  for (let i = 0; i < MAX_POINTS; i++) {
    selected.push(points[Math.floor(i * stride)]);
  }
}

const packed = new Uint8Array(selected.length * 3);
selected.forEach(([x, y, v], i) => {
  packed[i * 3] = x;
  packed[i * 3 + 1] = y;
  packed[i * 3 + 2] = v;
});

const base64 = Buffer.from(packed).toString("base64");

const out = `// GENERATED — do not edit by hand.
// Regenerate with: node scripts/build-portrait.mjs <photo.jpg>
//
// A point cloud extracted from a photograph: ${selected.length} (x, y, luminance)
// triples on a ${W}x${H} grid, packed as bytes and base64-encoded. The source
// photograph is intentionally not in this repository.

export const GRID_W = ${W};
export const GRID_H = ${H};
export const POINT_COUNT = ${selected.length};
export const PACKED = "${base64}";
`;

writeFileSync("src/three/portraitData.ts", out);

console.log(
  JSON.stringify(
    {
      grid: `${W}x${H}`,
      background: Math.round(background),
      candidates: points.length,
      emitted: selected.length,
      bytes: packed.length,
      base64Kb: +(base64.length / 1024).toFixed(1),
    },
    null,
    1,
  ),
);
