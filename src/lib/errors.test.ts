import { describe, it, expect } from "vitest";
import { getErrorMessage } from "@/lib/errors";

describe("getErrorMessage", () => {
  it("returns the message from an Error instance", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns the message from a plain object with a string message", () => {
    expect(getErrorMessage({ message: "stripe says no" })).toBe(
      "stripe says no"
    );
  });

  it("uses the fallback for an Error with an empty message", () => {
    expect(getErrorMessage(new Error(""), "fallback")).toBe("fallback");
  });

  it("uses the fallback for non-error values (string, null, number)", () => {
    expect(getErrorMessage("just a string", "fb")).toBe("fb");
    expect(getErrorMessage(null, "fb")).toBe("fb");
    expect(getErrorMessage(42, "fb")).toBe("fb");
  });

  it("uses the default fallback when none is provided", () => {
    expect(getErrorMessage(null)).toBe(
      "Something went wrong. Please try again."
    );
  });
});
