import { describe, expect, it } from "vitest";
import { validateBoardRouteParams } from "./validation";

describe("validateBoardRouteParams", () => {
  it("accepts valid MTR routes with or without a direction", () => {
    expect(validateBoardRouteParams(["mtr", "TWL", "CEN"])).toBe(true);
    expect(validateBoardRouteParams(["mtr", "TWL", "CEN", "down"])).toBe(true);
  });

  it("rejects unsupported operators and invalid MTR parameters", () => {
    expect(validateBoardRouteParams(["kmb", "960", "CEN", "outbound"])).toBe(
      false
    );
    expect(validateBoardRouteParams(["mtr", "BAD", "CEN"])).toBe(false);
    expect(validateBoardRouteParams(["mtr", "TWL", "BAD"])).toBe(false);
    expect(validateBoardRouteParams(["mtr", "TWL", "CEN", "sideways"])).toBe(
      false
    );
  });

  it("rejects missing and excess route segments", () => {
    expect(validateBoardRouteParams(undefined)).toBe(false);
    expect(validateBoardRouteParams(["mtr", "TWL"])).toBe(false);
    expect(
      validateBoardRouteParams(["mtr", "TWL", "CEN", "down", "extra"])
    ).toBe(false);
  });
});
