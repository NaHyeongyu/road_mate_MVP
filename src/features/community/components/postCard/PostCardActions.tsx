import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../ui/types";

type PostCardActionsProps = {
  styles: AppStyles;
  isSaved: boolean;
  onToggleSave?: () => void;
  onDelete?: () => void;
};

export function PostCardActions({
  styles,
  isSaved,
  onToggleSave,
  onDelete,
}: PostCardActionsProps) {
  if (!onDelete && !onToggleSave) {
    return null;
  }

  return (
    <View style={styles.postActionsRow}>
      {onDelete ? (
        <Pressable style={styles.postActionDanger} onPress={onDelete}>
          <MaterialCommunityIcons name="trash-can-outline" size={15} color="#991B1B" />
          <Text style={styles.postActionDangerText}>Delete</Text>
        </Pressable>
      ) : null}
      {onToggleSave ? (
        <Pressable
          style={[styles.postActionSave, isSaved ? styles.postActionSaveActive : null]}
          onPress={onToggleSave}
        >
          <MaterialCommunityIcons
            name={isSaved ? "bookmark-check-outline" : "bookmark-plus-outline"}
            size={15}
            color={isSaved ? "#0D274A" : "#8A5A00"}
          />
          <Text style={[styles.postActionSaveText, isSaved ? styles.postActionSaveTextActive : null]}>
            {isSaved ? "Saved" : "Save"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
