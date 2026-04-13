import { useState } from "react";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import type { RouteDraft } from "../../../../../model";
import {
  isRouteTimeValue,
  toDateFromRouteDate,
  toDateFromRouteTime,
  toRouteDateFromDate,
  toRouteTimeFromDate,
} from "../../../../community/utils/routeForm";

type TimeField = "schedule" | "returnSchedule";

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [iosTimePickerValue, setIosTimePickerValue] = useState<Date>(new Date());
  const [iosDatePickerValue, setIosDatePickerValue] = useState<Date>(new Date());

  const openTimePicker = (field: TimeField) => {
    setIsDatePickerOpen(false);
    setIosTimePickerValue(toDateFromRouteTime(routeDraft[field]));
    setActiveTimeField(field);
  };

  const openDatePicker = () => {
    setActiveTimeField(null);
    setIosDatePickerValue(toDateFromRouteDate(routeDraft.noticeDate));
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

    onPatchDraft({ noticeDate: toRouteDateFromDate(selectedDate) });
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
    onPatchDraft({ noticeDate: toRouteDateFromDate(iosDatePickerValue) });
    setIsDatePickerOpen(false);
    if (!isRouteTimeValue(routeDraft.schedule)) {
      openTimePicker("schedule");
    }
  };

  return {
    activeTimeField,
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
    handleConfirmIosTime,
    handleConfirmIosDate,
  };
}
