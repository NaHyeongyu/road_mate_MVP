import { describe, expect, it } from "vitest";

import { toValidHttpUrl } from "./supabase";

describe("toValidHttpUrl", () => {
  it("accepts HTTP and HTTPS URLs", () => {
    expect(toValidHttpUrl("https://example.supabase.co")).toBe("https://example.supabase.co/");
    expect(toValidHttpUrl(" http://localhost:54321 ")).toBe("http://localhost:54321/");
  });

  it("rejects missing, placeholder, and non-HTTP values", () => {
    expect(toValidHttpUrl(undefined)).toBeNull();
    expect(toValidHttpUrl("...")).toBeNull();
    expect(toValidHttpUrl("example.supabase.co")).toBeNull();
    expect(toValidHttpUrl("ftp://example.supabase.co")).toBeNull();
  });
});
