import { Platform } from "react-native";

import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import { AUTH_BODY_FONT_EMPHASIS } from "./constants";

export const createAuthProviderStyles = (colors: AppColors) =>
  ({
    authProviderSectionTitle: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      fontFamily: AUTH_BODY_FONT_EMPHASIS,
      paddingHorizontal: 4,
      paddingBottom: 2,
    },
    providerButton: {
      height: 48,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      gap: 10,
    },
    providerButtonDisabled: {
      backgroundColor: colors.panelAlt,
      borderColor: colors.border,
      opacity: 0.62,
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
      backgroundColor: "#FFFFFF",
      borderColor: "#D2D6DC",
    },
    googleProviderButtonText: {
      color: "#202124",
    },
    appleProviderButton: {
      backgroundColor: "#111827",
      borderColor: "#111827",
    },
    facebookProviderButton: {
      backgroundColor: "#1877F2",
      borderColor: "#1877F2",
    },
    facebookProviderButtonText: {
      color: "#FFFFFF",
    },
    kakaoProviderButton: {
      backgroundColor: "#FEE500",
      borderColor: "#FEE500",
    },
    kakaoProviderButtonText: {
      color: "#191919",
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
    providerButtonTextDisabled: {
      color: colors.subtext,
    },
    appleProviderButtonText: {
      color: "#FFFFFF",
    },
    authProviderDividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 4,
    },
    authProviderDividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    authProviderDividerText: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.4,
      textTransform: "uppercase",
      fontFamily: AUTH_BODY_FONT_EMPHASIS,
      paddingHorizontal: 4,
    },
    providerSoonBadge: {
      marginLeft: "auto",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panel,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    providerSoonBadgeText: {
      color: colors.subtext,
      fontSize: 10,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
  }) satisfies StyleMap;
