import { describe, it, expect } from "vitest";
import { escapeHtml, safeDomain } from "@/lib/html";

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<script>"x" & 'y'</script>`)).toBe(
      "&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;"
    );
  });

  it("escapes & before other entities (no double-escaping)", () => {
    expect(escapeHtml("a & <b>")).toBe("a &amp; &lt;b&gt;");
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Hello world 123")).toBe("Hello world 123");
  });
});

describe("safeDomain", () => {
  it("returns the hostname for a valid URL", () => {
    expect(safeDomain("https://www.example.com/path?q=1")).toBe(
      "www.example.com"
    );
  });

  it("strips CR/LF so it can't inject email headers", () => {
    // A hostname should never carry CRLF; if one ever did, it must be stripped.
    const sneaky = "https://evil.com\r\nBcc:attacker@x.com/";
    expect(safeDomain(sneaky)).not.toMatch(/[\r\n]/);
  });

  it("falls back to a neutral label for an unparseable URL", () => {
    expect(safeDomain("not a url")).toBe("your page");
  });
});
