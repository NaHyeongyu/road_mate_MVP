import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../ui/types";
import { useAppColors } from "../../../ui/useAppColors";
import type { Mode } from "../types";

type RoleModeToggleProps = {
  mode: Mode;
  onChangeMode: (mode: Mode) => void;
  styles: AppStyles;
};

const TOGGLE_TRAVEL_DISTANCE = 110;

export function RoleModeToggle({ mode, onChangeMode, styles }: RoleModeToggleProps) {
  const copy = useAppCopy();
  const colors = useAppColors();
  const modeAnim = useRef(new Animated.Value(mode === "rider" ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(modeAnim, {
      toValue: mode === "rider" ? 0 : 1,
      damping: 20,
      stiffness: 190,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [mode, modeAnim]);

  const thumbTranslateX = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOGGLE_TRAVEL_DISTANCE],
  });
  const riderContentOpacity = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.78],
  });
  const riderContentScale = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });
  const driverContentOpacity = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1],
  });
  const driverContentScale = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });

  const isRiderActive = mode === "rider";
  const isDriverActive = mode === "driver";

  return (
    <View style={styles.roleToggleShell}>
      <View pointerEvents="none" style={styles.roleToggleHighlight} />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.roleToggleThumb,
          {
            transform: [{ translateX: thumbTranslateX }],
          },
        ]}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isRiderActive, selected: isRiderActive }}
        disabled={isRiderActive}
        onPress={() => onChangeMode("rider")}
        style={({ pressed }) => [styles.roleToggleItem, !isRiderActive && pressed ? styles.roleToggleItemPressed : null]}
      >
        <Animated.View
          style={[
            styles.roleToggleItemContent,
            {
              opacity: riderContentOpacity,
              transform: [{ scale: riderContentScale }],
            },
          ]}
        >
          <Ionicons
            color={isRiderActive ? colors.brandText : colors.text}
            name="person"
            size={16}
          />
          <Text
            style={[
              styles.roleToggleText,
              isRiderActive ? styles.roleToggleTextActive : styles.roleToggleTextInactive,
            ]}
          >
            {copy.common.rider}
          </Text>
        </Animated.View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDriverActive, selected: isDriverActive }}
        disabled={isDriverActive}
        onPress={() => onChangeMode("driver")}
        style={({ pressed }) => [styles.roleToggleItem, !isDriverActive && pressed ? styles.roleToggleItemPressed : null]}
      >
        <Animated.View
          style={[
            styles.roleToggleItemContent,
            {
              opacity: driverContentOpacity,
              transform: [{ scale: driverContentScale }],
            },
          ]}
        >
          <Text
            style={[
              styles.roleToggleText,
              isDriverActive ? styles.roleToggleTextActive : styles.roleToggleTextInactive,
            ]}
          >
            {copy.common.driver}
          </Text>
          <FontAwesome6
            color={isDriverActive ? colors.brandText : colors.text}
            name="car"
            size={15}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}
