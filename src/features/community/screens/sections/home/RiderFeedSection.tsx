import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";
import { getQldPlaceSuggestions } from "../../../utils/placeQuickSearch";
import { getPostSaveKey } from "../../../utils/storage";

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
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const toInputRef = useRef<TextInput>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const fromSuggestions = useMemo(
    () => getQldPlaceSuggestions(fromSearchQuery),
    [fromSearchQuery]
  );
  const toSuggestions = useMemo(() => getQldPlaceSuggestions(toSearchQuery), [toSearchQuery]);

  const showFromSuggestions =
    activeField === "from" && fromSearchQuery.trim().length > 0 && fromSuggestions.length > 0;
  const showToSuggestions =
    activeField === "to" && toSearchQuery.trim().length > 0 && toSuggestions.length > 0;
  const hasSearchQuery = Boolean(fromSearchQuery.trim() || toSearchQuery.trim());

  const clearBlurTimeout = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const scheduleCloseSuggestions = (field: "from" | "to") => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setActiveField((prev) => (prev === field ? null : prev));
    }, 120);
  };

  useEffect(
    () => () => {
      clearBlurTimeout();
    },
    []
  );

  const handleSelectFromSuggestion = (value: string) => {
    clearBlurTimeout();
    onFromSearchQueryChange(value);
    setActiveField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    clearBlurTimeout();
    onToSearchQueryChange(value);
    setActiveField(null);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    clearBlurTimeout();
    onFromSearchQueryChange("");
    onToSearchQueryChange("");
    setActiveField(null);
    Keyboard.dismiss();
  };

  const handleResetToRegularFeed = () => {
    handleClearSearch();
    onFilterChange("regular");
  };

  const handleToggleFeedType = () => {
    onFilterChange(isNoticeFilter ? "regular" : "one_time");
  };

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

      <View style={styles.routeSearchGrid}>
        <View style={styles.routeSearchField}>
          <Text style={styles.routeSearchLabel}>From</Text>
          <View style={styles.routeSearchInput}>
            <TextInput
              value={fromSearchQuery}
              onChangeText={onFromSearchQueryChange}
              placeholder="e.g. Brisbane CBD, QLD"
              placeholderTextColor={colors.subtext}
              style={styles.routeSearchInputField}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => {
                clearBlurTimeout();
                setActiveField("from");
              }}
              onBlur={() => scheduleCloseSuggestions("from")}
              onSubmitEditing={() => toInputRef.current?.focus()}
            />
            {fromSearchQuery.trim() ? (
              <Pressable
                style={styles.routeSearchClearButton}
                onPress={() => {
                  onFromSearchQueryChange("");
                  setActiveField("from");
                }}
              >
                <MaterialCommunityIcons name="close-circle" size={18} color="#64748B" />
              </Pressable>
            ) : null}
          </View>
          {showFromSuggestions ? (
            <View style={styles.routeSuggestionsPanel}>
              {fromSuggestions.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPressIn={() => handleSelectFromSuggestion(suggestion)}
                  style={({ pressed }) => [
                    styles.routeSuggestionItem,
                    pressed ? styles.routeSuggestionItemPressed : null,
                  ]}
                >
                  <Text style={styles.routeSuggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.routeSearchField}>
          <Text style={styles.routeSearchLabel}>To</Text>
          <View style={styles.routeSearchInput}>
            <TextInput
              ref={toInputRef}
              value={toSearchQuery}
              onChangeText={onToSearchQueryChange}
              placeholder="e.g. St Lucia, QLD"
              placeholderTextColor={colors.subtext}
              style={styles.routeSearchInputField}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
              onFocus={() => {
                clearBlurTimeout();
                setActiveField("to");
              }}
              onBlur={() => scheduleCloseSuggestions("to")}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {toSearchQuery.trim() ? (
              <Pressable
                style={styles.routeSearchClearButton}
                onPress={() => {
                  onToSearchQueryChange("");
                  setActiveField("to");
                }}
              >
                <MaterialCommunityIcons name="close-circle" size={18} color="#64748B" />
              </Pressable>
            ) : null}
          </View>
          {showToSuggestions ? (
            <View style={styles.routeSuggestionsPanel}>
              {toSuggestions.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPressIn={() => handleSelectToSuggestion(suggestion)}
                  style={({ pressed }) => [
                    styles.routeSuggestionItem,
                    pressed ? styles.routeSuggestionItemPressed : null,
                  ]}
                >
                  <Text style={styles.routeSuggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {visiblePosts.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.empty}>
            {isNoticeFilter ? "No notices match this filter or search." : "No rides match this filter or search."}
          </Text>
          <View style={styles.postActionsRow}>
            {hasSearchQuery ? (
              <Pressable style={styles.postActionInfo} onPress={handleClearSearch}>
                <MaterialCommunityIcons name="close-circle-outline" size={15} color="#1D4ED8" />
                <Text style={styles.postActionInfoText}>Clear search</Text>
              </Pressable>
            ) : null}
            <Pressable
              style={styles.postActionSave}
              onPress={hasSearchQuery || isNoticeFilter ? handleResetToRegularFeed : handleToggleFeedType}
            >
              <MaterialCommunityIcons
                name={hasSearchQuery || isNoticeFilter ? "refresh" : "bullhorn-outline"}
                size={15}
                color="#8A5A00"
              />
              <Text style={styles.postActionSaveText}>
                {hasSearchQuery || isNoticeFilter ? "Back to regular feed" : "View notices"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        visiblePosts.map((post) => (
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
