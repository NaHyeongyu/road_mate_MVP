import { useEffect, useMemo, useRef, useState } from "react";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteDraft, RouteKind, VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import {
  WEEKDAY_OPTIONS,
  isRouteDateValue,
  isRouteTimeValue,
  toDateFromRouteDate,
  toDateFromRouteTime,
  toRouteDateFromDate,
  toRouteTimeFromDate,
} from "../../../../community/utils/routeForm";
import { getQldPlaceSuggestions } from "../../../utils/placeQuickSearch";
import { Label } from "../../../../shared/components/Label";
import { ToggleChip } from "../../../../shared/components/ToggleChip";
import { DriverGarageSection } from "./DriverGarageSection";
import { OperatingDaysChips } from "./OperatingDaysChips";
import { RouteDateField } from "./RouteDateField";
import { RouteDraftTextField } from "./RouteDraftTextField";
import { RouteTimeField } from "./RouteTimeField";

type DriverRouteComposerSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  activeRouteKind: RouteKind;
  routeDraft: RouteDraft;
  hasVehicle: boolean;
  showVehicleSetup: boolean;
  vehicleDraft: VehicleInfo;
  savedVehicle: VehicleInfo;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onPostRoute: () => Promise<boolean>;
};

type RequiredCheck = {
  label: string;
  done: boolean;
};

const WEEKDAY_PRESET = WEEKDAY_OPTIONS.slice(0, 5);
const WEEKEND_PRESET = WEEKDAY_OPTIONS.slice(5);
const MIN_SEATS = 1;
const MAX_SEATS = 8;

const hasSameDays = (current: string[], target: readonly string[]) =>
  current.length === target.length && target.every((day) => current.includes(day));

