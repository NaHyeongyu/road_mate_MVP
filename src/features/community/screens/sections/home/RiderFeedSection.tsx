import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";
import { getPostSaveKey } from "../../../utils/storage";
import { RiderFeedEmptyState } from "./RiderFeedEmptyState";
import { RiderSearchField } from "./RiderSearchField";
import { RiderFeedTypeTabs } from "./RiderFeedTypeTabs";
import { RiderNoticeScopeChips } from "./RiderNoticeScopeChips";
import { RiderStateFilterSelect } from "./RiderStateFilterSelect";
import { useRiderFeedViewState } from "./useRiderFeedViewState";
import { useRiderSearchSuggestions } from "./useRiderSearchSuggestions";
import { STATE_FILTER_OPTIONS } from "../../../data/australianStates";
import { normalizeEnglishPlaceInput } from "../../../utils/placeInput";
import type { StateFilter } from "../../../types";

type RiderFeedSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  filter: RouteKind;
  stateFilter: StateFilter;
  fromSearchQuery: string;
  toSearchQuery: string;
  visiblePosts: RoutePost[];
  currentUserId: string;
  savedPostKeys: string[];
  onFilterChange: (filter: RouteKind) => void;
  onStateFilterChange: (value: StateFilter) => void;
  onFromSearchQueryChange: (value: string) => void;
  onToSearchQueryChange: (value: string) => void;
  onToggleSavedPost: (post: RoutePost) => void;
  isSearchResultsPageVisible: boolean;
  canLoadMoreSearchResults: boolean;
  onOpenSearchResultsPage: () => void;
  onCloseSearchResultsPage: () => void;
  onLoadMoreSearchResults: () => void;
};

export function RiderFeedSection({
  colors,
  styles,
  filter,
  stateFilter,
  fromSearchQuery,
  toSearchQuery,
  visiblePosts,
  currentUserId,
  savedPostKeys,
  onFilterChange,
  onStateFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onToggleSavedPost,
  isSearchResultsPageVisible,
  canLoadMoreSearchResults,
  onOpenSearchResultsPage,
  onCloseSearchResultsPage,
  onLoadMoreSearchResults,
}: RiderFeedSectionProps) {
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const hasStateSelected = stateFilter !== "ALL";
  const hasRoutePairQuery = Boolean(fromSearchQuery.trim() && toSearchQuery.trim());
  const isSearchReady = hasRoutePairQuery || hasStateSelected;
  const [hasSearchRequested, setHasSearchRequested] = useState(false);
  const toInputRef = useRef<TextInput>(null);
  const stateFilterLabel = useMemo(
    () => STATE_FILTER_OPTIONS.find((option) => option.value === stateFilter)?.label ?? "All states",
    [stateFilter]
  );
  const routeSummary = useMemo(() => {
    const fromLabel = fromSearchQuery.trim() || "Any origin";
    const toLabel = toSearchQuery.trim() || "Any destination";
    return `${fromLabel} → ${toLabel}`;
  }, [fromSearchQuery, toSearchQuery]);

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
    stateFilter,
    fromSearchQuery,
    toSearchQuery,
    toInputRef,
    onFromSearchQueryChange,
    onToSearchQueryChange,
  });

  const {
    isNoticeFilter,
    noticeScope,
    feedPosts: matchedFeedPosts,
    pastNoticeCount,
    setNoticeScope,
  } = useRiderFeedViewState({
    filter,
    visiblePosts,
    currentUserId,
  });
  const feedPosts = hasSearchRequested && isSearchReady ? matchedFeedPosts : [];
  const isResultsPage = isSearchResultsPageVisible && hasSearchRequested && isSearchReady;

  useEffect(() => {
    setHasSearchRequested(false);
    onCloseSearchResultsPage();
  }, [filter, fromSearchQuery, onCloseSearchResultsPage, stateFilter, toSearchQuery]);

  const handleRunSearch = () => {
    if (!isSearchReady) {
      return;
    }

    setHasSearchRequested(true);
    onOpenSearchResultsPage();
    Keyboard.dismiss();
  };

  if (isResultsPage) {
    return (
      <>
        <View style={styles.routeResultsSummaryCard}>
          <Text style={styles.routeResultsSummaryText}>{routeSummary}</Text>
          <Text style={styles.routeResultsSummaryMeta}>{stateFilterLabel}</Text>
        </View>

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

        {feedPosts.length === 0 ? (
          <RiderFeedEmptyState
            styles={styles}
            isSearchReady={isSearchReady}
            hasSearchRequested={hasSearchRequested}
            isNoticeFilter={isNoticeFilter}
            noticeScope={noticeScope}
            pastNoticeCount={pastNoticeCount}
          />
        ) : (
          <>
            {feedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                styles={styles}
                isSaved={savedPostKeySet.has(getPostSaveKey(post))}
                onToggleSave={() => onToggleSavedPost(post)}
                extraContent={
                  post.note.trim() ? (
                    <View style={styles.postSummaryRow}>
                      <Text style={styles.postSummaryText}>Note</Text>
                      <Text numberOfLines={5} ellipsizeMode="tail" style={styles.postNote}>
                        {post.note.trim()}
                      </Text>
                    </View>
                  ) : undefined
                }
              />
            ))}
            {canLoadMoreSearchResults ? (
              <Pressable
                style={({ pressed }) => [
                  styles.routeSearchActionButton,
                  pressed ? styles.routeSearchActionButtonPressed : null,
                ]}
                onPress={onLoadMoreSearchResults}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={18} color={colors.heroText} />
                <Text style={styles.routeSearchActionButtonText}>Load more results</Text>
              </Pressable>
            ) : null}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <RiderFeedTypeTabs colors={colors} styles={styles} filter={filter} onFilterChange={onFilterChange} />

      <View style={styles.routeSearchGrid}>
        <RiderStateFilterSelect
          colors={colors}
          styles={styles}
          stateFilter={stateFilter}
          onStateFilterChange={onStateFilterChange}
        />

        <RiderSearchField
          colors={colors}
          styles={styles}
          label="From"
          leadingIconName="map-marker-outline"
          value={fromSearchQuery}
          placeholder="e.g. Collingwood, VIC 3066"
          suggestions={fromSuggestions}
          showSuggestions={showFromSuggestions}
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={(value) => onFromSearchQueryChange(normalizeEnglishPlaceInput(value))}
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
          leadingIconName="map-marker"
          value={toSearchQuery}
          placeholder="e.g. Perth, WA 6000"
          suggestions={toSuggestions}
          showSuggestions={showToSuggestions}
          returnKeyType="search"
          inputRef={toInputRef}
          onChangeText={(value) => onToSearchQueryChange(normalizeEnglishPlaceInput(value))}
          onFocus={handleToFocus}
          onBlur={handleToBlur}
          onSubmitEditing={() => {
            handleRunSearch();
          }}
          onClear={handleClearTo}
          onSelectSuggestion={handleSelectToSuggestion}
        />

        <Pressable
          style={({ pressed }) => [
            styles.routeSearchActionButton,
            !isSearchReady ? styles.routeSearchActionButtonDisabled : null,
            pressed ? styles.routeSearchActionButtonPressed : null,
          ]}
          disabled={!isSearchReady}
          onPress={handleRunSearch}
        >
          <MaterialCommunityIcons
            name={isNoticeFilter ? "bell-outline" : "magnify"}
            size={18}
            color={colors.heroText}
          />
          <Text style={styles.routeSearchActionButtonText}>
            {isNoticeFilter ? "Search notices" : "Search rides"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
