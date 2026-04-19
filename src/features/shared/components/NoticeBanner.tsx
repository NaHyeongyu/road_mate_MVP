import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppNotice } from "../../../app/types";
import type { AppStyles } from "../../../ui/types";

type NoticeBannerProps = {
  notice: AppNotice;
  styles: AppStyles;
};

export function NoticeBanner({ notice, styles }: NoticeBannerProps) {
  const insets = useSafeAreaInsets();
  const [activeNotice, setActiveNotice] = useState<AppNotice>(notice);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;

  useEffect(() => {
    if (!notice.text) {
      if (!activeNotice.text) {
        return;
      }

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -24,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setActiveNotice({ tone: "info", text: "" });
        }
      });
      return;
    }

    setActiveNotice(notice);
    opacity.setValue(0);
    translateY.setValue(-24);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeNotice.text, notice, opacity, translateY]);

  if (!activeNotice.text) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.noticeToastWrap,
        {
          top: insets.top + 18,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.noticeToast,
          activeNotice.tone === "success"
            ? styles.noticeSuccess
            : activeNotice.tone === "error"
              ? styles.noticeError
              : styles.noticeInfo,
        ]}
      >
        <Text style={styles.noticeText}>{activeNotice.text}</Text>
      </View>
    </Animated.View>
  );
}
