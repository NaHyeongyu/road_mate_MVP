import { describe, expect, it } from "vitest";

import {
  formatRouteTime,
  isRouteDateValue,
  isRouteTimeValue,
  normalizeSeatsInput,
  toDateFromRouteDate,
  toDateFromRouteTime,
  toRouteDateFromDate,
  toRouteTimeFromDate,
  toggleOperatingDay,
} from "./routeForm";
import type { RouteDraft } from "../../../model";

const baseDraft: RouteDraft = {
  kind: "regular",
  oneTimeTripType: "round_trip",
  noticeDate: "",
  from: "Brisbane",
  to: "St Lucia",
  schedule: "08:30",
  returnSchedule: "17:30",
  availableSeats: "3",
  operatingDays: ["Mon", "Wed"],
  contactPhone: "",
  contactLink: "",
  note: "",
  isPublic: true,
};

describe("routeForm utilities", () => {
  it("validates route time and date formats", () => {
    expect(isRouteTimeValue("00:00")).toBe(true);
    expect(isRouteTimeValue("23:59")).toBe(true);
    expect(isRouteTimeValue("24:00")).toBe(false);
    expect(isRouteTimeValue("9:00")).toBe(false);

    expect(isRouteDateValue("2024-02-29")).toBe(true);
    expect(isRouteDateValue("2023-02-29")).toBe(false);
    expect(isRouteDateValue("2026-13-01")).toBe(false);
  });

  it("formats and parses route time/date consistently", () => {
    const dateTime = new Date(2026, 3, 13, 9, 5, 0, 0);
    expect(formatRouteTime(9, 5)).toBe("09:05");
    expect(toRouteTimeFromDate(dateTime)).toBe("09:05");
    expect(toRouteDateFromDate(dateTime)).toBe("2026-04-13");

    const parsedTime = toDateFromRouteTime("09:05");
    expect(parsedTime.getHours()).toBe(9);
    expect(parsedTime.getMinutes()).toBe(5);

    const parsedDate = toDateFromRouteDate("2026-04-13");
    expect(parsedDate.getFullYear()).toBe(2026);
    expect(parsedDate.getMonth()).toBe(3);
    expect(parsedDate.getDate()).toBe(13);
  });

  it("normalizes seat input to max 8 and digits only", () => {
    expect(normalizeSeatsInput("abc")).toBe("");
    expect(normalizeSeatsInput("0")).toBe("0");
    expect(normalizeSeatsInput("12")).toBe("8");
    expect(normalizeSeatsInput("7a9")).toBe("8");
  });

  it("toggles operating day while preserving weekday order", () => {
    expect(toggleOperatingDay(baseDraft, "Tue")).toEqual(["Mon", "Tue", "Wed"]);
    expect(toggleOperatingDay(baseDraft, "Mon")).toEqual(["Wed"]);
  });
});
