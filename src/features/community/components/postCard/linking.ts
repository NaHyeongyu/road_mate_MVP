import { Linking } from "react-native";

const tryOpenUrl = async (url: string) => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return;
    }

    await Linking.openURL(url);
  } catch {
    // Ignore linking errors to avoid crashing interaction flows.
  }
};

export const openPlaceInGoogleMaps = (value: string) => {
  const query = encodeURIComponent(value.trim());
  if (!query) {
    return;
  }

  void tryOpenUrl(`https://www.google.com/maps/search/?api=1&query=${query}`);
};

export const openPhoneDialer = (value: string | undefined) => {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return;
  }

  const normalized = raw.replace(/[^\d+]/g, "");
  if (!normalized) {
    return;
  }

  void tryOpenUrl(`tel:${normalized}`);
};

export const openContactLink = (value: string | undefined) => {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return;
  }

  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  void tryOpenUrl(normalized);
};
