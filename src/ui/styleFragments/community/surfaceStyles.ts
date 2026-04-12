import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

const APP_BAR_ACTION_TEXT = "#2563EB";

export const createCommunitySurfaceStyles = (colors: AppColors) =>
  ({
    notice: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    noticeInfo: {
      backgroundColor: colors.info,
    },
    noticeSuccess: {
      backgroundColor: colors.success,
    },
    noticeError: {
      backgroundColor: colors.error,
    },
    noticeText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    card: {
      backgroundColor: colors.panel,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 22,
      padding: 18,
      gap: 10,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "800",
    },
    cardBody: {
      color: colors.subtext,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 2,
    },
    routeFilterRow: {
      flexDirection: "row",
      alignSelf: "flex-start",
      gap: 8,
    },
    routeSearchGrid: {
      gap: 8,
      marginTop: 2,
    },
    routeSearchField: {
      gap: 5,
    },
    routeSearchLabel: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.2,
    },
    routeSearchInput: {
      minHeight: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panel,
      paddingHorizontal: 2,
      flexDirection: "row",
      alignItems: "center",
    },
    routeSearchInputField: {
      flex: 1,
      color: colors.text,
      paddingHorizontal: 10,
      fontSize: 14,
      fontWeight: "600",
    },
    routeSearchClearButton: {
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
    },
    routeSuggestionsPanel: {
      marginTop: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      overflow: "hidden",
    },
    routeSuggestionItem: {
      minHeight: 40,
      justifyContent: "center",
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    routeSuggestionItemPressed: {
      opacity: 0.72,
    },
    routeSuggestionText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
    routeFilterItem: {
      minHeight: 42,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panel,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingHorizontal: 16,
    },
    routeFilterItemActive: {
      backgroundColor: colors.brand,
    },
    routeFilterItemPressed: {
      opacity: 0.82,
    },
    routeFilterItemText: {
      color: colors.subtext,
      fontSize: 13,
      fontWeight: "700",
    },
    routeFilterItemTextActive: {
      color: colors.brandText,
    },
    profileMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    profileMetaText: {
      flex: 1,
      marginBottom: 0,
    },
    inlineTextButton: {
      minHeight: 32,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    inlineTextButtonText: {
      color: APP_BAR_ACTION_TEXT,
      fontSize: 14,
      fontWeight: "700",
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
    },
    chipActive: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    chipText: {
      color: colors.subtext,
      fontSize: 13,
      fontWeight: "700",
    },
    chipTextActive: {
      color: colors.brandText,
    },
    driverRouteKindChip: {
      alignSelf: "flex-start",
      marginTop: -2,
    },
    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 4,
    },
    driverSimpleControlRow: {
      gap: 6,
    },
    driverSimpleControlLabel: {
      color: colors.subtext,
      fontSize: 13,
      fontWeight: "700",
    },
    driverControlBadgesRow: {
      flexDirection: "row",
      gap: 6,
      flexWrap: "wrap",
    },
    driverControlBadge: {
      minHeight: 36,
      paddingHorizontal: 12,
      gap: 6,
    },
    driverControlBadgeCompact: {
      minWidth: 36,
      paddingHorizontal: 0,
    },
    driverControlBadgeText: {
      fontSize: 13,
    },
  }) satisfies StyleMap;
