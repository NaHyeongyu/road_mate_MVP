import { Pressable, Text } from "react-native";

import type { AppStyles } from "../../../../../ui/types";

type RouteSaveActionSectionProps = {
  styles: AppStyles;
  isOneTimeRoute: boolean;
  isReadyToSave: boolean;
  isSubmitting: boolean;
  remainingRequiredCount: number;
  remainingRequiredText: string;
  onPress: () => void;
};

function toSaveActionLabel({
  isOneTimeRoute,
  isReadyToSave,
  isSubmitting,
  remainingRequiredCount,
}: {
  isOneTimeRoute: boolean;
  isReadyToSave: boolean;
  isSubmitting: boolean;
  remainingRequiredCount: number;
}) {
  if (isSubmitting) {
    return isOneTimeRoute ? "Posting one-time notice..." : "Saving registration...";
  }

  if (isReadyToSave) {
    return isOneTimeRoute ? "Post one-time notice" : "Save registration";
  }

  return `Complete ${remainingRequiredCount} required item${remainingRequiredCount > 1 ? "s" : ""}`;
}

export function RouteSaveActionSection({
  styles,
  isOneTimeRoute,
  isReadyToSave,
  isSubmitting,
  remainingRequiredCount,
  remainingRequiredText,
  onPress,
}: RouteSaveActionSectionProps) {
  return (
    <>
      {!isReadyToSave ? (
        <>
          <Text style={styles.cardBody}>
            {isOneTimeRoute
              ? "Fill required fields to post this one-time notice."
              : "Fill all required fields to save this registration."}
          </Text>
          {remainingRequiredText ? <Text style={styles.cardBody}>{remainingRequiredText}</Text> : null}
        </>
      ) : null}

      <Pressable
        style={[
          styles.primaryButton,
          !isReadyToSave || isSubmitting ? styles.primaryButtonDisabled : null,
        ]}
        disabled={!isReadyToSave || isSubmitting}
        onPress={onPress}
      >
        <Text style={styles.primaryButtonText}>
          {toSaveActionLabel({
            isOneTimeRoute,
            isReadyToSave,
            isSubmitting,
            remainingRequiredCount,
          })}
        </Text>
      </Pressable>
    </>
  );
}
