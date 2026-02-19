import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock dependencies before importing the module
vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({ t: (key: string) => key, language: "en" }),
}));

vi.mock("@/utils/localization", () => ({
  getLocalizedName: (obj: { name: string }) => obj.name,
}));

import { formatETA } from "./ArrivalRow";

describe("formatETA", () => {
  const baseTime = new Date("2024-01-01T12:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns '--' for null eta", () => {
    expect(formatETA(null)).toBe("--");
  });

  it("returns 'Arr' for past time", () => {
    const pastTime = new Date("2024-01-01T11:59:00Z");
    expect(formatETA(pastTime)).toBe("Arr");
  });

  it("returns 'Arr' for current time", () => {
    expect(formatETA(baseTime)).toBe("Arr");
  });

  it("returns '1 min' for 1 minute in future", () => {
    const future = new Date("2024-01-01T12:01:00Z");
    expect(formatETA(future)).toBe("1 min");
  });

  it("returns '1 min' for 30 seconds in future (rounds to 1)", () => {
    const future = new Date("2024-01-01T12:00:30Z");
    expect(formatETA(future)).toBe("1 min");
  });

  it("returns '2 mins' for 90 seconds in future (rounds to 2)", () => {
    const future = new Date("2024-01-01T12:01:30Z");
    expect(formatETA(future)).toBe("2 mins");
  });

  it("returns '5 mins' for 5 minutes in future", () => {
    const future = new Date("2024-01-01T12:05:00Z");
    expect(formatETA(future)).toBe("5 mins");
  });

  it("returns '10 mins' for 10 minutes in future", () => {
    const future = new Date("2024-01-01T12:10:00Z");
    expect(formatETA(future)).toBe("10 mins");
  });

  it("returns '30 mins' for 30 minutes in future", () => {
    const future = new Date("2024-01-01T12:30:00Z");
    expect(formatETA(future)).toBe("30 mins");
  });

  it("returns '2 mins' for 2 minutes in future", () => {
    const future = new Date("2024-01-01T12:02:00Z");
    expect(formatETA(future)).toBe("2 mins");
  });
});
