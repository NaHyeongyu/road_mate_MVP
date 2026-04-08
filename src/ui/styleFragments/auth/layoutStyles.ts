import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import {
  AUTH_BODY_FONT_EMPHASIS,
  AUTH_DISPLAY_FONT,
  AUTH_PAGE_BACKGROUND,
} from "./constants";

export const createAuthLayoutStyles = (colors: AppColors) =>
  ({
    authPageContent: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 20,
      backgroundColor: AUTH_PAGE_BACKGROUND,
    },
    authPageFrame: {
      flex: 1,
      backgroundColor: AUTH_PAGE_BACKGROUND,
    },
    authSimpleHero: {
      alignItems: "center",
      paddingHorizontal: 18,
      justifyContent: "center",
      paddingTop: 32,
      paddingBottom: 24,
    },
    authEmailScreen: {
      flex: 1,
    },
    authEmailHeader: {
      paddingTop: 4,
      paddingBottom: 12,
    },
    authEmailBody: {
      flex: 1,
      justifyContent: "flex-start",
      gap: 14,
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 20,
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
      width: 188,
      height: 188,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    authSimpleTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      fontFamily: AUTH_DISPLAY_FONT,
      letterSpacing: -0.7,
    },
    authChooserCard: {
      gap: 12,
      marginHorizontal: 6,
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
    },
  }) satisfies StyleMap;
