import { describe, it, expect } from "vitest";
import {
  getBoardConfig,
  getBoardConfigFromParams,
  BOARD_CONFIGS,
} from "./board-configs";

describe("getBoardConfig", () => {
  it("returns undefined for invalid id", () => {
    expect(getBoardConfig("nonexistent")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getBoardConfig("")).toBeUndefined();
  });
});

describe("getBoardConfigFromParams", () => {
  it("returns default config for unknown operator/service/stop", () => {
    const config = getBoardConfigFromParams("unknown", "UNKNOWN", "UNKNOWN");

    expect(config.id).toBe("unknown-UNKNOWN-UNKNOWN");
    expect(config.operatorId).toBe("unknown");
    expect(config.serviceId).toBe("UNKNOWN");
    expect(config.stopId).toBe("UNKNOWN");
    expect(config.layout.rows).toBe(4);
    expect(config.layout.columns).toBe(1);
    expect(config.layout.showPlatform).toBe(true);
    expect(config.layout.showCrowding).toBe(false);
  });

  it("returns default config for MTR line", () => {
    const config = getBoardConfigFromParams("mtr", "TWL", "CEN", "up");

    expect(config.id).toBe("mtr-TWL-CEN");
    expect(config.operatorId).toBe("mtr");
    expect(config.serviceId).toBe("TWL");
    expect(config.stopId).toBe("CEN");
    expect(config.directionId).toBe("up");
    expect(config.layout.showPlatform).toBe(true);
  });

  it("returns config without directionId when not specified", () => {
    const config = getBoardConfigFromParams("mtr", "TWL", "CEN");

    expect(config.directionId).toBeUndefined();
  });

  it("returns config with directionId when specified", () => {
    const configUp = getBoardConfigFromParams("mtr", "TWL", "CEN", "up");
    expect(configUp.directionId).toBe("up");

    const configDown = getBoardConfigFromParams("mtr", "TWL", "TSW", "down");
    expect(configDown.directionId).toBe("down");
  });

  it("returns default layout for any MTR line", () => {
    const lines = [
      "TWL",
      "ISL",
      "KTL",
      "EAL",
      "TML",
      "TCL",
      "TKL",
      "AEL",
      "DRL",
      "SIL",
    ];

    for (const line of lines) {
      const config = getBoardConfigFromParams("mtr", line, "CEN");
      expect(config.layout.rows).toBe(4);
      expect(config.layout.showPlatform).toBe(true);
      expect(config.layout.showCrowding).toBe(false);
      expect(config.layout.showTrainLength).toBe(false);
    }
  });

  it("generates consistent id from params", () => {
    const config1 = getBoardConfigFromParams("mtr", "TWL", "CEN");
    const config2 = getBoardConfigFromParams("mtr", "TWL", "CEN");

    expect(config1.id).toBe(config2.id);
    expect(config1.id).toBe("mtr-TWL-CEN");
  });
});

describe("BOARD_CONFIGS", () => {
  it("is currently empty (all configs are dynamic)", () => {
    expect(Object.keys(BOARD_CONFIGS)).toHaveLength(0);
  });
});
