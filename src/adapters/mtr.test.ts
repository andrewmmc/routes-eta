import { describe, it, expect } from "vitest";
import { parseHktTime, toApiDirection, deriveStatus, mtrAdapter } from "./mtr";
import type { FetchParams } from "./base";

describe("parseHktTime", () => {
  it("parses valid HKT datetime string to Date", () => {
    const result = parseHktTime("2026-01-15 12:30:45");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2026-01-15T04:30:45.000Z"); // UTC = HKT - 8
  });

  it("parses midnight correctly", () => {
    const result = parseHktTime("2026-01-15 00:00:00");
    expect(result.toISOString()).toBe("2026-01-14T16:00:00.000Z");
  });

  it("parses end of day correctly", () => {
    const result = parseHktTime("2026-01-15 23:59:59");
    expect(result.toISOString()).toBe("2026-01-15T15:59:59.000Z");
  });
});

describe("toApiDirection", () => {
  it("returns 'UP' for 'up'", () => {
    expect(toApiDirection("up")).toBe("UP");
  });

  it("returns 'UP' for 'UP'", () => {
    expect(toApiDirection("UP")).toBe("UP");
  });

  it("returns 'DOWN' for 'down'", () => {
    expect(toApiDirection("down")).toBe("DOWN");
  });

  it("returns 'DOWN' for 'DOWN'", () => {
    expect(toApiDirection("DOWN")).toBe("DOWN");
  });

  it("returns null for undefined", () => {
    expect(toApiDirection(undefined)).toBe(null);
  });

  it("returns null for unknown direction", () => {
    expect(toApiDirection("left")).toBe(null);
    expect(toApiDirection("right")).toBe(null);
    expect(toApiDirection("")).toBe(null);
  });
});

describe("deriveStatus", () => {
  it("returns 'Arriving' for timetype 'A'", () => {
    expect(deriveStatus("A", false)).toBe("Arriving");
    expect(deriveStatus("A", true)).toBe("Arriving"); // timetype takes precedence
  });

  it("returns 'Departing' for timetype 'D'", () => {
    expect(deriveStatus("D", false)).toBe("Departing");
    expect(deriveStatus("D", true)).toBe("Departing"); // timetype takes precedence
  });

  it("returns 'Delayed' when isDelayed is true and no timetype", () => {
    expect(deriveStatus(undefined, true)).toBe("Delayed");
  });

  it("returns undefined when no status applies", () => {
    expect(deriveStatus(undefined, false)).toBe(undefined);
  });
});

