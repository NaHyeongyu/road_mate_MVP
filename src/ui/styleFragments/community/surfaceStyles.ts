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
      width: "100%",
      gap: 10,
    },
    routeSearchGrid: {
      gap: 12,
    },
    routeSearchField: {
      gap: 6,
    },
    routeSearchLabel: {
      color: colors.subtext,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginLeft: 2,
    },
    routeSearchInput: {
      minHeight: 50,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      paddingHorizontal: 2,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    routeSearchInputActive: {
      borderColor: colors.heroRing,
      shadowOpacity: 0.12,
    },
    routeSearchInputPressed: {
      opacity: 0.88,
    },
    routeSearchInputLeadingIcon: {
      width: 32,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    routeSearchInputField: {
      flex: 1,
      color: colors.text,
      paddingHorizontal: 8,
      fontSize: 15,
      fontWeight: "600",
    },
    routeSearchClearButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 4,
    },
    routeSuggestionsPanel: {
      marginTop: 8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panel,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
      overflow: "hidden",
    },
    routeSuggestionItem: {
      minHeight: 44,
      justifyContent: "center",
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    routeSuggestionItemSelected: {
      backgroundColor: colors.panelAlt,
    },
    routeSuggestionItemPressed: {
      opacity: 0.72,
    },
    routeSuggestionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    routeSuggestionText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
      flex: 1,
    },
    routeSuggestionTextSelected: {
      color: colors.hero,
    },
    routeSuggestionAccessory: {
      width: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    routeSearchActionButton: {
      marginTop: 2,
      minHeight: 50,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.heroRing,
      backgroundColor: colors.hero,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      shadowColor: colors.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 3,
    },
    routeSearchActionButtonPressed: {
      opacity: 0.88,
    },
    routeSearchActionButtonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    routeSearchActionButtonText: {
      color: colors.heroText,
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 0.1,
    },
    routeResultsSummaryCard: {
      marginTop: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 4,
    },
    routeResultsSummaryText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
    routeResultsSummaryMeta: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    routeSearchEmptyText: {
      color: colors.subtext,
      fontSize: 14,
      lineHeight: 20,
      paddingHorizontal: 2,
    },
    routeFilterItem: {
      flex: 1,
      minHeight: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 16,
    },
    routeFilterItemActive: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    routeFilterItemPressed: {
      opacity: 0.86,
    },
    routeFilterItemText: {
      color: colors.subtext,
      fontSize: 14,
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
