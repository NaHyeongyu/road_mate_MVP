export type RouteKind = "regular" | "one_time";
export type OneTimeTripType = "one_way" | "round_trip";

export type VehicleInfo = {
  model: string;
  plate: string;
  note: string;
  contactPhone: string;
  contactLink: string;
};

export type RoutePost = {
  id: string;
  kind: RouteKind;
  isActive?: boolean;
  oneTimeTripType?: OneTimeTripType;
  noticeDate?: string;
  returnDate?: string;
  from: string;
  to: string;
  schedule: string;
  returnSchedule?: string;
  availableSeats: number;
  operatingDays: string[];
  contactPhone?: string;
  contactLink?: string;
  note: string;
  vehicleModel: string;
  vehiclePlate: string;
  ownerUserId: string;
  ownerName: string;
  isPublic: boolean;
  createdAt: string;
};

export type RouteDraft = {
  kind: RouteKind;
  oneTimeTripType: OneTimeTripType;
  noticeDate: string;
  returnDate?: string;
  from: string;
  to: string;
  schedule: string;
  returnSchedule: string;
  availableSeats: string;
  operatingDays: string[];
  contactPhone: string;
  contactLink: string;
  note: string;
  isPublic: boolean;
};

export const EMPTY_VEHICLE: VehicleInfo = {
  model: "",
  plate: "",
  note: "",
  contactPhone: "",
  contactLink: "",
};

export const EMPTY_ROUTE_DRAFT: RouteDraft = {
  kind: "regular" as RouteKind,
  oneTimeTripType: "round_trip",
  noticeDate: "",
  returnDate: "",
  from: "",
  to: "",
  schedule: "",
  returnSchedule: "",
  availableSeats: "1",
  operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  contactPhone: "",
  contactLink: "",
  note: "",
  isPublic: true,
};
