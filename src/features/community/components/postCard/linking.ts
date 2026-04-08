import { Linking } from "react-native";

export const openPlaceInGoogleMaps = (value: string) => {
  const query = encodeURIComponent(value.trim());
  if (!query) {
    return;
  }

  void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
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

  void Linking.openURL(`tel:${normalized}`);
};

export const openContactLink = (value: string | undefined) => {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return;
  }

  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  void Linking.openURL(normalized);
};