export function DriverRouteComposerSection({
  colors,
  styles,
  activeRouteKind,
  routeDraft,
  hasVehicle,
  showVehicleSetup,
  vehicleDraft,
  savedVehicle,
  onVehicleDraftChange,
  onSaveVehicle,
  onRouteDraftChange,
  onPostRoute,
}: DriverRouteComposerSectionProps) {
  const isOneTimeRoute = activeRouteKind === "one_time";
  const toInputRef = useRef<TextInput>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const linkInputRef = useRef<TextInput>(null);
  const [activePlaceField, setActivePlaceField] = useState<"from" | "to" | null>(null);
  const [activeTimeField, setActiveTimeField] = useState<"schedule" | "returnSchedule" | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [iosTimePickerValue, setIosTimePickerValue] = useState<Date>(new Date());
  const [iosDatePickerValue, setIosDatePickerValue] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromSuggestions = useMemo(() => getQldPlaceSuggestions(routeDraft.from), [routeDraft.from]);
  const toSuggestions = useMemo(() => getQldPlaceSuggestions(routeDraft.to), [routeDraft.to]);
  const showFromSuggestions =
    activePlaceField === "from" && routeDraft.from.trim().length > 0 && fromSuggestions.length > 0;
  const showToSuggestions =
    activePlaceField === "to" && routeDraft.to.trim().length > 0 && toSuggestions.length > 0;

  const clearBlurTimeout = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const scheduleCloseSuggestions = (field: "from" | "to") => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setActivePlaceField((prev) => (prev === field ? null : prev));
    }, 120);
  };

  useEffect(() => {
    if (routeDraft.kind === activeRouteKind) {
      return;
    }

    onRouteDraftChange({
      ...routeDraft,
      kind: activeRouteKind,
    });
  }, [activeRouteKind, onRouteDraftChange, routeDraft]);

  useEffect(
    () => () => {
      clearBlurTimeout();
    },
    []
  );

  const handleSelectFromSuggestion = (value: string) => {
    clearBlurTimeout();
    onRouteDraftChange({ ...routeDraft, from: value });
    setActivePlaceField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    clearBlurTimeout();
    onRouteDraftChange({ ...routeDraft, to: value });
    setActivePlaceField(null);
    if (isOneTimeRoute) {
      openDatePicker();
      return;
    }

    openTimePicker("schedule");
  };

  const openTimePicker = (field: "schedule" | "returnSchedule") => {
    setIsDatePickerOpen(false);
    const baseValue = toDateFromRouteTime(routeDraft[field]);
    setIosTimePickerValue(baseValue);
    setActiveTimeField(field);
  };

  const openDatePicker = () => {
    setActiveTimeField(null);
    setIosDatePickerValue(toDateFromRouteDate(routeDraft.noticeDate));
    setIsDatePickerOpen(true);
  };

  const applySelectedTime = (field: "schedule" | "returnSchedule", date: Date) => {
    onRouteDraftChange({
      ...routeDraft,
      [field]: toRouteTimeFromDate(date),
    });
  };

  const handleAndroidTimePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!activeTimeField) {
      return;
    }

    if (event.type !== "set" || !selectedDate) {
      setActiveTimeField(null);
      return;
    }

    const currentField = activeTimeField;
    applySelectedTime(currentField, selectedDate);

    if (!isOneTimeRoute && currentField === "schedule" && !isRouteTimeValue(routeDraft.returnSchedule)) {
      setIosTimePickerValue(toDateFromRouteTime(routeDraft.returnSchedule));
      setActiveTimeField("returnSchedule");
      return;
    }

    setActiveTimeField(null);
  };

  const handleIosTimePickerChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setIosTimePickerValue(selectedDate);
    }
  };

  const handleAndroidDatePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!isDatePickerOpen) {
      return;
    }

    if (event.type !== "set" || !selectedDate) {
      setIsDatePickerOpen(false);
      return;
    }

    onRouteDraftChange({
      ...routeDraft,
      noticeDate: toRouteDateFromDate(selectedDate),
    });
    setIsDatePickerOpen(false);
    if (!isRouteTimeValue(routeDraft.schedule)) {
      openTimePicker("schedule");
    }
  };

  const handleIosDatePickerChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setIosDatePickerValue(selectedDate);
    }
  };

  const handleConfirmIosTime = () => {
    if (!activeTimeField) {
      return;
    }

    const currentField = activeTimeField;
    applySelectedTime(currentField, iosTimePickerValue);

    if (!isOneTimeRoute && currentField === "schedule" && !isRouteTimeValue(routeDraft.returnSchedule)) {
      setIosTimePickerValue(toDateFromRouteTime(routeDraft.returnSchedule));
      setActiveTimeField("returnSchedule");
      return;
    }

    setActiveTimeField(null);
  };

  const handleConfirmIosDate = () => {
    onRouteDraftChange({
      ...routeDraft,
      noticeDate: toRouteDateFromDate(iosDatePickerValue),
    });
    setIsDatePickerOpen(false);
    if (!isRouteTimeValue(routeDraft.schedule)) {
      openTimePicker("schedule");
    }
  };

  const applyOperatingDays = (days: readonly string[]) => {
    onRouteDraftChange({
      ...routeDraft,
      operatingDays: [...days],
    });
  };

  const currentSeatCount = Math.min(
    MAX_SEATS,
    Math.max(MIN_SEATS, Number.parseInt(routeDraft.availableSeats, 10) || MIN_SEATS)
  );

  const updateSeatCount = (nextSeatCount: number) => {
    const normalized = Math.min(MAX_SEATS, Math.max(MIN_SEATS, nextSeatCount));
    onRouteDraftChange({
      ...routeDraft,
      availableSeats: String(normalized),
    });
  };

  const hasFrom = Boolean(routeDraft.from.trim());
  const hasTo = Boolean(routeDraft.to.trim());
  const hasNoticeDate = isRouteDateValue(routeDraft.noticeDate);
  const hasDepartureTime = isRouteTimeValue(routeDraft.schedule);
  const hasArrivalTime = isRouteTimeValue(routeDraft.returnSchedule);
  const hasSeats = currentSeatCount >= MIN_SEATS;
  const hasOperatingDays = routeDraft.operatingDays.length > 0;
  const hasContactMethod = Boolean(routeDraft.contactPhone.trim() || routeDraft.contactLink.trim());

  const requiredChecks: RequiredCheck[] = isOneTimeRoute
    ? [
        { label: "Vehicle profile", done: hasVehicle },
        { label: "From", done: hasFrom },
        { label: "To", done: hasTo },
        { label: "Date", done: hasNoticeDate },
        { label: "Time", done: hasDepartureTime },
      ]
    : [
        { label: "Vehicle profile", done: hasVehicle },
        { label: "From", done: hasFrom },
        { label: "To", done: hasTo },
        { label: "Departure time", done: hasDepartureTime },
        { label: "Arrival time", done: hasArrivalTime },
        { label: "Available seats", done: hasSeats },
        { label: "Operating day", done: hasOperatingDays },
        { label: "Contact", done: hasContactMethod },
      ];
  const remainingRequired = requiredChecks.filter((check) => !check.done).map((check) => check.label);
  const isReadyToSave = remainingRequired.length === 0;
  const isWeekdayPresetActive = hasSameDays(routeDraft.operatingDays, WEEKDAY_PRESET);
  const isWeekendPresetActive = hasSameDays(routeDraft.operatingDays, WEEKEND_PRESET);
  const isAllDaysPresetActive = hasSameDays(routeDraft.operatingDays, WEEKDAY_OPTIONS);
  const handlePressSaveRegistration = async () => {
    if (isSubmitting || !isReadyToSave) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onPostRoute();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showVehicleSetup ? (
        <DriverGarageSection
          colors={colors}
          styles={styles}
          hasVehicle={hasVehicle}
          vehicleDraft={vehicleDraft}
          savedVehicle={savedVehicle}
          onVehicleDraftChange={onVehicleDraftChange}
          onSaveVehicle={onSaveVehicle}
        />
      ) : null}

      <Label text="From" styles={styles} />
      <View style={styles.routeSearchInput}>
        <TextInput
          value={routeDraft.from}
          onChangeText={(value) => onRouteDraftChange({ ...routeDraft, from: value })}
          placeholder="Brisbane CBD, QLD"
          placeholderTextColor={colors.subtext}
          style={styles.routeSearchInputField}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="next"
          blurOnSubmit={false}
          onFocus={() => {
            clearBlurTimeout();
            setActivePlaceField("from");
          }}
          onBlur={() => scheduleCloseSuggestions("from")}
          onSubmitEditing={() => toInputRef.current?.focus()}
        />
        {routeDraft.from.trim() ? (
          <Pressable
            style={styles.routeSearchClearButton}
            onPress={() => {
              onRouteDraftChange({ ...routeDraft, from: "" });
              setActivePlaceField("from");
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

      <Label text="To" styles={styles} />
      <View style={styles.routeSearchInput}>
        <TextInput
          ref={toInputRef}
          value={routeDraft.to}
          onChangeText={(value) => onRouteDraftChange({ ...routeDraft, to: value })}
          placeholder="St Lucia, QLD"
          placeholderTextColor={colors.subtext}
          style={styles.routeSearchInputField}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          blurOnSubmit={false}
          onFocus={() => {
            clearBlurTimeout();
            setActivePlaceField("to");
          }}
          onBlur={() => scheduleCloseSuggestions("to")}
          onSubmitEditing={() => (isOneTimeRoute ? openDatePicker() : openTimePicker("schedule"))}
        />
        {routeDraft.to.trim() ? (
          <Pressable
            style={styles.routeSearchClearButton}
            onPress={() => {
              onRouteDraftChange({ ...routeDraft, to: "" });
              setActivePlaceField("to");
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

      <View style={styles.routeComposerDivider} />

      {isOneTimeRoute ? (
        <RouteDateField
          styles={styles}
          label="Date"
          value={routeDraft.noticeDate}
          placeholder="Select notice date"
          onPress={openDatePicker}
        />
      ) : null}

      <RouteTimeField
        styles={styles}
        label={isOneTimeRoute ? "Time" : "Departure time"}
        value={routeDraft.schedule}
        placeholder={isOneTimeRoute ? "Select time" : "Select departure time"}
        onPress={() => openTimePicker("schedule")}
      />
      {!isOneTimeRoute ? (
        <RouteTimeField
          styles={styles}
          label="Arrival time"
          value={routeDraft.returnSchedule}
          placeholder="Select arrival time"
          onPress={() => openTimePicker("returnSchedule")}
        />
      ) : null}
      {Platform.OS === "ios" && isDatePickerOpen ? (
        <View style={styles.timePickerInlineCard}>
          <View style={styles.timePickerInlineHeader}>
            <Text style={styles.timePickerInlineTitle}>Notice date</Text>
            <View style={styles.timePickerInlineActions}>
              <Pressable style={styles.timePickerInlineActionButton} onPress={() => setIsDatePickerOpen(false)}>
                <Text style={styles.timePickerInlineActionText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.timePickerInlineActionButton} onPress={handleConfirmIosDate}>
                <Text style={styles.timePickerInlineActionText}>Done</Text>
              </Pressable>
            </View>
          </View>
          <DateTimePicker
            mode="date"
            value={iosDatePickerValue}
            display="spinner"
            onChange={handleIosDatePickerChange}
          />
        </View>
      ) : null}

      {Platform.OS === "ios" && activeTimeField ? (
        <View style={styles.timePickerInlineCard}>
          <View style={styles.timePickerInlineHeader}>
            <Text style={styles.timePickerInlineTitle}>
              {isOneTimeRoute
                ? "Time"
                : activeTimeField === "schedule"
                  ? "Departure time"
                  : "Arrival time"}
            </Text>
            <View style={styles.timePickerInlineActions}>
              <Pressable style={styles.timePickerInlineActionButton} onPress={() => setActiveTimeField(null)}>
                <Text style={styles.timePickerInlineActionText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.timePickerInlineActionButton} onPress={handleConfirmIosTime}>
                <Text style={styles.timePickerInlineActionText}>Done</Text>
              </Pressable>
            </View>
          </View>
          <DateTimePicker
            mode="time"
            value={iosTimePickerValue}
            display="spinner"
            onChange={handleIosTimePickerChange}
          />
        </View>
      ) : null}

      {!isOneTimeRoute ? (
        <>
          <Label text="Available seats" styles={styles} />
          <View style={styles.row}>
            <Pressable style={styles.chip} onPress={() => updateSeatCount(currentSeatCount - 1)}>
              <Text style={styles.chipText}>-</Text>
            </Pressable>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{currentSeatCount}</Text>
            </View>
            <Pressable style={styles.chip} onPress={() => updateSeatCount(currentSeatCount + 1)}>
              <Text style={styles.chipText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.routeComposerDivider} />

          <Label text="Operating days" styles={styles} />
          <View style={styles.row}>
            <ToggleChip
              label="Weekdays"
              active={isWeekdayPresetActive}
              onPress={() => applyOperatingDays(WEEKDAY_PRESET)}
              styles={styles}
            />
            <ToggleChip
              label="Weekend"
              active={isWeekendPresetActive}
              onPress={() => applyOperatingDays(WEEKEND_PRESET)}
              styles={styles}
            />
            <ToggleChip
              label="All week"
              active={isAllDaysPresetActive}
              onPress={() => applyOperatingDays(WEEKDAY_OPTIONS)}
              styles={styles}
            />
          </View>
          <OperatingDaysChips
            styles={styles}
            routeDraft={routeDraft}
            onRouteDraftChange={onRouteDraftChange}
          />

          <RouteDraftTextField
            colors={colors}
            styles={styles}
            label="AU phone (or Kakao link)"
            optional
            value={routeDraft.contactPhone}
            onChangeText={(value) => onRouteDraftChange({ ...routeDraft, contactPhone: value })}
            placeholder="+61 412 345 678"
            keyboardType="phone-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            inputRef={phoneInputRef}
            onSubmitEditing={() => linkInputRef.current?.focus()}
          />
          <RouteDraftTextField
            colors={colors}
            styles={styles}
            label="KakaoTalk link (or phone)"
            optional
            value={routeDraft.contactLink}
            onChangeText={(value) => onRouteDraftChange({ ...routeDraft, contactLink: value })}
            placeholder="https://open.kakao.com/o/..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            inputRef={linkInputRef}
          />
        </>
      ) : null}
      <RouteDraftTextField
        colors={colors}
        styles={styles}
        label={isOneTimeRoute ? "Additional details" : "Post note"}
        optional
        value={routeDraft.note}
        onChangeText={(value) => onRouteDraftChange({ ...routeDraft, note: value })}
        placeholder={
          isOneTimeRoute
            ? "Write details for this one-time notice"
            : "Pickup detail or seat note"
        }
        multiline
      />

      {!isOneTimeRoute ? (
        <>
          <View style={styles.routeComposerDivider} />

          <Label text="Visibility" styles={styles} />
          <Text style={styles.cardBody}>
            {routeDraft.isPublic
              ? "Public: riders can discover this route."
              : "Private: hidden from rider search and visible only to you."}
          </Text>
          <View style={styles.row}>
            <ToggleChip
              label="Public"
              active={routeDraft.isPublic}
              onPress={() => onRouteDraftChange({ ...routeDraft, isPublic: true })}
              styles={styles}
            />
            <ToggleChip
              label="Private"
              active={!routeDraft.isPublic}
              onPress={() => onRouteDraftChange({ ...routeDraft, isPublic: false })}
              styles={styles}
            />
          </View>
        </>
      ) : null}

      {!isReadyToSave ? (
        <Text style={styles.cardBody}>
          {isOneTimeRoute
            ? "Fill required fields to post this one-time notice."
            : "Fill all required fields to save this registration."}
        </Text>
      ) : null}

      <Pressable
        style={[
          styles.primaryButton,
          !isReadyToSave || isSubmitting ? styles.primaryButtonDisabled : null,
        ]}
        disabled={!isReadyToSave || isSubmitting}
        onPress={() => {
          void handlePressSaveRegistration();
        }}
      >
        <Text style={styles.primaryButtonText}>
          {isSubmitting
            ? isOneTimeRoute
              ? "Posting one-time notice..."
              : "Saving registration..."
            : isReadyToSave
            ? isOneTimeRoute
              ? "Post one-time notice"
              : "Save registration"
            : `Complete ${remainingRequired.length} required item${
                remainingRequired.length > 1 ? "s" : ""
              }`}
        </Text>
      </Pressable>

      {Platform.OS === "android" && activeTimeField ? (
        <DateTimePicker
          mode="time"
          value={toDateFromRouteTime(routeDraft[activeTimeField])}
          display="clock"
          onChange={handleAndroidTimePickerChange}
        />
      ) : null}
      {Platform.OS === "android" && isDatePickerOpen ? (
        <DateTimePicker
          mode="date"
          value={toDateFromRouteDate(routeDraft.noticeDate)}
          display="calendar"
          onChange={handleAndroidDatePickerChange}
        />
      ) : null}
    </>
  );
}
