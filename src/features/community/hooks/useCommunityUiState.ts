import { useCallback, useState } from "react";

import type { AppNotice } from "../../../app/types";
import { EMPTY_ROUTE_DRAFT, type RouteDraft } from "../../../model";
import type { Filter, MainTab, Mode } from "../types";

const EMPTY_NOTICE: AppNotice = { tone: "info", text: "" };
const EMPTY_REGULAR_ROUTE_DRAFT: RouteDraft = {
  ...EMPTY_ROUTE_DRAFT,
  kind: "regular",
};
const EMPTY_ONE_TIME_ROUTE_DRAFT: RouteDraft = {
  ...EMPTY_ROUTE_DRAFT,
  kind: "one_time",
  returnSchedule: "",
  operatingDays: [],
  contactPhone: "",
  contactLink: "",
};

export function useCommunityUiState() {
  const [mode, setMode] = useState<Mode>("rider");
  const [filter, setFilter] = useState<Filter>("regular");
  const [mainTab, setMainTab] = useState<MainTab>("home");
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");
  const [regularRouteDraft, setRegularRouteDraft] = useState<RouteDraft>(EMPTY_REGULAR_ROUTE_DRAFT);
  const [oneTimeRouteDraft, setOneTimeRouteDraft] = useState<RouteDraft>(EMPTY_ONE_TIME_ROUTE_DRAFT);
  const [notice, setNotice] = useState<AppNotice>(EMPTY_NOTICE);

  const handleLoadError = useCallback((nextNotice: AppNotice) => {
    setNotice(nextNotice);
  }, []);

  const resetAllRouteDrafts = useCallback(() => {
    setRegularRouteDraft(EMPTY_REGULAR_ROUTE_DRAFT);
    setOneTimeRouteDraft(EMPTY_ONE_TIME_ROUTE_DRAFT);
  }, []);

  return {
    mode,
    setMode,
    filter,
    setFilter,
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
