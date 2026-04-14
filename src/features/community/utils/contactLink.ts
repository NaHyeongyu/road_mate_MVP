const normalizeLinkForHostParse = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const toHost = (value: string) => {
  const normalized = normalizeLinkForHostParse(value);
  if (!normalized) {
    return "";
  }

  try {
    return new URL(normalized).hostname.toLowerCase();
  } catch {
    return "";
  }
};

export const toContactLinkLabel = (value: string | undefined) => {
  const host = toHost(String(value ?? ""));
  if (!host) {
    return "Chat link";
  }

  if (host === "wa.me" || host.endsWith("whatsapp.com")) {
    return "WhatsApp";
  }

  if (host === "open.kakao.com" || host.endsWith("kakao.com")) {
    return "KakaoTalk";
  }

  if (host === "t.me" || host.endsWith("telegram.me") || host.endsWith("telegram.org")) {
    return "Telegram";
  }

  if (host === "m.me" || host.endsWith("messenger.com") || host.endsWith("facebook.com")) {
    return "Messenger";
  }

  if (host.endsWith("instagram.com")) {
    return "Instagram";
  }

  return "Chat link";
};
