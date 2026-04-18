import { useCallback, useEffect, useRef, useState } from "react";

import type { AppNotice } from "../../../app/types";
import { EMPTY_ROUTE_DRAFT, type RouteDraft } from "../../../model";
import type { Filter, MainTab, Mode, StateFilter } from "../types";

const EMPTY_NOTICE: AppNotice = { tone: "info", text: "" };
const EMPTY_REGULAR_ROUTE_DRAFT: RouteDraft = {
  ...EMPTY_ROUTE_DRAFT,
  kind: "regular",
  oneTimeTripType: "round_trip",
};
const EMPTY_ONE_TIME_ROUTE_DRAFT: RouteDraft = {
  ...EMPTY_ROUTE_DRAFT,
  kind: "one_time",
  oneTimeTripType: "one_way",
  returnSchedule: "",
  operatingDays: [],
  contactPhone: "",
  contactLink: "",
};

export function useCommunityUiState() {
  const [mode, setMode] = useState<Mode>("rider");
  const [filter, setFilter] = useState<Filter>("regular");
  const [stateFilter, setStateFilter] = useState<StateFilter>("ALL");
  const [mainTab, setMainTab] = useState<MainTab>("home");
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");
  const [regularRouteDraft, setRegularRouteDraft] = useState<RouteDraft>(EMPTY_REGULAR_ROUTE_DRAFT);
  const [oneTimeRouteDraft, setOneTimeRouteDraft] = useState<RouteDraft>(EMPTY_ONE_TIME_ROUTE_DRAFT);
  const [notice, setNoticeState] = useState<AppNotice>(EMPTY_NOTICE);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNoticeTimer = useCallback(() => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
  }, []);

  const setNotice = useCallback(
    (nextNotice: AppNotice) => {
      clearNoticeTimer();
      setNoticeState(nextNotice);

      if (!nextNotice.text) {
        return;
      }

      noticeTimerRef.current = setTimeout(() => {
        setNoticeState(EMPTY_NOTICE);
        noticeTimerRef.current = null;
      }, 2600);
    },
    [clearNoticeTimer]
  );

  const handleLoadError = useCallback((nextNotice: AppNotice) => {
    setNotice(nextNotice);
  }, []);

  useEffect(
    () => () => {
      clearNoticeTimer();
    },
    [clearNoticeTimer]
  );

  const resetAllRouteDrafts = useCallback(() => {
    setRegularRouteDraft(EMPTY_REGULAR_ROUTE_DRAFT);
    setOneTimeRouteDraft(EMPTY_ONE_TIME_ROUTE_DRAFT);
  }, []);

  return {
    mode,
    setMode,
    filter,
    setFilter,
    stateFilter,
    setStateFilter,
    mainTab,
    setMainTab,
    fromSearchQuery,
    setFromSearchQuery,
    toSearchQuery,
    setToSearchQuery,
    regularRouteDraft,
    setRegularRouteDraft,
    oneTimeRouteDraft,
    setOneTimeRouteDraft,
    resetAllRouteDrafts,
    notice,
    setNotice,
    handleLoadError,
  };
}
