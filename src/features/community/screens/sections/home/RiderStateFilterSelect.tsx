import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { STATE_FILTER_OPTIONS } from "../../../data/australianStates";
import type { StateFilter } from "../../../types";
import type { AppColors } from "../../../../../brandTheme";
import type { AppStyles } from "../../../../../ui/types";

type RiderStateFilterSelectProps = {
  colors: AppColors;
  styles: AppStyles;
  stateFilter: StateFilter;
  onStateFilterChange: (value: StateFilter) => void;
};

export function RiderStateFilterSelect({
  colors,
  styles,
  stateFilter,
  onStateFilterChange,
}: RiderStateFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = useMemo(
    () => STATE_FILTER_OPTIONS.find((option) => option.value === stateFilter)?.label ?? "All states",
    [stateFilter]
  );

  return (
    <View style={styles.routeSearchField}>
      <Text style={styles.routeSearchLabel}>State</Text>

      <Pressable
        style={({ pressed }) => [
          styles.routeSearchInput,
          isOpen ? styles.routeSearchInputActive : null,
          pressed ? styles.routeSearchInputPressed : null,
        ]}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <View style={styles.routeSearchInputLeadingIcon}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.subtext} />
        </View>
        <Text numberOfLines={1} style={styles.routeSearchInputField}>
          {selectedLabel}
        </Text>
        <View style={styles.routeSearchClearButton}>
          <MaterialCommunityIcons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.subtext}
          />
        </View>
      </Pressable>

      {isOpen ? (
        <View style={styles.routeSuggestionsPanel}>
          {STATE_FILTER_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPressIn={() => {
                onStateFilterChange(option.value);
                setIsOpen(false);
              }}
              style={({ pressed }) => [
                styles.routeSuggestionItem,
                option.value === stateFilter ? styles.routeSuggestionItemSelected : null,
                pressed ? styles.routeSuggestionItemPressed : null,
              ]}
            >
              <View style={styles.routeSuggestionRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.subtext} />
                <Text
                  style={[
                    styles.routeSuggestionText,
                    option.value === stateFilter ? styles.routeSuggestionTextSelected : null,
                  ]}
                >
                  {option.label}
                </Text>
                <View style={styles.routeSuggestionAccessory}>
                  {option.value === stateFilter ? (
                    <MaterialCommunityIcons name="check" size={16} color={colors.hero} />
                  ) : null}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
