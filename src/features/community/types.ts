import type { RouteKind } from "../../model";

export type Mode = "rider" | "driver";
export type Filter = RouteKind;
export type MainTab = "home" | "saved" | "mypage";
export type AustralianStateCode = "QLD" | "NSW" | "VIC" | "WA" | "SA" | "TAS" | "NT" | "ACT";
export type StateFilter = "ALL" | AustralianStateCode;
