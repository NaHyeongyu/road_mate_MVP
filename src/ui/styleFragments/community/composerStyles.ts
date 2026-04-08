import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";

export const createCommunityComposerStyles = (colors: AppColors) =>
  ({
    scheduleGrid: {
      gap: 10,
      marginTop: 4,
    },
    scheduleCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panel,
      padding: 10,
      gap: 8,
    },
    scheduleCardLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: -0.1,
    },
    scheduleHint: {
      color: colors.subtext,
      fontSize: 12,
      lineHeight: 18,
      marginTop: -2,
    },
    timeFieldButton: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      minHeight: 52,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    timeFieldButtonPressed: {
      opacity: 0.8,
    },
    timeFieldButtonTextWrap: {
      flex: 1,
      gap: 2,
    },
    timeFieldButtonValue: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: -0.2,
    },
    timeFieldButtonPlaceholder: {
      color: colors.subtext,
      fontWeight: "700",
    },
    timeFieldButtonHint: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "600",
    },
    routeComposerDivider: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 2,
      paddingTop: 12,
    },
    timePickerInlineCard: {
      marginTop: 4,
      gap: 10,
    },
    timePickerInlineHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    timePickerInlineTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: -0.2,
    },
    timePickerInlineActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    timePickerInlineActionButton: {
      minHeight: 32,
      minWidth: 54,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      paddingHorizontal: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    timePickerInlineActionText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
    },
    input: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.panelAlt,
      color: colors.text,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
    },
    multiline: {
      minHeight: 86,
      textAlignVertical: "top",
    },
    primaryButton: {
      marginTop: 6,
      backgroundColor: colors.brand,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },
    authPrimaryButton: {
      marginTop: 10,
    },
    primaryButtonDisabled: {
      opacity: 0.64,
    },
    backToOptionsButton: {
      alignSelf: "center",
      marginTop: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    backToOptionsText: {
      color: colors.subtext,
      fontSize: 13,
      fontWeight: "700",
    },
    primaryButtonText: {
      color: colors.brandText,
      fontSize: 15,
      fontWeight: "800",
    },
    dangerButton: {
      marginTop: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#FECACA",
      backgroundColor: "#FEF2F2",
      paddingVertical: 14,
      alignItems: "center",
    },
    dangerButtonText: {
      color: "#991B1B",
      fontSize: 15,
      fontWeight: "800",
    },
    savedBlock: {
      marginTop: 8,
      backgroundColor: colors.panelAlt,
      borderRadius: 16,
      padding: 14,
      gap: 6,
    },
    savedTitle: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    savedValue: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    savedNote: {
      color: colors.subtext,
      fontSize: 14,
      lineHeight: 20,
    },
    empty: {
      color: colors.subtext,
      fontSize: 14,
      lineHeight: 20,
    },
  }) satisfies StyleMap;
