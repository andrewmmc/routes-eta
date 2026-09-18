import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../hooks/useNow", () => ({
  useNow: () => Date.parse("2024-01-01T12:00:00Z"),
}));

vi.mock("@/constants/mtr-labels", () => ({
  getMtrLabels: () => ({
    arriving: "Arriving",
    departing: "Departing",
    minutes: "min",
    noSchedule: "--",
  }),
}));

vi.mock("@/utils/styles", () => ({
  getRowBgClass: () => "",
  getLanguageFontClass: () => "",
  MTR_COLORS: { defaultLine: "#000000" },
  MTR_TIMING: { clockUpdateMs: 1_000, arrivingThresholdMs: 60_000 },
}));

import { MTRArrivalRow } from "./MTRArrivalRow";

const elapsedArrival = {
  eta: new Date("2024-01-01T11:58:00Z"),
  destination: "Central",
  destinationZh: "中環",
  platform: "1",
} as const;

describe("MTRArrivalRow", () => {
  it("shows arriving instead of negative minutes for an elapsed ETA", () => {
    const markup = renderToStaticMarkup(
      <MTRArrivalRow arrival={elapsedArrival} index={0} language="en" />
    );

    expect(markup).toContain("Arriving");
    expect(markup).not.toContain(">-2<");
  });

  it("shows departing at a departure station for an elapsed ETA", () => {
    const markup = renderToStaticMarkup(
      <MTRArrivalRow
        arrival={elapsedArrival}
        index={0}
        language="en"
        isDepartureStation
      />
    );

    expect(markup).toContain("Departing");
    expect(markup).not.toContain(">-2<");
  });
});
