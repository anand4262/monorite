import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Mirrors the Logo.tsx mark (gradient badge + "M" monogram) using
// satori-safe div/gradient/text primitives instead of raw SVG, since
// next/og's renderer supports a constrained CSS subset rather than
// arbitrary <svg> markup.
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
          borderRadius: 9,
          background: "linear-gradient(135deg, #F4F3EE 0%, #D8D0C3 100%)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0B0B0D",
            fontFamily: "sans-serif",
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size },
  );
}
