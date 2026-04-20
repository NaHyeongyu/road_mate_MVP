import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import {
  AUTH_BODY_FONT_EMPHASIS,
  AUTH_DISPLAY_FONT,
} from "./constants";

export const createAuthLayoutStyles = (colors: AppColors) =>
  ({
    authPageContent: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 20,
      backgroundColor: colors.bg,
    },
    authPageFrame: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    authPageScroll: {
      flex: 1,
    },
    authPageScrollContent: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 28,
      gap: 16,
    },
    authSimpleHero: {
      alignItems: "center",
      paddingHorizontal: 18,
      justifyContent: "center",
      paddingTop: 24,
      paddingBottom: 20,
    },
    authEmailScreen: {
      flex: 1,
    },
    authEmailHeader: {
      paddingTop: 4,
      paddingBottom: 12,
    },
    authEmailBody: {
      flexGrow: 1,
      justifyContent: "flex-start",
      gap: 14,
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 24,
    },
    authBackButton: {
      alignSelf: "flex-start",
      minHeight: 36,
      justifyContent: "center",
      paddingHorizontal: 2,
      marginBottom: 16,
    },
    authBackButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: AUTH_BODY_FONT_EMPHASIS,
      letterSpacing: -0.1,
    },
    authEmailHero: {
      alignItems: "center",
      paddingBottom: 16,
    },
    authEmailLogoStage: {
      width: 124,
      height: 124,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    authLogoStage: {
      width: 172,
      height: 172,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    authSimpleTitle: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "700",
      textAlign: "center",
      fontFamily: AUTH_DISPLAY_FONT,
      letterSpacing: -0.7,
    },
    authChooserCard: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panel,
      paddingHorizontal: 18,
      paddingVertical: 18,
      gap: 14,
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    authChooserHeader: {
      gap: 6,
    },
  }) satisfies StyleMap;
