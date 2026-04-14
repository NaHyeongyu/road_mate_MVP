import type { AustralianStateCode, StateFilter } from "../types";

type StateFilterOption = {
  value: StateFilter;
  label: string;
};

export const STATE_FILTER_OPTIONS: readonly StateFilterOption[] = [
  { value: "ALL", label: "All states" },
  { value: "QLD", label: "Queensland (QLD)" },
  { value: "NSW", label: "New South Wales (NSW)" },
  { value: "VIC", label: "Victoria (VIC)" },
  { value: "WA", label: "Western Australia (WA)" },
  { value: "SA", label: "South Australia (SA)" },
  { value: "TAS", label: "Tasmania (TAS)" },
  { value: "NT", label: "Northern Territory (NT)" },
  { value: "ACT", label: "Australian Capital Territory (ACT)" },
] as const;

export const STATE_SEARCH_ALIASES: Record<AustralianStateCode, readonly string[]> = {
  QLD: ["qld", "queensland"],
  NSW: ["nsw", "new south wales"],
  VIC: ["vic", "victoria"],
  WA: ["wa", "western australia"],
  SA: ["sa", "south australia"],
  TAS: ["tas", "tasmania"],
  NT: ["nt", "northern territory"],
  ACT: ["act", "australian capital territory"],
};
