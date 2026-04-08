import { useMemo } from "react";

import type { RoutePost } from "../../../model";
import { SEED_POSTS } from "../../../seed";
import { getPostSaveKey, sortByNewest } from "../utils/storage";
import type { Filter } from "../types";

type UseCommunityCollectionsArgs = {
  currentUserId: string;
  filter: Filter;
  fromSearchQuery: string;
  toSearchQuery: string;
  storedPosts: RoutePost[];
  savedPostKeys: string[];
};

const normalizeQuery = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTokens = (value: string) => normalizeQuery(value).split(" ").filter(Boolean);

const isVisibleToUser = (post: RoutePost, currentUserId: string) =>
  post.isPublic || post.ownerUserId === currentUserId;

const matchesTokens = (source: string, tokens: string[]) => {
  if (!tokens.length) {
    return true;
  }

  const normalizedSource = normalizeQuery(source);
  return tokens.every((token) => normalizedSource.includes(token));
};

export function useCommunityCollections({
  currentUserId,
  filter,
  fromSearchQuery,
  toSearchQuery,
  storedPosts,
  savedPostKeys,
}: UseCommunityCollectionsArgs) {
  const myPosts = useMemo(
    () =>
      currentUserId
        ? sortByNewest(storedPosts.filter((post) => post.ownerUserId === currentUserId))
        : [],
    [currentUserId, storedPosts]
  );

  const allPosts = useMemo(() => sortByNewest([...SEED_POSTS, ...storedPosts]), [storedPosts]);
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const fromTokens = useMemo(() => toTokens(fromSearchQuery), [fromSearchQuery]);
  const toTokensQuery = useMemo(() => toTokens(toSearchQuery), [toSearchQuery]);

  const savedPosts = useMemo(
    () =>
      allPosts.filter(
        (post) => savedPostKeySet.has(getPostSaveKey(post)) && isVisibleToUser(post, currentUserId)
      ),
    [allPosts, currentUserId, savedPostKeySet]
  );

  const visiblePosts = useMemo(
    () =>
      allPosts.filter((post) => {
        if (post.kind !== filter) {
          return false;
        }

        if (!isVisibleToUser(post, currentUserId)) {
          return false;
        }

        const matchesFrom = matchesTokens(post.from, fromTokens);
        if (!matchesFrom) {
          return false;
        }

        const matchesTo = matchesTokens(post.to, toTokensQuery);
        return matchesTo;
      }),
    [allPosts, filter, fromTokens, toTokensQuery]
  );

  return {
    myPosts,
    savedPostKeySet,
    savedPosts,
    visiblePosts,
  };
}
