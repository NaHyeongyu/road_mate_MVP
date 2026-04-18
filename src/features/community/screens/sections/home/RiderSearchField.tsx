import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps, RefObject } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { AppStyles } from "../../../../../ui/types";

type RiderSearchFieldProps = {
  colors: AppColors;
  styles: AppStyles;
  label: string;
  leadingIconName?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  value: string;
  placeholder: string;
  suggestions: readonly string[];
  showSuggestions: boolean;
  returnKeyType: "next" | "search";
  inputRef?: RefObject<TextInput | null>;
  blurOnSubmit?: boolean;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitEditing: () => void;
  onClear: () => void;
  onSelectSuggestion: (value: string) => void;
};

export function RiderSearchField({
  colors,
  styles,
  label,
  leadingIconName,
  value,
  placeholder,
  suggestions,
  showSuggestions,
  returnKeyType,
  inputRef,
  blurOnSubmit,
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  onClear,
  onSelectSuggestion,
}: RiderSearchFieldProps) {
  return (
    <View style={styles.routeSearchField}>
      <Text style={styles.routeSearchLabel}>{label}</Text>
      <View style={[styles.routeSearchInput, showSuggestions ? styles.routeSearchInputActive : null]}>
        {leadingIconName ? (
          <View style={styles.routeSearchInputLeadingIcon}>
            <MaterialCommunityIcons name={leadingIconName} size={16} color={colors.subtext} />
          </View>
        ) : null}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.subtext}
          style={styles.routeSearchInputField}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
        />
        {value.trim() ? (
          <Pressable style={styles.routeSearchClearButton} onPressIn={onClear}>
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.subtext} />
          </Pressable>
        ) : null}
      </View>
      {showSuggestions ? (
        <View style={styles.routeSuggestionsPanel}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPressIn={() => onSelectSuggestion(suggestion)}
              style={({ pressed }) => [
                styles.routeSuggestionItem,
                pressed ? styles.routeSuggestionItemPressed : null,
              ]}
            >
              <View style={styles.routeSuggestionRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.subtext} />
                <Text style={styles.routeSuggestionText}>{suggestion}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
