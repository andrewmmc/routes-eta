import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatETA, formatCountdown } from "./api";

describe("formatETA", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00+08:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns '--' for null eta", () => {
    expect(formatETA(null)).toBe("--");
  });

  it("returns 'Arr' for eta in the past", () => {
    const pastTime = new Date("2026-01-15T11:59:00+08:00");
    expect(formatETA(pastTime)).toBe("Arr");
  });

  it("returns 'Arr' for eta at current time (0 min diff)", () => {
    const now = new Date("2026-01-15T12:00:00+08:00");
    expect(formatETA(now)).toBe("Arr");
  });

  it("returns '1 min' for eta 30 seconds in future (rounds to 1)", () => {
    // Math.round(30/60) = Math.round(0.5) = 1
    const future = new Date("2026-01-15T12:00:30+08:00");
    expect(formatETA(future)).toBe("1 min");
  });

  it("returns 'Arr' for eta 29 seconds in future (rounds to 0)", () => {
    // Math.round(29/60) = Math.round(0.483) = 0
    const future = new Date("2026-01-15T12:00:29+08:00");
    expect(formatETA(future)).toBe("Arr");
  });

  it("returns '1 min' for exactly 1 minute", () => {
    const oneMin = new Date("2026-01-15T12:01:00+08:00");
    expect(formatETA(oneMin)).toBe("1 min");
  });

  it("returns 'N mins' for N minutes (N > 1)", () => {
    const fiveMins = new Date("2026-01-15T12:05:00+08:00");
    expect(formatETA(fiveMins)).toBe("5 mins");

    const tenMins = new Date("2026-01-15T12:10:00+08:00");
    expect(formatETA(tenMins)).toBe("10 mins");

    const thirtyMins = new Date("2026-01-15T12:30:00+08:00");
    expect(formatETA(thirtyMins)).toBe("30 mins");
  });

  it("rounds to nearest minute", () => {
    // 1 min 30 sec rounds to 2 mins
    const oneHalfMin = new Date("2026-01-15T12:01:30+08:00");
    expect(formatETA(oneHalfMin)).toBe("2 mins");

    // 2 min 29 sec rounds to 2 mins
    const twoMins = new Date("2026-01-15T12:02:29+08:00");
    expect(formatETA(twoMins)).toBe("2 mins");
  });
});

describe("formatCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00+08:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns '--:--' for null eta", () => {
    expect(formatCountdown(null)).toBe("--:--");
  });

  it("returns '00:00' for eta in the past", () => {
    const pastTime = new Date("2026-01-15T11:59:00+08:00");
    expect(formatCountdown(pastTime)).toBe("00:00");
  });

  it("returns '00:00' for eta at current time", () => {
    const now = new Date("2026-01-15T12:00:00+08:00");
    expect(formatCountdown(now)).toBe("00:00");
  });

  it("formats seconds correctly (< 1 minute)", () => {
    const thirtySecs = new Date("2026-01-15T12:00:30+08:00");
    expect(formatCountdown(thirtySecs)).toBe("00:30");

    const fortyFiveSecs = new Date("2026-01-15T12:00:45+08:00");
    expect(formatCountdown(fortyFiveSecs)).toBe("00:45");
  });

  it("formats minutes and seconds correctly", () => {
    const oneMinThirty = new Date("2026-01-15T12:01:30+08:00");
    expect(formatCountdown(oneMinThirty)).toBe("01:30");

    const fiveMinsTen = new Date("2026-01-15T12:05:10+08:00");
    expect(formatCountdown(fiveMinsTen)).toBe("05:10");
  });

  it("pads single digits with zeros", () => {
    const nineSecs = new Date("2026-01-15T12:00:09+08:00");
    expect(formatCountdown(nineSecs)).toBe("00:09");

    const nineMins = new Date("2026-01-15T12:09:00+08:00");
    expect(formatCountdown(nineMins)).toBe("09:00");
  });

  it("handles large minute values", () => {
    const sixtyMins = new Date("2026-01-15T13:00:00+08:00");
    expect(formatCountdown(sixtyMins)).toBe("60:00");

    const ninetyMins = new Date("2026-01-15T13:30:00+08:00");
    expect(formatCountdown(ninetyMins)).toBe("90:00");
  });
});
