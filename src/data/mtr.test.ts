import { describe, it, expect } from "vitest";
import {
  MTR_LINES,
  getMtrLineDirections,
  getMtrStationInfo,
  getMtrDirectionEntry,
  getDirectionLabel,
  getDirectionLabelZh,
} from "./mtr";

describe("getMtrLineDirections", () => {
  it("returns direction entries for EAL including LMC branch", () => {
    const directions = getMtrLineDirections("EAL");
    expect(directions.length).toBeGreaterThan(0);

    // EAL should have multiple directions (including LMC branch)
    const directionTypes = directions.map((d) => d.urlDirection);
    expect(directionTypes).toContain("up");
    expect(directionTypes).toContain("down");
  });

  it("returns empty array for unknown line", () => {
    const directions = getMtrLineDirections("UNKNOWN");
    expect(directions).toEqual([]);
  });

  it("returns directions for TWL", () => {
    const directions = getMtrLineDirections("TWL");
    expect(directions.length).toBeGreaterThan(0);
    expect(directions[0].lineCode).toBe("TWL");
  });
});

describe("getMtrStationInfo", () => {
  it("returns correct station info for TWL CEN", () => {
    const station = getMtrStationInfo("TWL", "CEN");
    expect(station).toBeDefined();
    expect(station?.nameEn).toBe("Central");
    expect(station?.nameZh).toBe("中環");
    expect(station?.code).toBe("CEN");
  });

  it("returns correct station info for TWL TSW", () => {
    const station = getMtrStationInfo("TWL", "TSW");
    expect(station).toBeDefined();
    expect(station?.nameEn).toBe("Tsuen Wan");
    expect(station?.nameZh).toBe("荃灣");
  });

  it("returns undefined for nonexistent station", () => {
    const station = getMtrStationInfo("TWL", "NONEXISTENT");
    expect(station).toBeUndefined();
  });

  it("returns undefined for nonexistent line", () => {
    const station = getMtrStationInfo("UNKNOWN", "CEN");
    expect(station).toBeUndefined();
  });

  it("finds station across multiple directions", () => {
    // A station might appear in both up and down directions
    const station = getMtrStationInfo("TWL", "ADM");
    expect(station).toBeDefined();
    expect(station?.nameEn).toBe("Admiralty");
    expect(station?.nameZh).toBe("金鐘");
  });
});

describe("getMtrDirectionEntry", () => {
  it("returns direction entry for valid line and direction", () => {
    const entry = getMtrDirectionEntry("TWL", "up");
    expect(entry).toBeDefined();
    expect(entry?.lineCode).toBe("TWL");
    expect(entry?.urlDirection).toBe("up");
  });

  it("returns undefined for invalid direction", () => {
    const entry = getMtrDirectionEntry("TWL", "invalid");
    expect(entry).toBeUndefined();
  });

  it("returns undefined for invalid line", () => {
    const entry = getMtrDirectionEntry("UNKNOWN", "up");
    expect(entry).toBeUndefined();
  });
});

describe("getDirectionLabel", () => {
  it("returns formatted label in English (default)", () => {
    const entry = getMtrDirectionEntry("TWL", "up");
    if (entry) {
      const label = getDirectionLabel(entry);
      // Should contain arrow and station names
      expect(label).toContain("→");
    }
  });

  it("returns formatted label in English when language='en'", () => {
    const entry = getMtrDirectionEntry("TWL", "up");
    if (entry) {
      const label = getDirectionLabel(entry, "en");
      expect(label).toContain("→");
    }
  });

  it("returns formatted label in Chinese when language='zh'", () => {
    const entry = getMtrDirectionEntry("TWL", "up");
    if (entry) {
      const label = getDirectionLabel(entry, "zh");
      expect(label).toContain("→");
      // Should contain Chinese characters
      expect(label).toMatch(/[\u4e00-\u9fff]/);
    }
  });

  it("returns direction fallback if termini are empty", () => {
    // Create a mock entry with empty termini
    const mockEntry = {
      lineCode: "TEST",
      direction: "DT",
      urlDirection: "down",
      stations: [],
      startTermini: [],
      endTermini: [],
    };
    expect(getDirectionLabel(mockEntry)).toBe("DT");
  });
});

