export type RequiredCheck = {
  label: string;
  done: boolean;
};

export type RequiredFieldLabels = {
  vehicleProfile: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  departureTime: string;
  returnTime: string;
  arrivalTime: string;
  availableSeats: string;
  operatingDay: string;
  contact: string;
};

type BuildRequiredChecksArgs = {
  labels: RequiredFieldLabels;
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

export const normalizeSeatCount = (value: number, min = 1, max = 8) =>
  Math.min(max, Math.max(min, value));

export const buildRequiredChecks = ({
  labels,
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
        { label: labels.vehicleProfile, done: hasVehicle },
        { label: labels.from, done: hasFrom },
        { label: labels.to, done: hasTo },
        { label: labels.departureDate, done: hasNoticeDate },
        { label: labels.departureTime, done: hasDepartureTime },
        { label: labels.contact, done: hasContactMethod },
        ...(isOneTimeRoundTrip
          ? [
              { label: labels.returnDate, done: hasReturnDate },
              { label: labels.returnTime, done: hasReturnTime },
            ]
          : []),
      ]
    : [
        { label: labels.vehicleProfile, done: hasVehicle },
        { label: labels.from, done: hasFrom },
        { label: labels.to, done: hasTo },
        { label: labels.departureTime, done: hasDepartureTime },
        { label: labels.arrivalTime, done: hasReturnTime },
        { label: labels.availableSeats, done: hasSeats },
        { label: labels.operatingDay, done: hasOperatingDays },
        { label: labels.contact, done: hasContactMethod },
      ];
