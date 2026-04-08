import { Text, View } from "react-native";

import type { RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";

type DriverMyPostsSectionProps = {
  styles: AppStyles;
  title: string;
  myPosts: RoutePost[];
  onRemoveRoute: (id: string) => void;
};

export function DriverMyPostsSection({
  styles,
  title,
  myPosts,
  onRemoveRoute,
}: DriverMyPostsSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {myPosts.length === 0 ? (
        <Text style={styles.empty}>No routes posted yet.</Text>
      ) : (
        myPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            styles={styles}
            isOwnedByCurrentUser
            onDelete={() => onRemoveRoute(post.id)}
          />
        ))
      )}
    </View>
  );
}
