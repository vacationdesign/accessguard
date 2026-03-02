import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/checkout/", "/auth/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/checkout/", "/auth/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/checkout/", "/auth/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/checkout/", "/auth/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/checkout/", "/auth/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/checkout/", "/auth/"],
      },
    ],
    sitemap: "https://www.a11yscope.com/sitemap.xml",
  };
}
