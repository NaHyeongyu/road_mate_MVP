import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EMPTY_VEHICLE } from "../../../model";
import {
  formatNoticeCountdown,
  getNoticeDayDelta,
  getPostSaveKey,
  parsePosts,
  parseSavedPostKeys,
  parseVehicle,
  sortByNewest,
} from "./storage";

describe("storage utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("parses vehicle JSON and falls back on invalid payload", () => {
    expect(parseVehicle(null)).toEqual(EMPTY_VEHICLE);
    expect(parseVehicle("{invalid")).toEqual(EMPTY_VEHICLE);

    expect(
      parseVehicle(
        JSON.stringify({
          model: "  Kia ",
          plate: " 123ABC ",
          note: " note ",
          contactPhone: " 0412 ",
          contactLink: " https://open.kakao.com/o/abc ",
        })
      )
    ).toEqual({
      model: "Kia",
      plate: "123ABC",
      note: "note",
      contactPhone: "0412",
      contactLink: "https://open.kakao.com/o/abc",
    });
  });

  it("parses posts, filters invalid records, and infers one-time round trip", () => {
    const parsed = parsePosts(
      JSON.stringify([
        {
          id: "regular-1",
          kind: "regular",
          from: "Brisbane",
          to: "St Lucia",
          schedule: "08:30",
          returnSchedule: "17:30",
          availableSeats: 3,
          operatingDays: ["Mon", "Tue"],
          vehicleModel: "Kia",
          vehiclePlate: "123ABC",
          ownerUserId: "driver-1",
          ownerName: "Driver One",
          isPublic: true,
          createdAt: "2026-04-12T00:00:00.000Z",
        },
        {
          id: "notice-1",
          kind: "one_time",
          from: "A",
          to: "B",
          schedule: "09:00",
          returnSchedule: "12:00",
          availableSeats: 1,
          operatingDays: [],
          vehicleModel: "Kia",
          vehiclePlate: "123ABC",
          ownerUserId: "driver-2",
          ownerName: "Driver Two",
          noticeDate: "2026-04-14",
          isPublic: true,
          createdAt: "2026-04-13T00:00:00.000Z",
        },
        {
          id: "invalid",
          kind: "regular",
          from: "",
          to: "St Lucia",
          schedule: "09:00",
          vehicleModel: "Kia",
          vehiclePlate: "123ABC",
          ownerUserId: "driver-3",
          createdAt: "2026-04-13T00:00:00.000Z",
        },
      ])
    );

    expect(parsed).toHaveLength(2);
    const oneTime = parsed.find((post) => post.id === "notice-1");
    expect(oneTime?.kind).toBe("one_time");
    expect(oneTime?.oneTimeTripType).toBe("round_trip");
  });

  it("deduplicates saved post keys and builds save keys", () => {
    expect(parseSavedPostKeys(JSON.stringify(["a", "a", "b", " "]))).toEqual(["a", "b"]);
    expect(getPostSaveKey({ ownerUserId: "driver-1", id: "route-1" })).toBe("driver-1:route-1");
  });

  it("sorts posts by newest createdAt", () => {
    const sorted = sortByNewest([
      {
        id: "1",
        ownerUserId: "u",
        kind: "regular",
        from: "A",
        to: "B",
        schedule: "08:00",
        availableSeats: 1,
        operatingDays: [],
        note: "",
        vehicleModel: "Kia",
        vehiclePlate: "1",
        ownerName: "N",
        isPublic: true,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        ownerUserId: "u",
        kind: "regular",
        from: "A",
        to: "B",
        schedule: "08:00",
        availableSeats: 1,
        operatingDays: [],
        note: "",
        vehicleModel: "Kia",
        vehiclePlate: "1",
        ownerName: "N",
        isPublic: true,
        createdAt: "2026-02-01T00:00:00.000Z",
      },
    ]);

    expect(sorted.map((post) => post.id)).toEqual(["2", "1"]);
  });

  it("computes notice day delta and countdown labels", () => {
    expect(getNoticeDayDelta("2026-04-13")).toBe(0);
    expect(getNoticeDayDelta("2026-04-14")).toBe(1);
    expect(getNoticeDayDelta("2026-04-12")).toBe(-1);

    expect(formatNoticeCountdown(0)).toBe("Today");
    expect(formatNoticeCountdown(1)).toBe("Tomorrow");
    expect(formatNoticeCountdown(-1)).toBe("Past");
    expect(formatNoticeCountdown(null)).toBe("Date TBD");
  });
});
