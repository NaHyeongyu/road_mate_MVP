import type { RoutePost } from "../../../model";
import { STATE_SEARCH_ALIASES } from "../data/australianStates";
import type { StateFilter } from "../types";

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const matchesRoutePostStateFilter = (post: RoutePost, stateFilter: StateFilter) => {
  if (stateFilter === "ALL") {
    return true;
  }

  const combinedPlaceText = normalizeText(`${post.from} ${post.to}`);
  const aliases = STATE_SEARCH_ALIASES[stateFilter];

  return aliases.some((alias) => combinedPlaceText.includes(alias));
};
