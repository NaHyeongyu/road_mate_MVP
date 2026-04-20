import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { useAppColors } from "../../../../ui/useAppColors";
import { toContactLinkLabel } from "../../utils/contactLink";
import { openContactLink, openPhoneDialer } from "./linking";

type PostCardContactRowProps = {
  post: RoutePost;
  styles: AppStyles;
};

export function PostCardContactRow({ post, styles }: PostCardContactRowProps) {
  const colors = useAppColors();

  if (!post.contactPhone && !post.contactLink) {
    return null;
  }

  return (
    <View style={styles.postContactRow}>
      {post.contactPhone ? (
        <Pressable style={styles.postContactAction} onPress={() => openPhoneDialer(post.contactPhone)}>
          <MaterialCommunityIcons name="phone-outline" size={14} color={colors.accent} />
          <Text numberOfLines={1} style={styles.postContactActionText}>
            {post.contactPhone}
          </Text>
        </Pressable>
      ) : null}
      {post.contactLink ? (
        <Pressable style={styles.postContactAction} onPress={() => openContactLink(post.contactLink)}>
          <MaterialCommunityIcons name="chat-outline" size={14} color={colors.accent} />
          <Text numberOfLines={1} style={styles.postContactActionText}>
            {toContactLinkLabel(post.contactLink)}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
