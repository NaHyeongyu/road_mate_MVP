import { describe, expect, it } from "vitest";

import type { RoutePost } from "../../../model";
import { matchesRoutePostStateFilter } from "./stateFilter";

const createPost = (patch: Partial<RoutePost> = {}): RoutePost => ({
  id: "post-1",
  kind: "regular",
  oneTimeTripType: undefined,
  noticeDate: undefined,
  from: "Sydney, NSW 2000",
  to: "Parramatta, NSW 2150",
  schedule: "08:00",
  returnSchedule: "17:00",
  availableSeats: 3,
  operatingDays: ["Mon"],
  contactPhone: "",
  contactLink: "",
  note: "",
  vehicleModel: "Kia Carnival",
  vehiclePlate: "ABC123",
  ownerUserId: "driver-1",
  ownerName: "Driver One",
  isPublic: true,
  createdAt: "2026-04-14T00:00:00.000Z",
  ...patch,
});

describe("matchesRoutePostStateFilter", () => {
  it("matches all states when ALL is selected", () => {
    expect(matchesRoutePostStateFilter(createPost(), "ALL")).toBe(true);
  });

  it("matches abbreviations in from/to text", () => {
    expect(matchesRoutePostStateFilter(createPost(), "NSW")).toBe(true);
    expect(matchesRoutePostStateFilter(createPost(), "QLD")).toBe(false);
  });

  it("matches full state names in from/to text", () => {
    const vicPost = createPost({
      from: "Melbourne, Victoria 3000",
      to: "Geelong, VIC 3220",
    });

    expect(matchesRoutePostStateFilter(vicPost, "VIC")).toBe(true);
  });
});
