import type { StyleMap } from "../styleTypes";
import {
  APP_BAR_ACTION_BG,
  APP_BAR_ACTION_BORDER,
  APP_BAR_ACTION_TEXT,
  APP_BAR_GHOST_BG,
  APP_BAR_GHOST_BORDER,
  APP_BAR_SUBTEXT,
  APP_BAR_TEXT,
} from "./constants";

export const createAuthAppBarStyles = () =>
  ({
    appBar: {
      minHeight: 56,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14,
    },
    appBarSide: {
      width: 102,
      minHeight: 42,
      justifyContent: "center",
      alignItems: "flex-start",
    },
    appBarSideRight: {
      alignItems: "flex-end",
    },
    appBarCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      minHeight: 42,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    appBarSpacer: {
      width: 24,
      height: 42,
    },
    appBarTitle: {
      color: APP_BAR_TEXT,
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.4,
      textAlign: "center",
      flexShrink: 1,
    },
    appBarSubtitle: {
      color: APP_BAR_SUBTEXT,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "600",
      letterSpacing: 0.2,
      textAlign: "center",
      flexShrink: 1,
    },
    appBarAction: {
      minHeight: 40,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
    },
    appBarActionBack: {
      backgroundColor: APP_BAR_ACTION_BG,
      borderColor: APP_BAR_ACTION_BORDER,
      shadowColor: APP_BAR_ACTION_TEXT,
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
      width: 40,
      paddingHorizontal: 0,
    },
    appBarActionGhost: {
      backgroundColor: APP_BAR_GHOST_BG,
      borderColor: APP_BAR_GHOST_BORDER,
    },
    appBarActionText: {
      color: APP_BAR_ACTION_TEXT,
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: -0.2,
    },
    appBarBackIcon: {
      color: APP_BAR_ACTION_TEXT,
      fontSize: 24,
      lineHeight: 24,
      marginTop: -2,
    },
    appBarActionPressed: {
      opacity: 0.86,
    },
  }) satisfies StyleMap;
