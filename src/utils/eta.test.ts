import { describe, it, expect } from "vitest";
import { getEtaMinutes, isWithinArrivingWindow } from "./eta";

const NOW = Date.parse("2024-01-01T12:00:00Z");

describe("getEtaMinutes", () => {
  it("returns null when eta is missing or invalid", () => {
    expect(getEtaMinutes(null, NOW)).toBeNull();
    expect(getEtaMinutes(new Date(Number.NaN), NOW)).toBeNull();
  });

  it("uses ceiling so 2 min 1 sec displays as 3 minutes", () => {
    expect(getEtaMinutes(new Date("2024-01-01T12:02:01Z"), NOW)).toBe(3);
  });

  it("returns exact minutes at whole-minute boundaries", () => {
    expect(getEtaMinutes(new Date("2024-01-01T12:02:00Z"), NOW)).toBe(2);
    expect(getEtaMinutes(new Date("2024-01-01T12:00:00Z"), NOW)).toBe(0);
  });

  it("ceils a 30-second remainder to 1 minute", () => {
    expect(getEtaMinutes(new Date("2024-01-01T12:00:30Z"), NOW)).toBe(1);
  });
});

describe("isWithinArrivingWindow", () => {
  it("is true within the threshold in either direction", () => {
    expect(
      isWithinArrivingWindow(new Date("2024-01-01T12:00:30Z"), NOW, 60_000)
    ).toBe(true);
    expect(
      isWithinArrivingWindow(new Date("2024-01-01T11:59:30Z"), NOW, 60_000)
    ).toBe(true);
  });

  it("is false outside the threshold or without an eta", () => {
    expect(
      isWithinArrivingWindow(new Date("2024-01-01T12:01:01Z"), NOW, 60_000)
    ).toBe(false);
    expect(isWithinArrivingWindow(null, NOW, 60_000)).toBe(false);
  });
});
