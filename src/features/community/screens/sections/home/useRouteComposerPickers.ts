import { useState } from "react";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import type { RouteDraft } from "../../../../../model";
import {
  isRouteDateValue,
  isRouteTimeValue,
  toDateFromRouteDate,
  toDateFromRouteTime,
  toRouteDateFromDate,
  toRouteTimeFromDate,
} from "../../../../community/utils/routeForm";

type TimeField = "schedule" | "returnSchedule";
type DateField = "noticeDate" | "returnDate";

type UseRouteComposerPickersOptions = {
  routeDraft: RouteDraft;
  isOneTimeRoute: boolean;
  isOneTimeRoundTrip: boolean;
  onPatchDraft: (patch: Partial<RouteDraft>) => void;
};

export function useRouteComposerPickers({
  routeDraft,
  isOneTimeRoute,
  isOneTimeRoundTrip,
  onPatchDraft,
}: UseRouteComposerPickersOptions) {
  const [activeTimeField, setActiveTimeField] = useState<TimeField | null>(null);
  const [activeDateField, setActiveDateField] = useState<DateField>("noticeDate");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [iosTimePickerValue, setIosTimePickerValue] = useState<Date>(new Date());
  const [iosDatePickerValue, setIosDatePickerValue] = useState<Date>(new Date());

  const openTimePicker = (field: TimeField) => {
    setIsDatePickerOpen(false);
    setIosTimePickerValue(toDateFromRouteTime(routeDraft[field]));
    setActiveTimeField(field);
  };

  const buildDatePatch = (field: DateField, date: Date) => {
    const nextDate = toRouteDateFromDate(date);
    if (field === "returnDate") {
      return { returnDate: nextDate };
    }

    return {
      noticeDate: nextDate,
      ...(isOneTimeRoundTrip && !isRouteDateValue(routeDraft.returnDate ?? "")
        ? { returnDate: nextDate }
        : {}),
    };
  };

  const openDatePicker = (field: DateField = "noticeDate") => {
    setActiveTimeField(null);
    setActiveDateField(field);
    setIosDatePickerValue(toDateFromRouteDate(routeDraft[field] ?? ""));
    setIsDatePickerOpen(true);
  };

  const applySelectedTime = (field: TimeField, date: Date) => {
    const nextTime = toRouteTimeFromDate(date);
    onPatchDraft(field === "schedule" ? { schedule: nextTime } : { returnSchedule: nextTime });
  };

  const shouldChainToReturnTime = (field: TimeField) =>
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

    onPatchDraft(buildDatePatch(activeDateField, selectedDate));
    setIsDatePickerOpen(false);
    if (activeDateField === "noticeDate" && !isRouteTimeValue(routeDraft.schedule)) {
      openTimePicker("schedule");
    }
  };

  const handleIosDatePickerChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setIosDatePickerValue(selectedDate);
    }
  };

  const handleNativeTimeChange = (field: TimeField, selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    applySelectedTime(field, selectedDate);
  };

  const handleNativeDateChange = (field: DateField, selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    onPatchDraft(buildDatePatch(field, selectedDate));
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
    onPatchDraft(buildDatePatch(activeDateField, iosDatePickerValue));
    setIsDatePickerOpen(false);
    if (activeDateField === "noticeDate" && !isRouteTimeValue(routeDraft.schedule)) {
      openTimePicker("schedule");
    }
  };

  return {
    activeTimeField,
    activeDateField,
    isDatePickerOpen,
    iosTimePickerValue,
    iosDatePickerValue,
    openTimePicker,
    openDatePicker,
    closeTimePicker: () => setActiveTimeField(null),
    closeDatePicker: () => setIsDatePickerOpen(false),
    handleAndroidTimePickerChange,
    handleIosTimePickerChange,
    handleAndroidDatePickerChange,
    handleIosDatePickerChange,
    handleNativeTimeChange,
    handleNativeDateChange,
    handleConfirmIosTime,
    handleConfirmIosDate,
  };
}
