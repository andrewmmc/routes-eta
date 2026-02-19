import { describe, it, expect } from "vitest";
import {
  getAdapter,
  isOperatorSupported,
  getSupportedOperators,
} from "./index";

describe("getAdapter", () => {
  it("returns MTR adapter for 'mtr'", () => {
    const adapter = getAdapter("mtr");
    expect(adapter.operatorId).toBe("mtr");
    expect(adapter.capabilities.hasPlatform).toBe(true);
    expect(adapter.capabilities.hasCrowding).toBe(false);
  });

  it("throws error for unknown operator", () => {
    expect(() => getAdapter("unknown")).toThrow("Unknown operator: unknown");
  });

  it("throws error for 'kmb' (not yet implemented)", () => {
    expect(() => getAdapter("kmb")).toThrow("Unknown operator: kmb");
  });
});

describe("isOperatorSupported", () => {
  it("returns true for 'mtr'", () => {
    expect(isOperatorSupported("mtr")).toBe(true);
  });

  it("returns false for unknown operator", () => {
    expect(isOperatorSupported("unknown")).toBe(false);
  });

  it("returns false for 'kmb' (not yet implemented)", () => {
    expect(isOperatorSupported("kmb")).toBe(false);
  });

  it("returns false for 'citybus' (not yet implemented)", () => {
    expect(isOperatorSupported("citybus")).toBe(false);
  });

  it("returns false for 'ferry' (not yet implemented)", () => {
    expect(isOperatorSupported("ferry")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isOperatorSupported("")).toBe(false);
  });
});

describe("getSupportedOperators", () => {
  it("returns array containing 'mtr'", () => {
    const operators = getSupportedOperators();
    expect(operators).toContain("mtr");
  });

  it("returns array with at least one operator", () => {
    const operators = getSupportedOperators();
    expect(operators.length).toBeGreaterThanOrEqual(1);
  });

  it("returns only currently supported operators", () => {
    const operators = getSupportedOperators();
    expect(operators).not.toContain("kmb");
    expect(operators).not.toContain("citybus");
    expect(operators).not.toContain("ferry");
  });
});
