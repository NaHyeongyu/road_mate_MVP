import type { RoutePost } from "../../../model";
import { getPostSaveKey } from "./storage";

export const getSavedPostKeysWithoutOwnPosts = ({
  currentUserId,
  savedPostKeys,
  storedPosts,
}: {
  currentUserId: string;
  savedPostKeys: string[];
  storedPosts: RoutePost[];
}) => {
  if (!currentUserId || !savedPostKeys.length) {
    return savedPostKeys;
  }

  const ownPostKeys = new Set(
    storedPosts
      .filter((post) => post.ownerUserId === currentUserId)
      .map((post) => getPostSaveKey(post))
  );
  if (!ownPostKeys.size) {
    return savedPostKeys;
  }

  return savedPostKeys.filter((key) => !ownPostKeys.has(key));
};
