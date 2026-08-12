import { describe, expect, it } from "vitest";
import {
  getStaticBoardRoutes,
  injectRouteParams,
} from "./generate-static-board-pages";
import type { DirectionEntry } from "./generate-mtr-data";

const entries: DirectionEntry[] = [
  {
    lineCode: "TWL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      {
        code: "CEN",
        id: "1",
        nameZh: "中環",
        nameEn: "Central",
        sequence: 1,
      },
      {
        code: "TSW",
        id: "25",
        nameZh: "荃灣",
        nameEn: "Tsuen Wan",
        sequence: 2,
      },
    ],
    startTermini: ["CEN"],
    endTermini: ["TSW"],
  },
  {
    lineCode: "TWL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      {
        code: "TSW",
        id: "25",
        nameZh: "荃灣",
        nameEn: "Tsuen Wan",
        sequence: 1,
      },
      {
        code: "CEN",
        id: "1",
        nameZh: "中環",
        nameEn: "Central",
        sequence: 2,
      },
    ],
    startTermini: ["TSW"],
    endTermini: ["CEN"],
  },
];

describe("getStaticBoardRoutes", () => {
  it("creates unique directionless and directional routes", () => {
    expect(getStaticBoardRoutes(entries)).toEqual([
      ["mtr", "TWL", "CEN"],
      ["mtr", "TWL", "CEN", "down"],
      ["mtr", "TWL", "CEN", "up"],
      ["mtr", "TWL", "TSW"],
      ["mtr", "TWL", "TSW", "down"],
      ["mtr", "TWL", "TSW", "up"],
    ]);
  });
});

describe("injectRouteParams", () => {
  it("injects route parameters into the exported Next.js data", () => {
    const html = '<script>{"page":"/board/[...params]","query":{}}</script>';
    expect(injectRouteParams(html, ["mtr", "TWL", "CEN", "down"])).toBe(
      '<script>{"page":"/board/[...params]","query":{"params":["mtr","TWL","CEN","down"]}}</script>'
    );
  });

  it("rejects an unexpected template shape", () => {
    expect(() => injectRouteParams("<html></html>", ["mtr"])).toThrow(
      "missing an empty Next.js query"
    );
  });
});
