import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

export const createLayoutBottomBarStyles = (colors: AppColors) =>
  ({
    mainBottomBar: {
      minHeight: 68,
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.bg,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: -2 },
      elevation: 8,
    },
    mainBottomBarItem: {
      flex: 1,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    mainBottomBarLabel: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "700",
    },
    mainBottomBarLabelActive: {
      color: colors.brand,
    },
  }) satisfies StyleMap;
