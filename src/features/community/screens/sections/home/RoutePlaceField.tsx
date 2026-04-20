import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputProps,
  type TextInputSubmitEditingEventData,
} from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { AppStyles } from "../../../../../ui/types";
import { Label } from "../../../../shared/components/Label";

type RoutePlaceFieldProps = {
  colors: AppColors;
  styles: AppStyles;
  label: string;
  value: string;
  placeholder: string;
  suggestions: string[];
  showSuggestions: boolean;
  inputRef?: React.RefObject<TextInput | null>;
  returnKeyType?: TextInputProps["returnKeyType"];
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitEditing: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  onClear: () => void;
  onSelectSuggestion: (value: string) => void;
};

export function RoutePlaceField({
  colors,
  styles,
  label,
  value,
  placeholder,
  suggestions,
  showSuggestions,
  inputRef,
  returnKeyType = "done",
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  onClear,
  onSelectSuggestion,
}: RoutePlaceFieldProps) {
  return (
    <View style={styles.routeSearchField}>
      <Label text={label} styles={styles} />
      <View style={[styles.routeSearchInput, showSuggestions ? styles.routeSearchInputActive : null]}>
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
          blurOnSubmit={false}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
        />
        {value.trim() ? (
          <Pressable style={styles.routeSearchClearButton} onPressIn={onClear}>
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.mutedIcon} />
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
