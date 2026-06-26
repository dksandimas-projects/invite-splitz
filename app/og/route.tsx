import { ImageResponse } from "next/og";

export const runtime = "edge";

const DATE_LABEL = "August 1, 2026";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #FAFAF5 0%, #F5F2C0 100%)",
          fontFamily: "serif",
          color: "#2C2B28",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#7A7670",
            marginBottom: 40,
          }}
        >
          Save the Date
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 120,
            fontWeight: 300,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          <span>Bretch</span>
          <span
            style={{
              fontStyle: "italic",
              color: "#4E8A20",
              fontSize: 64,
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            and
          </span>
          <span>Joyce</span>
        </div>

        <div
          style={{
            display: "flex",
            width: 80,
            height: 1,
            background: "#E2DED8",
            marginTop: 48,
            marginBottom: 32,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 36,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {DATE_LABEL}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#7A7670",
          }}
        >
          invite-splitz
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
