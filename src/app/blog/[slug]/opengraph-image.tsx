import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const alt = "A11yScope Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "A11yScope Blog";

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
          >
            <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#2563eb" }}>
            A11yScope Blog
          </span>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 20, color: "#6b7280" }}>
          www.a11yscope.com/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
