import { Platform } from "react-native";

import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import { AUTH_BODY_FONT_EMPHASIS } from "./constants";

export const createAuthProviderStyles = (colors: AppColors) =>
  ({
    providerButton: {
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      gap: 10,
    },
    emailProviderButton: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    emailProviderButtonText: {
      color: colors.brandText,
      fontSize: 14,
      fontWeight: "800",
      fontFamily: AUTH_BODY_FONT_EMPHASIS,
      letterSpacing: -0.15,
      lineHeight: 18,
      transform: [{ translateY: Platform.OS === "android" ? 1 : 0.5 }],
    },
    googleProviderButton: {
      backgroundColor: "#4285F4",
      borderColor: "#4285F4",
    },
    googleProviderButtonText: {
      color: "#FFFFFF",
    },
    appleProviderButton: {
      backgroundColor: "#111827",
      borderColor: "#111827",
    },
    providerIconSlot: {
      width: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    providerIconGlyph: {
      lineHeight: 16,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    providerIconGlyphTight: {
      transform: [{ translateY: Platform.OS === "android" ? -0.5 : 0 }],
    },
    providerButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
      fontFamily: AUTH_BODY_FONT_EMPHASIS,
      letterSpacing: -0.15,
      lineHeight: 18,
      transform: [{ translateY: Platform.OS === "android" ? 1 : 0.5 }],
    },
    appleProviderButtonText: {
      color: "#FFFFFF",
    },
  }) satisfies StyleMap;
