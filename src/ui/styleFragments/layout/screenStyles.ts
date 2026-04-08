import { Platform, StatusBar } from "react-native";

import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import { APP_BAR_BG, APP_BAR_BORDER, AUTH_PAGE_BACKGROUND } from "./constants";

export const createLayoutScreenStyles = (colors: AppColors) =>
  ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    screen: {
      flex: 1,
      backgroundColor: colors.panelAlt,
    },
    authPage: {
      backgroundColor: AUTH_PAGE_BACKGROUND,
    },
    content: {
      padding: 18,
      gap: 16,
      paddingBottom: 40,
    },
    headerDock: {
      paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 6 : 0,
      paddingHorizontal: 16,
      paddingBottom: 8,
      backgroundColor: APP_BAR_BG,
      borderBottomWidth: 1,
      borderBottomColor: APP_BAR_BORDER,
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    screenScroll: {
      flex: 1,
      backgroundColor: colors.panelAlt,
    },
    screenContent: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 40,
      gap: 16,
    },
    loadingWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    loadingText: {
      color: colors.subtext,
      fontSize: 15,
    },
  }) satisfies StyleMap;
