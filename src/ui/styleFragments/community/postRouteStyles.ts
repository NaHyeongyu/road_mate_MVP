import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

export const createCommunityPostRouteStyles = (colors: AppColors) =>
  ({
    postCard: {
      backgroundColor: colors.panel,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 12,
      marginTop: 6,
      shadowColor: colors.shadow,
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    postCardContentPressable: {
      gap: 12,
    },
    postCardContentPressablePressed: {
      opacity: 0.84,
    },
    postHeaderTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
    },
    postHeaderTopMain: {
      flex: 1,
      minWidth: 0,
    },
    postHeaderIconAction: {
      width: 44,
      height: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    postHeaderIconActionActive: {
      borderColor: "#93C5FD",
      backgroundColor: "#DBEAFE",
    },
    postHeaderIconActionPressed: {
      opacity: 0.72,
    },
    postHeaderEditAction: {
      minHeight: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "#BFDBFE",
      backgroundColor: "#EFF6FF",
      paddingHorizontal: 13,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    postHeaderEditActionText: {
      color: "#1D4ED8",
      fontSize: 13,
      fontWeight: "800",
    },
    postHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      gap: 10,
    },
    postTypePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    postTypePillRegular: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    postTypePillOneTime: {
      backgroundColor: "#F8FAFC",
      borderColor: "#CBD5E1",
    },
    postTypePillText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "700",
    },
    postTypePillTextRegular: {
      color: colors.brandText,
      fontWeight: "800",
    },
    postTypePillTextOneTime: {
      color: colors.text,
      fontWeight: "700",
    },
    postDate: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "500",
    },
    postRouteStack: {
      paddingVertical: 2,
      gap: 7,
    },
    postRouteStopBlock: {
      gap: 4,
      paddingVertical: 1,
    },
    postRouteStopBlockPressed: {
      opacity: 0.62,
    },
    postRouteStopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    postRouteLeadIconSlot: {
      width: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    postRouteEndpointTextPrimary: {
      flex: 1,
      color: colors.text,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "700",
      letterSpacing: -0.1,
    },
    postRouteDirectionRow: {
      width: 24,
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    postRouteConnectorLine: {
      width: 2,
      height: 6,
      borderRadius: 99,
      backgroundColor: colors.border,
    },
    postRouteDirectionChip: {
      width: 28,
      height: 28,
      borderRadius: 999,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    postRouteDirectionChipRegular: {
      backgroundColor: "#EEF2FF",
      borderColor: "#C7D2FE",
    },
    postRouteDirectionChipOneTime: {
      backgroundColor: "#F8FAFC",
      borderColor: "#CBD5E1",
    },
    postRouteDirectionIcon: {
      opacity: 0.92,
    },
    postRouteTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    postRouteTimeText: {
      color: colors.subtext,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.1,
    },
  }) satisfies StyleMap;
