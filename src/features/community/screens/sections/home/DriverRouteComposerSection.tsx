import { useEffect, useMemo, useRef, useState } from "react";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { OneTimeTripType, RouteDraft, RouteKind, VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import {
  isRouteDateValue,
  isRouteTimeValue,
  toDateFromRouteDate,
  toDateFromRouteTime,
  toRouteDateFromDate,
  toRouteTimeFromDate,
} from "../../../../community/utils/routeForm";
import { getQldPlaceSuggestions } from "../../../utils/placeQuickSearch";
import { DriverGarageSection } from "./DriverGarageSection";
import { InlinePickerCard } from "./InlinePickerCard";
import { RegularRouteSettingsSection } from "./RegularRouteSettingsSection";
import { RouteDraftTextField } from "./RouteDraftTextField";
import { RoutePlaceField } from "./RoutePlaceField";
import { RouteSaveActionSection } from "./RouteSaveActionSection";
import { RouteScheduleSection } from "./RouteScheduleSection";
import {
  buildRequiredChecks,
  normalizeSeatCount,
  toRemainingRequiredText,
} from "./driverRouteComposerState";

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

const MIN_SEATS = 1;
const MAX_SEATS = 8;

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
  const oneTimeTripType = routeDraft.oneTimeTripType === "round_trip" ? "round_trip" : "one_way";
  const isOneTimeRoundTrip = isOneTimeRoute && oneTimeTripType === "round_trip";
  const toInputRef = useRef<TextInput>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const updateRouteDraft = (patch: Partial<RouteDraft>) => {
    onRouteDraftChange({
      ...routeDraft,
      ...patch,
    });
  };

  useEffect(() => {
    if (routeDraft.kind === activeRouteKind) {
      return;
    }

    updateRouteDraft({
      kind: activeRouteKind,
      oneTimeTripType: activeRouteKind === "one_time" ? "one_way" : "round_trip",
      returnSchedule: activeRouteKind === "one_time" ? "" : routeDraft.returnSchedule,
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
    updateRouteDraft({ from: value });
    setActivePlaceField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    clearBlurTimeout();
    updateRouteDraft({ to: value });
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

  const handleOneTimeTripTypeChange = (nextType: OneTimeTripType) => {
    updateRouteDraft({
      oneTimeTripType: nextType,
      returnSchedule: nextType === "one_way" ? "" : routeDraft.returnSchedule,
    });
  };

  const applySelectedTime = (field: "schedule" | "returnSchedule", date: Date) => {
    updateRouteDraft({
      [field]: toRouteTimeFromDate(date),
    });
  };

  const shouldChainToReturnTime = (field: "schedule" | "returnSchedule") =>
    field === "schedule" &&
    !isRouteTimeValue(routeDraft.returnSchedule) &&
    (!isOneTimeRoute || isOneTimeRoundTrip);

  const openReturnTimePickerStep = () => {
    setIosTimePickerValue(toDateFromRouteTime(routeDraft.returnSchedule));
    setActiveTimeField("returnSchedule");
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

    if (shouldChainToReturnTime(currentField)) {
      openReturnTimePickerStep();
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

    updateRouteDraft({ noticeDate: toRouteDateFromDate(selectedDate) });
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

    if (shouldChainToReturnTime(currentField)) {
      openReturnTimePickerStep();
      return;
    }

    setActiveTimeField(null);
  };

  const handleConfirmIosDate = () => {
    updateRouteDraft({ noticeDate: toRouteDateFromDate(iosDatePickerValue) });
    setIsDatePickerOpen(false);
    if (!isRouteTimeValue(routeDraft.schedule)) {
      openTimePicker("schedule");
    }
  };

  const applyOperatingDays = (days: readonly string[]) => {
    updateRouteDraft({ operatingDays: [...days] });
  };

  const currentSeatCount = normalizeSeatCount(
    Number.parseInt(routeDraft.availableSeats, 10) || MIN_SEATS,
    MIN_SEATS,
    MAX_SEATS
  );

  const updateSeatCount = (nextSeatCount: number) => {
    const normalized = normalizeSeatCount(nextSeatCount, MIN_SEATS, MAX_SEATS);
    updateRouteDraft({ availableSeats: String(normalized) });
  };

  const hasFrom = Boolean(routeDraft.from.trim());
  const hasTo = Boolean(routeDraft.to.trim());
  const hasNoticeDate = isRouteDateValue(routeDraft.noticeDate);
  const hasDepartureTime = isRouteTimeValue(routeDraft.schedule);
  const hasReturnTime = isRouteTimeValue(routeDraft.returnSchedule);
  const hasSeats = currentSeatCount >= MIN_SEATS;
  const hasOperatingDays = routeDraft.operatingDays.length > 0;
  const hasProfileContactMethod = Boolean(savedVehicle.contactPhone.trim() || savedVehicle.contactLink.trim());
  const hasDraftContactMethod = Boolean(routeDraft.contactPhone.trim() || routeDraft.contactLink.trim());
  const hasContactMethod = hasProfileContactMethod || hasDraftContactMethod;

  const requiredChecks = buildRequiredChecks({
    isOneTimeRoute,
    isOneTimeRoundTrip,
    hasVehicle,
    hasFrom,
    hasTo,
    hasNoticeDate,
    hasDepartureTime,
    hasReturnTime,
    hasSeats,
    hasOperatingDays,
    hasContactMethod,
  });
  const remainingRequired = requiredChecks.filter((check) => !check.done).map((check) => check.label);
  const isReadyToSave = remainingRequired.length === 0;
  const remainingRequiredText = toRemainingRequiredText(remainingRequired);
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
          onVehicleDraftChange={onVehicleDraftChange}
          onSaveVehicle={onSaveVehicle}
        />
      ) : null}

      <RoutePlaceField
        colors={colors}
        styles={styles}
        label="From"
        value={routeDraft.from}
        placeholder="Brisbane CBD, QLD"
        suggestions={fromSuggestions}
        showSuggestions={showFromSuggestions}
        returnKeyType="next"
        onChangeText={(value) => updateRouteDraft({ from: value })}
        onFocus={() => {
          clearBlurTimeout();
          setActivePlaceField("from");
        }}
        onBlur={() => scheduleCloseSuggestions("from")}
        onSubmitEditing={() => toInputRef.current?.focus()}
        onClear={() => {
          updateRouteDraft({ from: "" });
          setActivePlaceField("from");
        }}
        onSelectSuggestion={handleSelectFromSuggestion}
      />

      <RoutePlaceField
        colors={colors}
        styles={styles}
        label="To"
        value={routeDraft.to}
        placeholder="St Lucia, QLD"
        suggestions={toSuggestions}
        showSuggestions={showToSuggestions}
        inputRef={toInputRef}
        returnKeyType="done"
        onChangeText={(value) => updateRouteDraft({ to: value })}
        onFocus={() => {
          clearBlurTimeout();
          setActivePlaceField("to");
        }}
        onBlur={() => scheduleCloseSuggestions("to")}
        onSubmitEditing={() => (isOneTimeRoute ? openDatePicker() : openTimePicker("schedule"))}
        onClear={() => {
          updateRouteDraft({ to: "" });
          setActivePlaceField("to");
        }}
        onSelectSuggestion={handleSelectToSuggestion}
      />

      <View style={styles.routeComposerDivider} />

      <RouteScheduleSection
        styles={styles}
        routeDraft={routeDraft}
        isOneTimeRoute={isOneTimeRoute}
        isOneTimeRoundTrip={isOneTimeRoundTrip}
        onPressDate={openDatePicker}
        onChangeOneTimeTripType={handleOneTimeTripTypeChange}
        onPressScheduleTime={() => openTimePicker("schedule")}
        onPressReturnTime={() => openTimePicker("returnSchedule")}
      />
      {Platform.OS === "ios" && isDatePickerOpen ? (
        <InlinePickerCard
          styles={styles}
          title="Notice date"
          onCancel={() => setIsDatePickerOpen(false)}
          onConfirm={handleConfirmIosDate}
        >
          <DateTimePicker
            mode="date"
            value={iosDatePickerValue}
            display="spinner"
            onChange={handleIosDatePickerChange}
          />
        </InlinePickerCard>
      ) : null}

      {Platform.OS === "ios" && activeTimeField ? (
        <InlinePickerCard
          styles={styles}
          title={
            isOneTimeRoute
              ? "Time"
              : activeTimeField === "schedule"
                ? "Departure time"
                : "Arrival time"
          }
          onCancel={() => setActiveTimeField(null)}
          onConfirm={handleConfirmIosTime}
        >
          <DateTimePicker
            mode="time"
            value={iosTimePickerValue}
            display="spinner"
            onChange={handleIosTimePickerChange}
          />
        </InlinePickerCard>
      ) : null}

      {!isOneTimeRoute ? (
        <RegularRouteSettingsSection
          colors={colors}
          styles={styles}
          routeDraft={routeDraft}
          currentSeatCount={currentSeatCount}
          onDecreaseSeats={() => updateSeatCount(currentSeatCount - 1)}
          onIncreaseSeats={() => updateSeatCount(currentSeatCount + 1)}
          onApplyOperatingDays={applyOperatingDays}
          onRouteDraftChange={onRouteDraftChange}
          onChangeContactPhone={(value) => updateRouteDraft({ contactPhone: value })}
          onChangeContactLink={(value) => updateRouteDraft({ contactLink: value })}
          onSetVisibility={(isPublic) => updateRouteDraft({ isPublic })}
        />
      ) : null}
      <Text style={styles.cardBody}>
        Optional: add extra instructions or pickup notes for riders.
      </Text>
      <RouteDraftTextField
        colors={colors}
        styles={styles}
        label="Additional details"
        optional
        value={routeDraft.note}
        onChangeText={(value) => updateRouteDraft({ note: value })}
        placeholder={
          isOneTimeRoute
            ? "Write additional details for this one-time notice"
            : "Write additional details for this regular registration"
        }
        multiline
      />

      <RouteSaveActionSection
        styles={styles}
        isOneTimeRoute={isOneTimeRoute}
        isReadyToSave={isReadyToSave}
        isSubmitting={isSubmitting}
        remainingRequiredCount={remainingRequired.length}
        remainingRequiredText={remainingRequiredText}
        onPress={() => {
          void handlePressSaveRegistration();
        }}
      />

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
