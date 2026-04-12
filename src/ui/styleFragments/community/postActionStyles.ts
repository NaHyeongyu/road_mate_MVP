import { brandPalette, type AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

const isDarkPalette = (colors: AppColors) => colors.bg === brandPalette.dark.bg;

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
      borderColor: "#BFDBFE",
      backgroundColor: "#EFF6FF",
      minHeight: 36,
      paddingHorizontal: 14,
      maxWidth: "100%",
    },
    postActionInfoText: {
      color: "#1D4ED8",
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
      backgroundColor: isDarkPalette(colors) ? "rgba(255,209,102,0.18)" : "#FFF7D6",
      minHeight: 36,
      paddingHorizontal: 16,
      maxWidth: "100%",
    },
    postActionSaveActive: {
      borderColor: isDarkPalette(colors) ? "#8FA6CB" : "#93C5FD",
      backgroundColor: isDarkPalette(colors) ? "rgba(143,166,203,0.24)" : "#DBEAFE",
    },
    postActionSaveText: {
      color: isDarkPalette(colors) ? "#FFE29B" : "#8A5A00",
      fontSize: 13,
      fontWeight: "700",
      flexShrink: 1,
    },
    postActionSaveTextActive: {
      color: isDarkPalette(colors) ? "#EAF2FF" : "#0D274A",
    },
    postActionDanger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#FECACA",
      backgroundColor: "#FEF2F2",
      minHeight: 36,
      paddingHorizontal: 14,
      maxWidth: "100%",
    },
    postActionDangerText: {
      color: "#991B1B",
      fontSize: 13,
      fontWeight: "700",
      flexShrink: 1,
    },
  }) satisfies StyleMap;
