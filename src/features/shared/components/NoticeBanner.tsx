import { Text, View } from "react-native";

import type { AppStyles } from "../../../ui/types";

type NoticeTone = "info" | "success" | "error";

type NoticeBannerProps = {
  notice: { tone: NoticeTone; text: string };
  styles: AppStyles;
};

export function NoticeBanner({ notice, styles }: NoticeBannerProps) {
  if (!notice.text) {
    return null;
  }

  return (
    <View
      style={[
        styles.notice,
        notice.tone === "success"
          ? styles.noticeSuccess
          : notice.tone === "error"
            ? styles.noticeError
            : styles.noticeInfo,
      ]}
    >
      <Text style={styles.noticeText}>{notice.text}</Text>
    </View>
  );
}
