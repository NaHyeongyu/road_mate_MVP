import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

export const createCommunityPostActionStyles = (colors: AppColors) =>
  ({
    postActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 2,
    },
    postActionInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.accentBorder,
      backgroundColor: colors.accentBg,
      minHeight: 44,
      paddingHorizontal: 14,
      maxWidth: "100%",
    },
    postActionInfoText: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: "700",
      flexShrink: 1,
    },
    postActionSave: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.brand,
      backgroundColor: colors.warningBg,
      minHeight: 44,
      paddingHorizontal: 16,
      maxWidth: "100%",
    },
    postActionSaveActive: {
      borderColor: colors.accentSoftBorder,
      backgroundColor: colors.accentSoftBg,
    },
    postActionSaveText: {
      color: colors.warning,
      fontSize: 13,
      fontWeight: "700",
      flexShrink: 1,
    },
    postActionSaveTextActive: {
      color: colors.text,
    },
    postActionDanger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.dangerBorder,
      backgroundColor: colors.dangerBg,
      minHeight: 44,
      paddingHorizontal: 14,
      maxWidth: "100%",
    },
    postActionDangerText: {
      color: colors.danger,
      fontSize: 13,
      fontWeight: "700",
      flexShrink: 1,
    },
  }) satisfies StyleMap;
