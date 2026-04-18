export type RequiredCheck = {
  label: string;
  done: boolean;
};

type BuildRequiredChecksArgs = {
  isOneTimeRoute: boolean;
  isOneTimeRoundTrip: boolean;
  hasVehicle: boolean;
  hasFrom: boolean;
  hasTo: boolean;
  hasNoticeDate: boolean;
  hasReturnDate: boolean;
  hasDepartureTime: boolean;
  hasReturnTime: boolean;
  hasSeats: boolean;
  hasOperatingDays: boolean;
  hasContactMethod: boolean;
};

export const hasSameDays = (current: string[], target: readonly string[]) =>
  current.length === target.length && target.every((day) => current.includes(day));

export const normalizeSeatCount = (value: number, min = 1, max = 8) =>
  Math.min(max, Math.max(min, value));

export const buildRequiredChecks = ({
  isOneTimeRoute,
  isOneTimeRoundTrip,
  hasVehicle,
  hasFrom,
  hasTo,
  hasNoticeDate,
  hasReturnDate,
  hasDepartureTime,
  hasReturnTime,
  hasSeats,
  hasOperatingDays,
  hasContactMethod,
}: BuildRequiredChecksArgs): RequiredCheck[] =>
  isOneTimeRoute
    ? [
        { label: "Vehicle profile", done: hasVehicle },
        { label: "From", done: hasFrom },
        { label: "To", done: hasTo },
        { label: "Departure date", done: hasNoticeDate },
        { label: "Departure time", done: hasDepartureTime },
        ...(isOneTimeRoundTrip
          ? [
              { label: "Return date", done: hasReturnDate },
              { label: "Return time", done: hasReturnTime },
            ]
          : []),
      ]
    : [
        { label: "Vehicle profile", done: hasVehicle },
        { label: "From", done: hasFrom },
        { label: "To", done: hasTo },
        { label: "Departure time", done: hasDepartureTime },
        { label: "Arrival time", done: hasReturnTime },
        { label: "Available seats", done: hasSeats },
        { label: "Operating day", done: hasOperatingDays },
        { label: "Contact", done: hasContactMethod },
      ];

export const toRemainingRequiredText = (remainingRequired: string[]) => {
  const previewRemainingRequired = remainingRequired.slice(0, 4);
  const hiddenRequiredCount = Math.max(0, remainingRequired.length - previewRemainingRequired.length);

  if (!previewRemainingRequired.length) {
    return "";
  }

  return `Missing: ${previewRemainingRequired.join(", ")}${
    hiddenRequiredCount > 0 ? ` +${hiddenRequiredCount} more` : ""
  }`;
};
