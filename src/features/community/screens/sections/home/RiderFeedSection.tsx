import { useMemo, useRef } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";
import { getPostSaveKey } from "../../../utils/storage";
import { RiderFeedEmptyState } from "./RiderFeedEmptyState";
import { RiderSearchField } from "./RiderSearchField";
import { RiderFeedTypeTabs } from "./RiderFeedTypeTabs";
import { RiderNoticeScopeChips } from "./RiderNoticeScopeChips";
import { useRiderFeedViewState } from "./useRiderFeedViewState";
import { useRiderSearchSuggestions } from "./useRiderSearchSuggestions";

type RiderFeedSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  filter: RouteKind;
  fromSearchQuery: string;
  toSearchQuery: string;
  visiblePosts: RoutePost[];
  currentUserId: string;
  savedPostKeys: string[];
  onFilterChange: (filter: RouteKind) => void;
  onFromSearchQueryChange: (value: string) => void;
  onToSearchQueryChange: (value: string) => void;
  onToggleSavedPost: (post: RoutePost) => void;
};

export function RiderFeedSection({
  colors,
  styles,
  filter,
  fromSearchQuery,
  toSearchQuery,
  visiblePosts,
  currentUserId,
  savedPostKeys,
  onFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onToggleSavedPost,
}: RiderFeedSectionProps) {
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const toInputRef = useRef<TextInput>(null);

  const {
    fromSuggestions,
    toSuggestions,
    showFromSuggestions,
    showToSuggestions,
    handleFromFocus,
    handleToFocus,
    handleFromBlur,
    handleToBlur,
    handleClearFrom,
    handleClearTo,
    handleSelectFromSuggestion,
    handleSelectToSuggestion,
  } = useRiderSearchSuggestions({
    fromSearchQuery,
    toSearchQuery,
    toInputRef,
    onFromSearchQueryChange,
    onToSearchQueryChange,
  });

  const {
    isNoticeFilter,
    noticeScope,
    feedPosts,
    pastNoticeCount,
    showViewNoticesAction,
    setNoticeScope,
    handleToggleFeedType,
  } = useRiderFeedViewState({
    filter,
    visiblePosts,
    currentUserId,
    onFilterChange,
  });

  return (
    <>
      <RiderFeedTypeTabs colors={colors} styles={styles} filter={filter} onFilterChange={onFilterChange} />

      {isNoticeFilter ? (
        <RiderNoticeScopeChips
          styles={styles}
          noticeScope={noticeScope}
          onNoticeScopeChange={setNoticeScope}
        />
      ) : null}

      {isNoticeFilter && noticeScope === "upcoming" && pastNoticeCount > 0 ? (
        <Text style={styles.cardBody}>{pastNoticeCount} past notices are hidden.</Text>
      ) : null}

      <View style={styles.routeSearchGrid}>
        <RiderSearchField
          colors={colors}
          styles={styles}
          label="From"
          value={fromSearchQuery}
          placeholder="e.g. Brisbane CBD, QLD"
          suggestions={fromSuggestions}
          showSuggestions={showFromSuggestions}
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={onFromSearchQueryChange}
          onFocus={handleFromFocus}
          onBlur={handleFromBlur}
          onSubmitEditing={() => toInputRef.current?.focus()}
          onClear={handleClearFrom}
          onSelectSuggestion={handleSelectFromSuggestion}
        />

        <RiderSearchField
          colors={colors}
          styles={styles}
          label="To"
          value={toSearchQuery}
          placeholder="e.g. St Lucia, QLD"
          suggestions={toSuggestions}
          showSuggestions={showToSuggestions}
          returnKeyType="search"
          inputRef={toInputRef}
          onChangeText={onToSearchQueryChange}
          onFocus={handleToFocus}
          onBlur={handleToBlur}
          onSubmitEditing={() => Keyboard.dismiss()}
          onClear={handleClearTo}
          onSelectSuggestion={handleSelectToSuggestion}
        />
      </View>

      {feedPosts.length === 0 ? (
        <RiderFeedEmptyState
          styles={styles}
          isNoticeFilter={isNoticeFilter}
          noticeScope={noticeScope}
          pastNoticeCount={pastNoticeCount}
          showViewNoticesAction={showViewNoticesAction}
          onPressViewNotices={handleToggleFeedType}
        />
      ) : (
        feedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            styles={styles}
            isSaved={savedPostKeySet.has(getPostSaveKey(post))}
            onToggleSave={() => onToggleSavedPost(post)}
          />
        ))
      )}
    </>
  );
}
