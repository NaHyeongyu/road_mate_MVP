import { useMemo, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard, Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { AnimatedEntrance } from "../../../../shared/components/AnimatedEntrance";
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
  onOpenRouteDetailPage: (post: RoutePost) => void;
  onToggleSavedPost: (post: RoutePost) => void;
  isSearchResultsPageVisible: boolean;
  canLoadMoreSearchResults: boolean;
  onOpenSearchResultsPage: () => void;
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
  onOpenRouteDetailPage,
  onToggleSavedPost,
  isSearchResultsPageVisible,
  canLoadMoreSearchResults,
  onOpenSearchResultsPage,
  onLoadMoreSearchResults,
}: RiderFeedSectionProps) {
  const copy = useAppCopy();
  const { width } = useWindowDimensions();
  const isPhoneLayout = width < 430;
  const isCompactLayout = width < 390;
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const hasStateSelected = stateFilter !== "ALL";
  const hasRoutePairQuery = Boolean(fromSearchQuery.trim() && toSearchQuery.trim());
  const isSearchReady = hasRoutePairQuery || hasStateSelected;
  const toInputRef = useRef<TextInput>(null);
  const stateFilterLabel = useMemo(
    () =>
      STATE_FILTER_OPTIONS.find((option) => option.value === stateFilter)?.label ??
      copy.common.allStates,
    [copy.common.allStates, stateFilter]
  );
  const routeSummary = useMemo(() => {
    const fromLabel = fromSearchQuery.trim() || copy.common.anyOrigin;
    const toLabel = toSearchQuery.trim() || copy.common.anyDestination;
    return copy.community.searchScopeSummary(fromLabel, toLabel);
  }, [copy, fromSearchQuery, toSearchQuery]);

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
  const hasSearchRequested = isSearchResultsPageVisible;
  const feedPosts = isSearchResultsPageVisible && isSearchReady ? matchedFeedPosts : [];
  const isResultsPage = isSearchResultsPageVisible && isSearchReady;
  const searchStackStyle = [
    styles.riderSearchStack,
    isPhoneLayout ? styles.riderSearchStackCompact : null,
  ];
  const resultsStackStyle = [
    styles.riderResultsStack,
    isCompactLayout ? styles.riderResultsStackCompact : null,
  ];
  const feedListStyle = [
    styles.riderFeedList,
    isCompactLayout ? styles.riderFeedListCompact : null,
  ];
  const compactSearchGridStyle = isCompactLayout ? { gap: 10 } : null;
  const compactSummaryCardStyle = isCompactLayout
    ? {
        paddingHorizontal: 10,
        paddingVertical: 9,
      }
    : null;
  const compactSearchButtonStyle = isCompactLayout
    ? {
        minHeight: 48,
        borderRadius: 14,
      }
    : null;

  const handleRunSearch = () => {
    if (!isSearchReady) {
      return;
    }

    onOpenSearchResultsPage();
    Keyboard.dismiss();
  };

  if (isResultsPage) {
    return (
      <AnimatedEntrance delay={40} resetKey={`rider-results-${filter}-${stateFilter}`}>
        <View style={resultsStackStyle}>
          <View
            style={[
              styles.routeResultsSummaryCard,
              styles.riderResultsSummaryCard,
              compactSummaryCardStyle,
            ]}
          >
            <Text numberOfLines={2} style={styles.routeResultsSummaryText}>
              {routeSummary}
            </Text>
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
            <Text style={styles.riderResultsHelperText}>
              {copy.community.noticeHiddenByScope(pastNoticeCount)}
            </Text>
          ) : null}

          {feedPosts.length === 0 ? (
            <View style={styles.riderEmptyStateCard}>
              <RiderFeedEmptyState
                styles={styles}
                isSearchReady={isSearchReady}
                hasSearchRequested={hasSearchRequested}
                isNoticeFilter={isNoticeFilter}
                noticeScope={noticeScope}
                pastNoticeCount={pastNoticeCount}
              />
            </View>
          ) : (
            <View style={feedListStyle}>
              {feedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  styles={styles}
                  containerStyle={styles.riderFeedPostCard}
                  isSaved={savedPostKeySet.has(getPostSaveKey(post))}
                  onViewDetails={() => onOpenRouteDetailPage(post)}
                  onToggleSave={() => onToggleSavedPost(post)}
                  extraContent={
                    post.kind === "regular" && post.note.trim() ? (
                      <View style={styles.postSummaryRow}>
                        <Text style={styles.postSummaryText}>{copy.common.note}</Text>
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
                    compactSearchButtonStyle,
                    pressed ? styles.routeSearchActionButtonPressed : null,
                  ]}
                  onPress={onLoadMoreSearchResults}
                >
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={18}
                    color={colors.heroText}
                  />
                  <Text style={styles.routeSearchActionButtonText}>
                    {copy.common.loadMoreResults}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      </AnimatedEntrance>
    );
  }

  return (
    <AnimatedEntrance delay={40} resetKey={`rider-search-${filter}`} style={searchStackStyle}>
      <>
        <View style={styles.riderSearchIntro}>
          <Text style={styles.riderSearchTitle}>
            {isNoticeFilter ? copy.community.searchNotices : copy.community.searchRides}
          </Text>
        </View>

        <RiderFeedTypeTabs
          colors={colors}
          styles={styles}
          filter={filter}
          onFilterChange={onFilterChange}
        />

        <View style={[styles.riderSearchFieldsSection, styles.routeSearchGrid, compactSearchGridStyle]}>
          <RiderStateFilterSelect
            colors={colors}
            styles={styles}
            stateFilter={stateFilter}
            onStateFilterChange={onStateFilterChange}
          />

          <RiderSearchField
            colors={colors}
            styles={styles}
            label={copy.common.from}
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
            label={copy.common.to}
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
              compactSearchButtonStyle,
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
              {isNoticeFilter ? copy.community.searchNotices : copy.community.searchRides}
            </Text>
          </Pressable>
        </View>
      </>
    </AnimatedEntrance>
  );
}
