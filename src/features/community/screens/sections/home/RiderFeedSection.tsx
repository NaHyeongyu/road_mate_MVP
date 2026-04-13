import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";
import { getNoticeDayDelta, getPostSaveKey } from "../../../utils/storage";
import { RiderSearchField } from "./RiderSearchField";
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
  const isNoticeFilter = filter === "one_time";
  const [noticeScope, setNoticeScope] = useState<"upcoming" | "all">("upcoming");
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const riderVisiblePosts = useMemo(
    () => visiblePosts.filter((post) => post.ownerUserId !== currentUserId),
    [currentUserId, visiblePosts]
  );
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

  useEffect(() => {
    if (!isNoticeFilter) {
      setNoticeScope("upcoming");
    }
  }, [isNoticeFilter]);

  const handleToggleFeedType = () => {
    onFilterChange(isNoticeFilter ? "regular" : "one_time");
  };

  const pastNoticeCount = useMemo(() => {
    if (!isNoticeFilter) {
      return 0;
    }

    return riderVisiblePosts.filter((post) => {
      const dayDelta = getNoticeDayDelta(post.noticeDate, post.createdAt);
      return dayDelta !== null && dayDelta < 0;
    }).length;
  }, [isNoticeFilter, riderVisiblePosts]);

  const feedPosts = useMemo(() => {
    if (!isNoticeFilter || noticeScope === "all") {
      return riderVisiblePosts;
    }

    return riderVisiblePosts.filter((post) => {
      const dayDelta = getNoticeDayDelta(post.noticeDate, post.createdAt);
      return dayDelta === null || dayDelta >= 0;
    });
  }, [isNoticeFilter, noticeScope, riderVisiblePosts]);
  const showViewNoticesAction = !isNoticeFilter;

  return (
    <>
      <View style={styles.routeFilterRow}>
        <Pressable
          onPress={() => onFilterChange("regular")}
          style={({ pressed }) => [
            styles.routeFilterItem,
            filter === "regular" ? styles.routeFilterItemActive : null,
            pressed ? styles.routeFilterItemPressed : null,
          ]}
        >
          <MaterialCommunityIcons
            color={filter === "regular" ? colors.brandText : colors.subtext}
            name="calendar-week"
            size={16}
          />
          <Text
            style={[
              styles.routeFilterItemText,
              filter === "regular" ? styles.routeFilterItemTextActive : null,
            ]}
          >
            Regular
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange("one_time")}
          style={({ pressed }) => [
            styles.routeFilterItem,
            filter === "one_time" ? styles.routeFilterItemActive : null,
            pressed ? styles.routeFilterItemPressed : null,
          ]}
        >
          <MaterialCommunityIcons
            color={filter === "one_time" ? colors.brandText : colors.subtext}
            name="clock-outline"
            size={16}
          />
          <Text
            style={[
              styles.routeFilterItemText,
              filter === "one_time" ? styles.routeFilterItemTextActive : null,
            ]}
          >
            Notices
          </Text>
        </Pressable>
      </View>

      {isNoticeFilter ? (
        <View style={styles.row}>
          <Pressable
            onPress={() => setNoticeScope("upcoming")}
            style={({ pressed }) => [
              styles.chip,
              noticeScope === "upcoming" ? styles.chipActive : null,
              pressed ? styles.routeFilterItemPressed : null,
            ]}
          >
            <Text style={[styles.chipText, noticeScope === "upcoming" ? styles.chipTextActive : null]}>
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setNoticeScope("all")}
            style={({ pressed }) => [
              styles.chip,
              noticeScope === "all" ? styles.chipActive : null,
              pressed ? styles.routeFilterItemPressed : null,
            ]}
          >
            <Text style={[styles.chipText, noticeScope === "all" ? styles.chipTextActive : null]}>
              All notices
            </Text>
          </Pressable>
        </View>
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
        <View style={styles.card}>
          <Text style={styles.empty}>
            {isNoticeFilter && noticeScope === "upcoming" && pastNoticeCount > 0
              ? "Only past notices match this filter or search."
              : isNoticeFilter
                ? "No notices match this filter or search."
                : "No rides match this filter or search."}
          </Text>
          {showViewNoticesAction ? (
            <View style={styles.postActionsRow}>
              {showViewNoticesAction ? (
                <Pressable style={styles.postActionSave} onPress={handleToggleFeedType}>
                  <MaterialCommunityIcons name="bullhorn-outline" size={15} color="#8A5A00" />
                  <Text style={styles.postActionSaveText}>View notices</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
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
