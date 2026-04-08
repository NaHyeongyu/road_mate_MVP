import { useMemo } from "react";
import { Text, View } from "react-native";

import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { PostCard } from "../../components/PostCard";
import { getPostSaveKey } from "../../utils/storage";

type SavedTabSectionProps = {
  styles: AppStyles;
  isRiderMode: boolean;
  savedPosts: RoutePost[];
  currentUserId: string;
  savedPostKeys: string[];
  onToggleSavedPost: (post: RoutePost) => void;
};

export function SavedTabSection({
  styles,
  isRiderMode,
  savedPosts,
  currentUserId,
  savedPostKeys,
  onToggleSavedPost,
}: SavedTabSectionProps) {
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);

  if (!isRiderMode) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saved rides</Text>
        <Text style={styles.cardBody}>Saved is available in rider mode only.</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saved rides</Text>
        <Text style={styles.cardBody}>Total saved: {savedPosts.length}</Text>
      </View>

      {savedPosts.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardBody}>No saved rides yet.</Text>
        </View>
      ) : (
        savedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            styles={styles}
            isOwnedByCurrentUser={post.ownerUserId === currentUserId}
            isSaved={savedPostKeySet.has(getPostSaveKey(post))}
            onToggleSave={() => onToggleSavedPost(post)}
          />
        ))
      )}
    </>
  );
}