describe("getDirectionLabelZh (deprecated)", () => {
  it("returns formatted label in Chinese", () => {
    const entry = getMtrDirectionEntry("TWL", "up");
    if (entry) {
      const label = getDirectionLabelZh(entry);
      // Should contain arrow
      expect(label).toContain("→");
    }
  });
});

describe("getDirectionLabel — branch lines", () => {
  it("shows alternative termini for TKL UT (up)", () => {
    const entry = getMtrDirectionEntry("TKL", "up");
    expect(entry).toBeDefined();
    expect(getDirectionLabel(entry!)).toBe("North Point → LOHAS Park/Po Lam");
  });

  it("shows alternative termini for TKL DT (down)", () => {
    const entry = getMtrDirectionEntry("TKL", "down");
    expect(entry).toBeDefined();
    expect(getDirectionLabel(entry!)).toBe("LOHAS Park/Po Lam → North Point");
  });

  it("shows alternative termini for EAL UT (up)", () => {
    const entry = getMtrDirectionEntry("EAL", "up");
    expect(entry).toBeDefined();
    // Termini sorted alphabetically by code: LMC < LOW
    expect(getDirectionLabel(entry!)).toBe("Admiralty → Lok Ma Chau/Lo Wu");
  });

  it("shows alternative termini for EAL DT (down)", () => {
    const entry = getMtrDirectionEntry("EAL", "down");
    expect(entry).toBeDefined();
    expect(getDirectionLabel(entry!)).toBe("Lok Ma Chau/Lo Wu → Admiralty");
  });
});

describe("getDirectionLabel — branch lines (Chinese)", () => {
  it("shows alternative termini for TKL UT in Chinese", () => {
    const entry = getMtrDirectionEntry("TKL", "up");
    expect(entry).toBeDefined();
    expect(getDirectionLabel(entry!, "zh")).toBe("北角 → 康城/寶琳");
  });

  it("shows alternative termini for EAL UT in Chinese", () => {
    const entry = getMtrDirectionEntry("EAL", "up");
    expect(entry).toBeDefined();
    // Termini sorted alphabetically by code: LMC < LOW
    expect(getDirectionLabel(entry!, "zh")).toBe("金鐘 → 落馬洲/羅湖");
  });
});

describe("MTR_LINES", () => {
  it("contains all expected lines", () => {
    const expectedLines = [
      "AEL",
      "DRL",
      "EAL",
      "ISL",
      "KTL",
      "TML",
      "TCL",
      "TKL",
      "TWL",
      "SIL",
    ];

    for (const line of expectedLines) {
      expect(MTR_LINES[line]).toBeDefined();
      expect(MTR_LINES[line].code).toBe(line);
    }
  });

  it("has correct info for TWL", () => {
    expect(MTR_LINES.TWL.nameEn).toBe("Tsuen Wan Line");
    expect(MTR_LINES.TWL.nameZh).toBe("荃灣綫");
    expect(MTR_LINES.TWL.color).toBe("#ED1D24");
  });

  it("has correct info for ISL", () => {
    expect(MTR_LINES.ISL.nameEn).toBe("Island Line");
    expect(MTR_LINES.ISL.nameZh).toBe("港島綫");
    expect(MTR_LINES.ISL.color).toBe("#007DC5");
  });

  it("has correct info for EAL", () => {
    expect(MTR_LINES.EAL.nameEn).toBe("East Rail Line");
    expect(MTR_LINES.EAL.nameZh).toBe("東鐵綫");
    expect(MTR_LINES.EAL.color).toBe("#53B7E8");
  });
});
