import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../../ui/types";

type InlinePickerCardProps = {
  styles: AppStyles;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

export function InlinePickerCard({
  styles,
  title,
  onCancel,
  onConfirm,
  children,
}: InlinePickerCardProps) {
  return (
    <View style={styles.timePickerInlineCard}>
      <View style={styles.timePickerInlineHeader}>
        <Text style={styles.timePickerInlineTitle}>{title}</Text>
        <View style={styles.timePickerInlineActions}>
          <Pressable style={styles.timePickerInlineActionButton} onPress={onCancel}>
            <Text style={styles.timePickerInlineActionText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.timePickerInlineActionButton} onPress={onConfirm}>
            <Text style={styles.timePickerInlineActionText}>Done</Text>
          </Pressable>
        </View>
      </View>
      {children}
    </View>
  );
}
