import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — the accent dot from the site's wordmark, on the site's own
 * background. Generated rather than shipped as a binary, so it can never drift
 * from the palette.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101215",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: 9999,
            background: "#c6ff4a",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
