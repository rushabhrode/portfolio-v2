import { ImageResponse } from "next/og";
import { person } from "@/content/portfolio.data";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#101215";
const LINE = "#252b33";
const TEXT = "#dfe4ea";
const DIM = "#767f8b";
const ACCENT = "#c6ff4a";

/**
 * Shared social card renderer.
 *
 * Satori (which powers next/og) supports only a subset of CSS and no external
 * stylesheets, so everything here is inline flexbox. Deliberately no custom
 * font: loading one means shipping a binary and an await on every render, and
 * the layout carries the design without it.
 */
export function ogImage({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 72,
          paddingLeft: 92,
          position: "relative",
        }}
      >
        {/* A crisp accent rule rather than the site's soft glow. Satori renders
            radial gradients with a visible hard edge, which reads as a bug in
            a link preview — geometry survives the renderer, atmosphere does
            not. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 10,
            height: "100%",
            background: ACCENT,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: ACCENT,
              display: "flex",
            }}
          />
          <div style={{ color: TEXT, fontSize: 24, letterSpacing: 2 }}>
            RUSHABH_RODE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: ACCENT, fontSize: 24, letterSpacing: 3 }}>
            {eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: title.length > 46 ? 62 : 78,
              lineHeight: 1.05,
              marginTop: 22,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {(meta ?? []).map((m) => (
              <div key={m} style={{ color: DIM, fontSize: 22 }}>
                {m}
              </div>
            ))}
          </div>
          <div style={{ color: DIM, fontSize: 22 }}>
            {person.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
