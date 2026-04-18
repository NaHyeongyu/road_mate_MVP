import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../ui/types";

type PostCardActionsProps = {
  styles: AppStyles;
  onDelete?: () => void;
};

export function PostCardActions({ styles, onDelete }: PostCardActionsProps) {
  const copy = useAppCopy();

  if (!onDelete) {
    return null;
  }

  return (
    <View style={styles.postActionsRow}>
      {onDelete ? (
        <Pressable style={styles.postActionDanger} onPress={onDelete}>
          <MaterialCommunityIcons name="trash-can-outline" size={15} color="#991B1B" />
          <Text style={styles.postActionDangerText}>{copy.common.delete}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
