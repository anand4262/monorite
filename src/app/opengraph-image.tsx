import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 20%, #1a1a1d 0%, #0B0B0D 55%)",
          color: "#F5F4F0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#D8D0C3",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {site.name}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, maxWidth: 900, lineHeight: 1.1 }}>
          {site.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
