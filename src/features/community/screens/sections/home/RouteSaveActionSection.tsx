import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
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

export function RouteSaveActionSection({
  styles,
  isOneTimeRoute,
  isReadyToSave,
  isSubmitting,
  remainingRequiredCount,
  remainingRequiredText,
  onPress,
}: RouteSaveActionSectionProps) {
  const copy = useAppCopy();
  const buttonTitle = isSubmitting
    ? isOneTimeRoute
      ? copy.community.postingOneTimeNotice
      : copy.community.savingRegistration
    : isReadyToSave
      ? isOneTimeRoute
        ? copy.community.postOneTimeNotice
        : copy.community.saveRegistration
      : copy.community.completeRequiredItems(remainingRequiredCount);
  const buttonHint = isReadyToSave
    ? isOneTimeRoute
      ? copy.community.oneTimePublishButtonHint
      : copy.community.regularSaveButtonHint
    : "";
  const buttonIconName = isOneTimeRoute ? "bullhorn-outline" : "calendar-sync";

  return (
    <>
      {!isReadyToSave ? (
        <>
          <Text style={styles.cardBody}>
            {remainingRequiredText ||
              (isOneTimeRoute
                ? copy.community.fillRequiredOneTime
                : copy.community.fillRequiredRegistration)}
          </Text>
        </>
      ) : null}

      <Pressable
        style={[
          styles.noticeSubmitButton,
          !isReadyToSave || isSubmitting ? styles.noticeSubmitButtonDisabled : null,
        ]}
        disabled={!isReadyToSave || isSubmitting}
        onPress={onPress}
      >
        <View style={styles.noticeSubmitButtonMain}>
          <View style={styles.noticeSubmitButtonIconWrap}>
            <MaterialCommunityIcons name={buttonIconName} size={18} color="#0B0F14" />
          </View>
          <View style={styles.noticeSubmitButtonTextWrap}>
            <Text style={styles.noticeSubmitButtonTitle}>{buttonTitle}</Text>
            {buttonHint ? (
              <Text style={styles.noticeSubmitButtonCaption}>{buttonHint}</Text>
            ) : null}
          </View>
        </View>
        <MaterialCommunityIcons
          name={isSubmitting ? "loading" : "chevron-right"}
          size={20}
          color="#0B0F14"
        />
      </Pressable>
    </>
  );
}
