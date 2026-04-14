import { describe, expect, it } from "vitest";

import { toContactLinkLabel } from "./contactLink";

describe("toContactLinkLabel", () => {
  it("detects WhatsApp links", () => {
    expect(toContactLinkLabel("https://wa.me/61412345678")).toBe("WhatsApp");
    expect(toContactLinkLabel("https://chat.whatsapp.com/abcdef")).toBe("WhatsApp");
  });

  it("detects Kakao and Telegram links", () => {
    expect(toContactLinkLabel("https://open.kakao.com/o/room123")).toBe("KakaoTalk");
    expect(toContactLinkLabel("https://t.me/ridegroup")).toBe("Telegram");
  });

  it("falls back to generic label for unknown links", () => {
    expect(toContactLinkLabel("https://example.com/chat")).toBe("Chat link");
  });
});
