import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { filterByMaxEta, MAX_ETA_MS } from "./useBoardData";
import type { Arrival } from "../models";

describe("filterByMaxEta", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00+08:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty array for empty input", () => {
    expect(filterByMaxEta([])).toEqual([]);
  });

  it("returns all arrivals within 99 minutes", () => {
    const arrivals: Arrival[] = [
      { eta: new Date("2026-01-15T12:05:00+08:00") }, // 5 mins
      { eta: new Date("2026-01-15T12:30:00+08:00") }, // 30 mins
      { eta: new Date("2026-01-15T13:39:00+08:00") }, // 99 mins exactly
    ];

    const result = filterByMaxEta(arrivals);
    expect(result).toHaveLength(3);
  });

  it("filters out arrivals beyond 99 minutes", () => {
    const arrivals: Arrival[] = [
      { eta: new Date("2026-01-15T12:30:00+08:00") }, // 30 mins - keep
      { eta: new Date("2026-01-15T13:40:00+08:00") }, // 100 mins - filter
      { eta: new Date("2026-01-15T14:00:00+08:00") }, // 120 mins - filter
    ];

    const result = filterByMaxEta(arrivals);
    expect(result).toHaveLength(1);
    expect(result[0].eta?.toISOString()).toBe(
      new Date("2026-01-15T12:30:00+08:00").toISOString()
    );
  });

  it("keeps arrivals with null eta", () => {
    const arrivals: Arrival[] = [
      { eta: null },
      { eta: new Date("2026-01-15T12:30:00+08:00") },
    ];

    const result = filterByMaxEta(arrivals);
    expect(result).toHaveLength(2);
  });

  it("keeps arrivals in the past or at current time", () => {
    const arrivals: Arrival[] = [
      { eta: new Date("2026-01-15T11:30:00+08:00") }, // 30 mins ago
      { eta: new Date("2026-01-15T12:00:00+08:00") }, // now
      { eta: new Date("2026-01-15T12:30:00+08:00") }, // 30 mins future
    ];

    const result = filterByMaxEta(arrivals);
    expect(result).toHaveLength(3);
  });

  it("handles edge case exactly at 99 minutes", () => {
    const arrivals: Arrival[] = [
      { eta: new Date("2026-01-15T13:39:00+08:00") }, // exactly 99 mins
    ];

    const result = filterByMaxEta(arrivals);
    expect(result).toHaveLength(1);
  });

  it("handles edge case just over 99 minutes", () => {
    const arrivals: Arrival[] = [
      { eta: new Date("2026-01-15T13:39:01+08:00") }, // 99 mins 1 sec
    ];

    const result = filterByMaxEta(arrivals);
    expect(result).toHaveLength(0);
  });

  it("preserves other arrival properties", () => {
    const arrivals: Arrival[] = [
      {
        eta: new Date("2026-01-15T12:30:00+08:00"),
        platform: "1",
        destination: "Tsuen Wan",
        destinationZh: "荃灣",
        status: "Departing",
      },
    ];

    const result = filterByMaxEta(arrivals);
    expect(result[0].platform).toBe("1");
    expect(result[0].destination).toBe("Tsuen Wan");
    expect(result[0].destinationZh).toBe("荃灣");
    expect(result[0].status).toBe("Departing");
  });
});

describe("MAX_ETA_MS constant", () => {
  it("is 99 minutes in milliseconds", () => {
    expect(MAX_ETA_MS).toBe(99 * 60 * 1000);
    expect(MAX_ETA_MS).toBe(5940000);
  });
});
