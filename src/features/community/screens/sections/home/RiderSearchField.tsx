import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { RefObject } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { AppStyles } from "../../../../../ui/types";

type RiderSearchFieldProps = {
  colors: AppColors;
  styles: AppStyles;
  label: string;
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
      <View style={styles.routeSearchInput}>
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
          <Pressable style={styles.routeSearchClearButton} onPress={onClear}>
            <MaterialCommunityIcons name="close-circle" size={18} color="#64748B" />
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
              <Text style={styles.routeSuggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
