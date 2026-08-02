# rushabhrode.me

Personal portfolio — Next.js 16 (App Router), TypeScript, Tailwind 4, React Three Fiber.

## Content

All content lives in one file: [`src/content/portfolio.data.ts`](src/content/portfolio.data.ts).

It feeds the home page, the static project/paper/blog routes, the sitemap, the
JSON-LD, and the generated social cards — so those can never disagree with each
other. To add a project, add an entry to `projects`; nothing else needs to
change.

## Structure

```
src/
├─ app/                  routes, sitemap, robots, OG images, favicon
├─ content/              the single source of truth
├─ three/                inline 3D objects + the frame that hosts them
│  ├─ Object3DFrame.tsx  lazy-mount, pause-off-screen, capability gate
│  └─ objects/           one component per object
├─ systems/              WebGL capability probe, render-loop driver
└─ ui/                   layout, reveals, counters, marquee, backdrop
```

## The 3D

Five small objects, each derived from what it represents rather than being
generic decoration: an eye that tracks the cursor in the hero, a scanpath for
the eye-tracking research, a filtered diff stream for the review agent, two
encoder towers converging for the RAG pipeline, and a layered lattice for the
library service.

They are cheap on purpose:

- each mounts only when it scrolls into view, and stops rendering once it leaves
- each is a separate chunk, so objects you never scroll to are never downloaded
- no post-processing, no shadow maps, device pixel ratio capped at 1.5
- software renderers and `prefers-reduced-motion` get designed SVG stand-ins

## Notes for future work

**The render loop is driven manually.** R3F's built-in scheduler does not run
under this stack (Next 16 / Turbopack / React 19.2) — a canvas mounts, the
scene graph builds correctly, then the loop executes exactly one frame and
stops without ever issuing a draw call. Verified by isolation: plain three.js
in the same app renders at full rate.

Each canvas therefore runs with `frameloop="demand"` and
[`FrameDriver`](src/systems/FrameDriver.tsx) advances only its own root. If a
future R3F release fixes the scheduler, that component can be deleted and the
canvases returned to the default frameloop.

**Content never depends on JavaScript to appear.** Every route is statically
generated and readable with JS disabled. Above-the-fold content animates with
CSS at parse time; scroll reveals are gated behind a `data-js` flag so a failed
or slow bundle leaves everything visible rather than blank.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npx eslint src   # clean
```
