import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "A11yScope - Free Website Accessibility Checker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eff6ff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
        >
          <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#111827",
            marginTop: 24,
          }}
        >
          A11yScope
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#6b7280",
            marginTop: 12,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Free Website Accessibility Checker | WCAG 2.1 Compliance
        </div>
      </div>
    ),
    { ...size }
  );
}
