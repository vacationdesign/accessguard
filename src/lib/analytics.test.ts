import { describe, it, expect } from "vitest";
import { ipFromRequest } from "@/lib/analytics";

function req(headers: Record<string, string>): Request {
  return new Request("https://www.a11yscope.com", { headers });
}

describe("ipFromRequest", () => {
  it("takes the first IP from a comma-separated x-forwarded-for", () => {
    expect(
      ipFromRequest(req({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))
    ).toBe("203.0.113.7");
  });

  it("trims whitespace around the forwarded IP", () => {
    expect(ipFromRequest(req({ "x-forwarded-for": "  203.0.113.7  " }))).toBe(
      "203.0.113.7"
    );
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    expect(ipFromRequest(req({ "x-real-ip": "198.51.100.9" }))).toBe(
      "198.51.100.9"
    );
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    expect(
      ipFromRequest(
        req({ "x-forwarded-for": "203.0.113.7", "x-real-ip": "198.51.100.9" })
      )
    ).toBe("203.0.113.7");
  });

  it("returns 'unknown' when no IP headers are present", () => {
    expect(ipFromRequest(req({}))).toBe("unknown");
  });
});
