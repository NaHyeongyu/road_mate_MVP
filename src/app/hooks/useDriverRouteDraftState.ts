import { useCallback } from "react";

import type { RouteDraft, RouteKind } from "../../model";
import type { MainTab, Mode } from "../../features/community/types";

type UseDriverRouteDraftStateOptions = {
  mode: Mode;
  mainTab: MainTab;
  regularRouteDraft: RouteDraft;
  oneTimeRouteDraft: RouteDraft;
  setRegularRouteDraft: (draft: RouteDraft) => void;
  setOneTimeRouteDraft: (draft: RouteDraft) => void;
};

export function useDriverRouteDraftState({
  mode,
  mainTab,
  regularRouteDraft,
  oneTimeRouteDraft,
  setRegularRouteDraft,
  setOneTimeRouteDraft,
}: UseDriverRouteDraftStateOptions) {
  const activeDriverRouteKind: RouteKind =
    mode === "driver" && mainTab === "saved" ? "one_time" : "regular";
  const routeDraft = activeDriverRouteKind === "regular" ? regularRouteDraft : oneTimeRouteDraft;

  const setRouteDraft = useCallback(
    (nextDraft: RouteDraft) => {
      if (activeDriverRouteKind === "regular") {
        setRegularRouteDraft({
          ...nextDraft,
          kind: "regular",
          oneTimeTripType: "round_trip",
        });
        return;
      }

      setOneTimeRouteDraft({
        ...nextDraft,
        kind: "one_time",
        oneTimeTripType: nextDraft.oneTimeTripType ?? "one_way",
      });
    },
    [activeDriverRouteKind, setOneTimeRouteDraft, setRegularRouteDraft]
  );

  return {
    routeDraft,
    setRouteDraft,
  };
}
