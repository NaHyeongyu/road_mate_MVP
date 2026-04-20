import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

export const createAuthAppBarStyles = (colors: AppColors) =>
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
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.4,
      textAlign: "center",
      flexShrink: 1,
    },
    appBarSubtitle: {
      color: colors.subtext,
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
      backgroundColor: colors.panel,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
      width: 40,
      paddingHorizontal: 0,
    },
    appBarActionGhost: {
      backgroundColor: colors.panel,
      borderColor: colors.border,
    },
    appBarActionText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: -0.2,
    },
    appBarBackIcon: {
      color: colors.text,
      fontSize: 24,
      lineHeight: 24,
      marginTop: -2,
    },
    appBarActionPressed: {
      opacity: 0.86,
    },
  }) satisfies StyleMap;
