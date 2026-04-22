import { useEffect, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { OneTimeTripType, RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import {
  toDateFromRouteDate,
  toDateFromRouteTime,
} from "../../../../community/utils/routeForm";
import { DriverGarageSection } from "./DriverGarageSection";
import { RegularRouteSettingsSection } from "./RegularRouteSettingsSection";
import { RouteDraftTextField } from "./RouteDraftTextField";
import { RoutePlaceField } from "./RoutePlaceField";
import { RouteSaveActionSection } from "./RouteSaveActionSection";
import { RouteScheduleSection } from "./RouteScheduleSection";
import { InlinePickerCard } from "./InlinePickerCard";
import { useDriverComposerSubmitState } from "./useDriverComposerSubmitState";
import { useRouteComposerPickers } from "./useRouteComposerPickers";
import { useRouteComposerPlaces } from "./useRouteComposerPlaces";

type DriverRouteComposerSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  activeRouteKind: RouteKind;
  activeRegisteredPost: RoutePost | null;
  routeDraft: RouteDraft;
  hasVehicle: boolean;
  showVehicleSetup: boolean;
  vehicleDraft: VehicleInfo;
  savedVehicle: VehicleInfo;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onPostRoute: () => Promise<boolean>;
  onRemoveRoute: (id: string) => void;
};

const MIN_SEATS = 1;
const MAX_SEATS = 8;
const COMPOSER_SECTION_GAP = 18;
const NOTE_MAX_LENGTH = 500;

export function DriverRouteComposerSection({
  colors,
  styles,
  activeRouteKind,
  activeRegisteredPost,
  routeDraft,
  hasVehicle,
  showVehicleSetup,
  vehicleDraft,
  savedVehicle,
  onVehicleDraftChange,
  onSaveVehicle,
  onRouteDraftChange,
  onPostRoute,
  onRemoveRoute,
}: DriverRouteComposerSectionProps) {
  const copy = useAppCopy();
  const isOneTimeRoute = activeRouteKind === "one_time";
  const oneTimeTripType = routeDraft.oneTimeTripType === "round_trip" ? "round_trip" : "one_way";
  const isOneTimeRoundTrip = isOneTimeRoute && oneTimeTripType === "round_trip";
  const toInputRef = useRef<TextInput>(null);

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
      returnDate: activeRouteKind === "one_time" ? "" : routeDraft.returnDate,
      returnSchedule: activeRouteKind === "one_time" ? "" : routeDraft.returnSchedule,
    });
  }, [activeRouteKind, onRouteDraftChange, routeDraft]);

  const handleOneTimeTripTypeChange = (nextType: OneTimeTripType) => {
    updateRouteDraft({
      oneTimeTripType: nextType,
      returnDate:
        nextType === "one_way" ? "" : routeDraft.returnDate || routeDraft.noticeDate || "",
      returnSchedule: nextType === "one_way" ? "" : routeDraft.returnSchedule,
    });
  };

  const {
    activeTimeField,
    activeDateField,
    isDatePickerOpen,
    iosTimePickerValue,
    iosDatePickerValue,
    openTimePicker,
    openDatePicker,
    closeTimePicker,
    closeDatePicker,
    handleAndroidTimePickerChange,
    handleIosTimePickerChange,
    handleAndroidDatePickerChange,
    handleIosDatePickerChange,
    handleConfirmIosTime,
    handleConfirmIosDate,
  } = useRouteComposerPickers({
    routeDraft,
    isOneTimeRoute,
    isOneTimeRoundTrip,
    onPatchDraft: updateRouteDraft,
  });

  const handleCompleteDestination = () => {
    if (isOneTimeRoute) {
      openDatePicker("noticeDate");
      return;
    }

    openTimePicker("schedule");
  };

  const {
    fromInputValue,
    toInputValue,
    fromSuggestions,
    toSuggestions,
    showFromSuggestions,
    showToSuggestions,
    hasSelectedFrom,
    hasSelectedTo,
    handleFromChangeText,
    handleToChangeText,
    handleFromFocus,
    handleToFocus,
    handleFromBlur,
    handleToBlur,
    handleClearFrom,
    handleClearTo,
    handleSelectFromSuggestion,
    handleSelectToSuggestion,
  } = useRouteComposerPlaces({
    routeDraft,
    toInputRef,
    onPatchDraft: updateRouteDraft,
    onCompleteDestination: handleCompleteDestination,
  });
  const {
    currentSeatCount,
    updateSeatCount,
    isSubmitting,
    isReadyToSave,
    remainingRequired,
    remainingRequiredText,
    handlePressSaveRegistration,
  } = useDriverComposerSubmitState({
    routeDraft,
    savedVehicle,
    hasVehicle,
    isOneTimeRoute,
    isOneTimeRoundTrip,
    minSeats: MIN_SEATS,
    maxSeats: MAX_SEATS,
    hasSelectedFrom,
    hasSelectedTo,
    onPatchDraft: updateRouteDraft,
    onPostRoute,
  });

  const routeFields = (
    <>
      <RoutePlaceField
        colors={colors}
        styles={styles}
        label={copy.common.from}
        value={fromInputValue}
        placeholder="Search suburb or region"
        suggestions={fromSuggestions}
        showSuggestions={showFromSuggestions}
        returnKeyType="next"
        onChangeText={handleFromChangeText}
        onFocus={handleFromFocus}
        onBlur={handleFromBlur}
        onSubmitEditing={() => {
          if (hasSelectedFrom) {
            toInputRef.current?.focus();
          }
        }}
        onClear={handleClearFrom}
        onSelectSuggestion={handleSelectFromSuggestion}
      />

      <RoutePlaceField
        colors={colors}
        styles={styles}
        label={copy.common.to}
        value={toInputValue}
        placeholder="Search suburb or region"
        suggestions={toSuggestions}
        showSuggestions={showToSuggestions}
        inputRef={toInputRef}
        returnKeyType="done"
        onChangeText={handleToChangeText}
        onFocus={handleToFocus}
        onBlur={handleToBlur}
        onSubmitEditing={() => {
          if (hasSelectedTo) {
            handleCompleteDestination();
          }
        }}
        onClear={handleClearTo}
        onSelectSuggestion={handleSelectToSuggestion}
      />
    </>
  );

  const scheduleFields = (
    <>
      <RouteScheduleSection
        styles={styles}
        routeDraft={routeDraft}
        isOneTimeRoute={isOneTimeRoute}
        isOneTimeRoundTrip={isOneTimeRoundTrip}
        onPressDepartureDate={() => openDatePicker("noticeDate")}
        onPressReturnDate={() => openDatePicker("returnDate")}
        onChangeOneTimeTripType={handleOneTimeTripTypeChange}
        onPressScheduleTime={() => openTimePicker("schedule")}
        onPressReturnTime={() => openTimePicker("returnSchedule")}
      />
    </>
  );
  const inlinePickerCard =
    Platform.OS === "ios" && activeTimeField ? (
      <InlinePickerCard
        styles={styles}
        title={
          activeTimeField === "schedule"
            ? copy.common.selectDepartureTime
            : copy.common.selectReturnTime
        }
        onCancel={closeTimePicker}
        onConfirm={handleConfirmIosTime}
      >
        <DateTimePicker
          mode="time"
          display="spinner"
          value={iosTimePickerValue}
          onChange={handleIosTimePickerChange}
        />
      </InlinePickerCard>
    ) : Platform.OS === "ios" && isDatePickerOpen ? (
      <InlinePickerCard
        styles={styles}
        title={
          activeDateField === "noticeDate"
            ? copy.common.selectDepartureDate
            : copy.common.selectReturnDate
        }
        onCancel={closeDatePicker}
        onConfirm={handleConfirmIosDate}
      >
        <DateTimePicker
          mode="date"
          display="spinner"
          value={iosDatePickerValue}
          onChange={handleIosDatePickerChange}
        />
      </InlinePickerCard>
    ) : null;

  const noteField = (
    <RouteDraftTextField
      colors={colors}
      styles={styles}
      label={copy.common.additionalDetails}
      optional
      value={routeDraft.note}
      onChangeText={(value) => updateRouteDraft({ note: value.slice(0, NOTE_MAX_LENGTH) })}
      placeholder={
        isOneTimeRoute
          ? "Write additional details for this one-time notice"
          : "Write additional details for this regular registration"
      }
      multiline
      maxLength={NOTE_MAX_LENGTH}
    />
  );

  const saveAction = (
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
  );

  return (
    <>
      <View style={{ gap: COMPOSER_SECTION_GAP }}>
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

        <View style={{ gap: COMPOSER_SECTION_GAP }}>
          <View style={styles.card}>
            <Text style={styles.composerSectionTitle}>{copy.community.routeSectionTitle}</Text>
            <View style={styles.composerSectionFields}>{routeFields}</View>
          </View>

          <View style={styles.card}>
            <Text style={styles.composerSectionTitle}>{copy.community.scheduleSectionTitle}</Text>
            <View style={styles.composerSectionFields}>
              {scheduleFields}
              {inlinePickerCard}
            </View>
          </View>

          {!isOneTimeRoute ? (
            <View style={styles.card}>
              <Text style={styles.composerSectionTitle}>
                {copy.community.regularSettingsSectionTitle}
              </Text>
              <View style={styles.composerSectionFields}>
                <RegularRouteSettingsSection
                  styles={styles}
                  routeDraft={routeDraft}
                  currentSeatCount={currentSeatCount}
                  onDecreaseSeats={() => updateSeatCount(currentSeatCount - 1)}
                  onIncreaseSeats={() => updateSeatCount(currentSeatCount + 1)}
                  onRouteDraftChange={onRouteDraftChange}
                  onSetVisibility={(isPublic) => updateRouteDraft({ isPublic })}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.composerSectionTitle}>{copy.community.noteSectionTitle}</Text>
            <View style={styles.composerSectionFields}>{noteField}</View>
          </View>
        </View>

        <View>
          {saveAction}
        </View>

        {activeRegisteredPost ? (
          <Pressable
            style={styles.dangerButton}
            onPress={() => onRemoveRoute(activeRegisteredPost.id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MaterialCommunityIcons name="trash-can-outline" size={17} color={colors.danger} />
              <Text style={styles.dangerButtonText}>{copy.common.delete}</Text>
            </View>
          </Pressable>
        ) : null}
      </View>

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
          value={toDateFromRouteDate(routeDraft[activeDateField] ?? "")}
          display="calendar"
          onChange={handleAndroidDatePickerChange}
        />
      ) : null}
    </>
  );
}