describe("mtrAdapter.mapToBoardState", () => {
  const createMockApiResponse = (overrides = {}) => ({
    sys_time: "2026-01-15 12:00:00",
    curr_time: "2026-01-15 12:00:00",
    status: 1,
    message: "OK",
    data: {
      "TWL-CEN": {
        curr_time: "2026-01-15 12:00:00",
        sys_time: "2026-01-15 12:00:00",
        UP: [
          {
            seq: 1,
            dest: "TSW",
            plat: "1",
            time: "2026-01-15 12:05:00",
          },
          {
            seq: 2,
            dest: "TSW",
            plat: "1",
            time: "2026-01-15 12:10:00",
          },
        ],
      },
    },
    ...overrides,
  });

  const defaultParams: FetchParams = {
    stopId: "CEN",
    serviceId: "TWL",
    directionId: "up",
  };

  it("transforms valid API response to BoardState", async () => {
    const raw = createMockApiResponse();
    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);

    expect(result.operator).toEqual({
      id: "mtr",
      name: "MTR",
      nameZh: "港鐵",
    });

    expect(result.station.id).toBe("CEN");
    expect(result.station.name).toBe("Central");
    expect(result.station.nameZh).toBe("中環");

    expect(result.service.id).toBe("TWL");
    expect(result.service.name).toBe("Tsuen Wan Line");
    expect(result.service.nameZh).toBe("荃灣綫");
    expect(result.service.color).toBe("#ED1D24");

    expect(result.direction).toBe("up");
    expect(result.arrivals).toHaveLength(2);
  });

  it("sorts arrivals by seq", async () => {
    const raw = createMockApiResponse({
      data: {
        "TWL-CEN": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
          UP: [
            { seq: 3, dest: "TSW", plat: "1", time: "2026-01-15 12:15:00" },
            { seq: 1, dest: "TSW", plat: "1", time: "2026-01-15 12:05:00" },
            { seq: 2, dest: "TSW", plat: "1", time: "2026-01-15 12:10:00" },
          ],
        },
      },
    });

    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);
    expect(result.arrivals[0].eta?.toISOString()).toBe(
      "2026-01-15T04:05:00.000Z"
    );
    expect(result.arrivals[1].eta?.toISOString()).toBe(
      "2026-01-15T04:10:00.000Z"
    );
    expect(result.arrivals[2].eta?.toISOString()).toBe(
      "2026-01-15T04:15:00.000Z"
    );
  });

  it("returns empty arrivals array when no data", async () => {
    const raw = createMockApiResponse({
      data: {
        "TWL-CEN": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
        },
      },
    });

    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);
    expect(result.arrivals).toHaveLength(0);
  });

  it("includes platform in arrival when capability enabled", async () => {
    const raw = createMockApiResponse();
    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);

    expect(mtrAdapter.capabilities.hasPlatform).toBe(true);
    expect(result.arrivals[0].platform).toBe("1");
  });

  it("includes destination info from station data", async () => {
    const raw = createMockApiResponse();
    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);

    expect(result.arrivals[0].destination).toBe("Tsuen Wan");
    expect(result.arrivals[0].destinationZh).toBe("荃灣");
  });

  it("falls back to station code when station not found", async () => {
    const raw = createMockApiResponse({
      data: {
        "TWL-CEN": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
          UP: [
            { seq: 1, dest: "UNKNOWN", plat: "1", time: "2026-01-15 12:05:00" },
          ],
        },
      },
    });

    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);
    expect(result.arrivals[0].destination).toBe("UNKNOWN");
    expect(result.arrivals[0].destinationZh).toBe("UNKNOWN");
  });

  it("appends 'via Racecourse' when route is RAC", async () => {
    const raw = createMockApiResponse({
      data: {
        "EAL-HUH": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
          UP: [
            {
              seq: 1,
              dest: "LOW",
              plat: "1",
              time: "2026-01-15 12:05:00",
              route: "RAC",
            },
          ],
        },
      },
    });

    const params: FetchParams = {
      stopId: "HUH",
      serviceId: "EAL",
      directionId: "up",
    };

    const result = await mtrAdapter.mapToBoardState(raw, params);
    expect(result.arrivals[0].destination).toContain("via Racecourse");
    expect(result.arrivals[0].destinationZh).toContain("經馬場");
  });

  it("handles DOWN direction", async () => {
    const raw = createMockApiResponse({
      data: {
        "TWL-TSW": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
          DOWN: [
            { seq: 1, dest: "CEN", plat: "2", time: "2026-01-15 12:05:00" },
          ],
        },
      },
    });

    const params: FetchParams = {
      stopId: "TSW",
      serviceId: "TWL",
      directionId: "down",
    };

    const result = await mtrAdapter.mapToBoardState(raw, params);
    expect(result.direction).toBe("down");
    expect(result.arrivals).toHaveLength(1);
    expect(result.arrivals[0].destination).toBe("Central");
  });

  it("combines UP and DOWN when no direction specified", async () => {
    const raw = createMockApiResponse({
      data: {
        "TWL-CEN": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
          UP: [{ seq: 1, dest: "TSW", plat: "1", time: "2026-01-15 12:05:00" }],
          DOWN: [
            { seq: 1, dest: "CEN", plat: "2", time: "2026-01-15 12:03:00" },
          ],
        },
      },
    });

    const params: FetchParams = {
      stopId: "CEN",
      serviceId: "TWL",
      directionId: undefined,
    };

    const result = await mtrAdapter.mapToBoardState(raw, params);
    expect(result.arrivals).toHaveLength(2);
  });

  it("sets isArrived when curr_time equals arrival time", async () => {
    const raw = createMockApiResponse({
      data: {
        "TWL-CEN": {
          curr_time: "2026-01-15 12:05:00",
          sys_time: "2026-01-15 12:00:00",
          UP: [
            { seq: 1, dest: "TSW", plat: "1", time: "2026-01-15 12:05:00" },
            { seq: 2, dest: "TSW", plat: "1", time: "2026-01-15 12:10:00" },
          ],
        },
      },
    });

    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);
    expect(result.arrivals[0].isArrived).toBe(true);
    expect(result.arrivals[1].isArrived).toBe(false);
  });

  it("throws error when API status is not 1", async () => {
    const raw = createMockApiResponse({
      status: 0,
      message: "Error",
    });

    await expect(
      mtrAdapter.mapToBoardState(raw, defaultParams)
    ).rejects.toThrow("MTR API returned failure status");
  });

  it("sets status to 'Delayed' when isdelay is Y", async () => {
    const raw = createMockApiResponse({
      isdelay: "Y",
    });

    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);
    expect(result.arrivals[0].status).toBe("Delayed");
  });

  it("sets status based on timetype (takes precedence over isdelay)", async () => {
    const raw = createMockApiResponse({
      isdelay: "Y",
      data: {
        "TWL-CEN": {
          curr_time: "2026-01-15 12:00:00",
          sys_time: "2026-01-15 12:00:00",
          UP: [
            {
              seq: 1,
              dest: "TSW",
              plat: "1",
              time: "2026-01-15 12:05:00",
              timetype: "A",
            },
          ],
        },
      },
    });

    const result = await mtrAdapter.mapToBoardState(raw, defaultParams);
    expect(result.arrivals[0].status).toBe("Arriving");
  });
});
