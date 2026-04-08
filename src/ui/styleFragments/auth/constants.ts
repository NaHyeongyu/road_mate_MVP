import { Platform } from "react-native";

import { brandPalette } from "../../../brandTheme";

export const AUTH_PAGE_BACKGROUND = brandPalette.light.bg;

export const AUTH_DISPLAY_FONT = Platform.select({
  ios: "AppleMyungjo",
  android: "serif",
  default: "Georgia",
});

export const AUTH_BODY_FONT = Platform.select({
  ios: "Apple SD Gothic Neo",
  android: "sans-serif",
  default: "system-ui",
});

export const AUTH_BODY_FONT_EMPHASIS = Platform.select({
  ios: "Apple SD Gothic Neo",
  android: "sans-serif-medium",
  default: "system-ui",
});

export const APP_BAR_TEXT = "#111827";
export const APP_BAR_SUBTEXT = "#6B7280";
export const APP_BAR_ACTION_TEXT = "#2563EB";
