import { brandPalette, type AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import {
  ROLE_TOGGLE_ACTIVE_TEXT,
  ROLE_TOGGLE_DARK_BG,
  ROLE_TOGGLE_DARK_BORDER,
  ROLE_TOGGLE_DARK_HIGHLIGHT,
  ROLE_TOGGLE_HEIGHT,
  ROLE_TOGGLE_INACTIVE_DARK_TEXT,
  ROLE_TOGGLE_INACTIVE_LIGHT_TEXT,
  ROLE_TOGGLE_LIGHT_BG,
  ROLE_TOGGLE_LIGHT_BORDER,
  ROLE_TOGGLE_LIGHT_HIGHLIGHT,
  ROLE_TOGGLE_THUMB_WIDTH,
  ROLE_TOGGLE_WIDTH,
} from "./constants";

const isDarkPalette = (colors: AppColors) => colors.bg === brandPalette.dark.bg;

export const createLayoutRoleToggleStyles = (colors: AppColors) =>
  ({
    roleToggleTop: {
      paddingTop: 10,
      paddingBottom: 6,
      alignItems: "center",
      backgroundColor: colors.panelAlt,
    },
    roleToggleShell: {
      width: ROLE_TOGGLE_WIDTH,
      height: ROLE_TOGGLE_HEIGHT,
      borderRadius: 999,
      borderWidth: 1,
      overflow: "hidden",
      flexDirection: "row",
      position: "relative",
      borderColor: isDarkPalette(colors) ? ROLE_TOGGLE_DARK_BORDER : ROLE_TOGGLE_LIGHT_BORDER,
      backgroundColor: isDarkPalette(colors) ? ROLE_TOGGLE_DARK_BG : ROLE_TOGGLE_LIGHT_BG,
      shadowColor: colors.shadow,
      shadowOpacity: isDarkPalette(colors) ? 0.18 : 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
    roleToggleHighlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: ROLE_TOGGLE_HEIGHT / 2,
      borderRadius: 999,
      backgroundColor: isDarkPalette(colors)
        ? ROLE_TOGGLE_DARK_HIGHLIGHT
        : ROLE_TOGGLE_LIGHT_HIGHLIGHT,
    },
    roleToggleThumb: {
      position: "absolute",
      top: 0,
      left: 0,
      width: ROLE_TOGGLE_THUMB_WIDTH,
      height: ROLE_TOGGLE_HEIGHT,
      borderRadius: 999,
      backgroundColor: colors.brand,
      shadowColor: colors.shadow,
      shadowOpacity: isDarkPalette(colors) ? 0.2 : 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    roleToggleItem: {
      flex: 1,
      height: ROLE_TOGGLE_HEIGHT,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    roleToggleItemPressed: {
      opacity: 0.72,
    },
    roleToggleItemContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    roleToggleText: {
      fontSize: 14,
      fontWeight: "700",
    },
    roleToggleTextActive: {
      color: ROLE_TOGGLE_ACTIVE_TEXT,
    },
    roleToggleTextInactive: {
      color: isDarkPalette(colors) ? ROLE_TOGGLE_INACTIVE_DARK_TEXT : ROLE_TOGGLE_INACTIVE_LIGHT_TEXT,
    },
  }) satisfies StyleMap;
