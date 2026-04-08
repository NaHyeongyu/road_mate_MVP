import { Pressable, Text, View } from "react-native";
import type { AppStyles } from "../../../ui/types";

type LeftActionType = "text" | "back";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  leftActionType?: LeftActionType;
  leftActionLabel?: string;
  onLeftActionPress?: () => void;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
  styles: AppStyles;
};

export function ScreenHeader({
  title,
  subtitle,
  leftActionType = "text",
  leftActionLabel,
  onLeftActionPress,
  rightActionLabel,
  onRightActionPress,
  styles,
}: ScreenHeaderProps) {
  const isBackAction = leftActionType === "back";

  return (
    <View style={styles.appBar}>
      <View style={styles.appBarSide}>
        {leftActionLabel && onLeftActionPress ? (
          <Pressable
            style={({ pressed }) => [styles.appBarAction, pressed ? styles.appBarActionPressed : null]}
            onPress={onLeftActionPress}
          >
            {isBackAction ? <Text style={styles.appBarBackIcon}>‹</Text> : null}
            <Text style={styles.appBarActionText}>{leftActionLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.appBarSpacer} />
        )}
      </View>

      <View style={styles.appBarCenter}>
        <Text numberOfLines={1} style={styles.appBarTitle}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.appBarSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.appBarSide, styles.appBarSideRight]}>
        {rightActionLabel && onRightActionPress ? (
          <Pressable
            style={({ pressed }) => [styles.appBarAction, pressed ? styles.appBarActionPressed : null]}
            onPress={onRightActionPress}
          >
            <Text style={styles.appBarActionText}>{rightActionLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.appBarSpacer} />
        )}
      </View>
    </View>
  );
}
