import { describe, it, expect } from "vitest";
import { getLocalizedName, formatLocalizedTime } from "./localization";

describe("getLocalizedName", () => {
  it("returns name field for English", () => {
    const obj = { name: "Central", nameZh: "中環" };
    expect(getLocalizedName(obj, "en")).toBe("Central");
  });

  it("returns nameZh field for Chinese", () => {
    const obj = { name: "Central", nameZh: "中環" };
    expect(getLocalizedName(obj, "zh")).toBe("中環");
  });

  it("falls back to name when nameZh is missing and lang is zh", () => {
    const obj = { name: "Central" };
    expect(getLocalizedName(obj, "zh")).toBe("Central");
  });

  it("falls back to name when nameZh is empty string", () => {
    const obj = { name: "Central", nameZh: "" };
    // Empty string is falsy, so should fall back
    expect(getLocalizedName(obj, "zh")).toBe("Central");
  });

  it("handles objects with only name", () => {
    const obj = { name: "Tsuen Wan" };
    expect(getLocalizedName(obj, "en")).toBe("Tsuen Wan");
    expect(getLocalizedName(obj, "zh")).toBe("Tsuen Wan");
  });
});

describe("formatLocalizedTime", () => {
  it("formats time in en-US locale for English", () => {
    const date = new Date("2026-01-15T14:30:45+08:00");
    const result = formatLocalizedTime(date, "en");
    // 24-hour format: HH:MM:SS
    expect(result).toBe("14:30:45");
  });

  it("formats time in zh-HK locale for Chinese", () => {
    const date = new Date("2026-01-15T14:30:45+08:00");
    const result = formatLocalizedTime(date, "zh");
    // 24-hour format: HH:MM:SS
    expect(result).toBe("14:30:45");
  });

  it("formats midnight correctly", () => {
    const date = new Date("2026-01-15T00:00:00+08:00");
    expect(formatLocalizedTime(date, "en")).toBe("00:00:00");
    expect(formatLocalizedTime(date, "zh")).toBe("00:00:00");
  });

  it("pads single digit hours/minutes/seconds", () => {
    const date = new Date("2026-01-15T09:05:03+08:00");
    expect(formatLocalizedTime(date, "en")).toBe("09:05:03");
  });

  it("formats end of day correctly", () => {
    const date = new Date("2026-01-15T23:59:59+08:00");
    expect(formatLocalizedTime(date, "en")).toBe("23:59:59");
  });
});
