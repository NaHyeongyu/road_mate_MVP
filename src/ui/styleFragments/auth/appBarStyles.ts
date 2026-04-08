import type { StyleMap } from "../styleTypes";
import { APP_BAR_ACTION_TEXT, APP_BAR_SUBTEXT, APP_BAR_TEXT } from "./constants";

export const createAuthAppBarStyles = () =>
  ({
    appBar: {
      minHeight: 52,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    appBarSide: {
      width: 88,
      minHeight: 40,
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
      gap: 1,
      minHeight: 40,
    },
    appBarSpacer: {
      width: 24,
      height: 40,
    },
    appBarTitle: {
      color: APP_BAR_TEXT,
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: -0.2,
    },
    appBarSubtitle: {
      color: APP_BAR_SUBTEXT,
      fontSize: 12,
      lineHeight: 16,
    },
    appBarAction: {
      minHeight: 40,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 2,
    },
    appBarActionText: {
      color: APP_BAR_ACTION_TEXT,
      fontSize: 15,
      fontWeight: "600",
    },
    appBarBackIcon: {
      color: APP_BAR_ACTION_TEXT,
      fontSize: 22,
      lineHeight: 22,
      marginRight: 2,
      marginTop: -1,
    },
    appBarActionPressed: {
      opacity: 0.58,
    },
  }) satisfies StyleMap;
