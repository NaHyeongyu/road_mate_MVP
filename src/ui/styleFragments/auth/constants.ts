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

export const APP_BAR_TEXT = "#0D274A";
export const APP_BAR_SUBTEXT = "#6D7B8F";
export const APP_BAR_ACTION_TEXT = "#0D274A";
export const APP_BAR_ACTION_BG = "#FFFFFF";
export const APP_BAR_ACTION_BORDER = "#D8E1EC";
export const APP_BAR_GHOST_BG = "#FFFFFF";
export const APP_BAR_GHOST_BORDER = "#E1E8F0";
