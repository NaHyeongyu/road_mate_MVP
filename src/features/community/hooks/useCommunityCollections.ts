import { useMemo } from "react";

import type { RoutePost } from "../../../model";
import { SEED_POSTS, isSeedPostCatalogEnabled } from "../../../seed";
import { getPostSaveKey, sortByNewest } from "../utils/storage";
import { matchesRoutePostStateFilter } from "../utils/stateFilter";
import type { Filter, StateFilter } from "../types";

type UseCommunityCollectionsArgs = {
  currentUserId: string;
  filter: Filter;
  stateFilter: StateFilter;
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

const toNoticeTimestamp = (post: RoutePost) => {
  const noticeDate = String(post.noticeDate ?? "").trim();
  if (!noticeDate) {
    const createdAt = Date.parse(post.createdAt);
    return Number.isFinite(createdAt) ? createdAt : 0;
  }

  const noticeTimestamp = Date.parse(`${noticeDate}T00:00:00`);
  if (Number.isFinite(noticeTimestamp)) {
    return noticeTimestamp;
  }

  const createdAt = Date.parse(post.createdAt);
  return Number.isFinite(createdAt) ? createdAt : 0;
};

const toLocationPriority = ({
  post,
  normalizedFromQuery,
  normalizedToQuery,
}: {
  post: RoutePost;
  normalizedFromQuery: string;
  normalizedToQuery: string;
}) => {
  const fromQueryExists = Boolean(normalizedFromQuery);
  const toQueryExists = Boolean(normalizedToQuery);
  const normalizedPostFrom = normalizeQuery(post.from);
  const normalizedPostTo = normalizeQuery(post.to);
  const isFromExact = fromQueryExists && normalizedPostFrom === normalizedFromQuery;
  const isToExact = toQueryExists && normalizedPostTo === normalizedToQuery;

  if (isFromExact && isToExact) {
    return 0;
  }

  if (isFromExact) {
    return 1;
  }

  if (isToExact) {
    return 2;
  }

  return 3;
};

export function useCommunityCollections({
  currentUserId,
  filter,
  stateFilter,
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

  const allPosts = useMemo(() => {
    const sourcePosts = isSeedPostCatalogEnabled ? [...SEED_POSTS, ...storedPosts] : storedPosts;
    return sortByNewest(sourcePosts);
  }, [storedPosts]);
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const fromTokens = useMemo(() => toTokens(fromSearchQuery), [fromSearchQuery]);
  const toTokensQuery = useMemo(() => toTokens(toSearchQuery), [toSearchQuery]);
  const normalizedFromQuery = useMemo(() => normalizeQuery(fromSearchQuery), [fromSearchQuery]);
  const normalizedToQuery = useMemo(() => normalizeQuery(toSearchQuery), [toSearchQuery]);
  const hasPairSearch = fromTokens.length > 0 && toTokensQuery.length > 0;
  const hasStateFilter = stateFilter !== "ALL";
  const isSearchReady = hasPairSearch || hasStateFilter;

  const savedPosts = useMemo(
    () =>
      allPosts.filter(
        (post) => savedPostKeySet.has(getPostSaveKey(post)) && isVisibleToUser(post, currentUserId)
      ),
    [allPosts, currentUserId, savedPostKeySet]
  );

  const visiblePosts = useMemo(
    () => {
      if (!isSearchReady) {
        return [];
      }

      const filtered = allPosts.filter((post) => {
        if (post.kind !== filter) {
          return false;
        }

        if (!isVisibleToUser(post, currentUserId)) {
          return false;
        }

        if (!matchesRoutePostStateFilter(post, stateFilter)) {
          return false;
        }

        const matchesFrom = matchesTokens(post.from, fromTokens);
        if (!matchesFrom) {
          return false;
        }

        const matchesTo = matchesTokens(post.to, toTokensQuery);
        return matchesTo;
      });
      return [...filtered].sort((left, right) => {
        const leftPriority = toLocationPriority({
          post: left,
          normalizedFromQuery,
          normalizedToQuery,
        });
        const rightPriority = toLocationPriority({
          post: right,
          normalizedFromQuery,
          normalizedToQuery,
        });
        const priorityDiff = leftPriority - rightPriority;
        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        if (filter === "one_time") {
          const timestampDiff = toNoticeTimestamp(right) - toNoticeTimestamp(left);
          if (timestampDiff !== 0) {
            return timestampDiff;
          }

          return right.createdAt.localeCompare(left.createdAt);
        }

        return 0;
      });
    },
    [
      allPosts,
      currentUserId,
      filter,
      fromTokens,
      isSearchReady,
      normalizedFromQuery,
      normalizedToQuery,
      stateFilter,
      toTokensQuery,
    ]
  );

  return {
    myPosts,
    savedPostKeySet,
    savedPosts,
    visiblePosts,
  };
}
