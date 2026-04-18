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
      paddingBottom: 10,
      backgroundColor: APP_BAR_BG,
      borderBottomWidth: 1,
      borderBottomColor: APP_BAR_BORDER,
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
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
