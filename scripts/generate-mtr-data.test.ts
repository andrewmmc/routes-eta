import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the script's functions by running the logic inline
// Since the script is self-contained, we'll test the generated output

describe("MTR Data Generation", () => {
  it("should generate valid TypeScript output", async () => {
    const outputPath = path.join(__dirname, "../src/data/mtr-directions.generated.ts");

    // Check file exists
    expect(fs.existsSync(outputPath)).toBe(true);

    // Check it's valid TypeScript by importing it
    const mod = await import("../src/data/mtr-directions.generated.ts");
    expect(mod.MTR_LINE_DIRECTIONS).toBeDefined();
    expect(Array.isArray(mod.MTR_LINE_DIRECTIONS)).toBe(true);
  });

  describe("East Rail Line (EAL)", () => {
    it("should have LOW and LMC as alternative start termini for DT direction", async () => {
      const { MTR_LINE_DIRECTIONS } = await import("../src/data/mtr-directions.generated.ts");

      const ealDt = MTR_LINE_DIRECTIONS.find(
        (d: { lineCode: string; direction: string }) => d.lineCode === "EAL" && d.direction === "DT"
      );

      expect(ealDt).toBeDefined();
      expect(ealDt.startTermini).toContain("LMC");
      expect(ealDt.startTermini).toContain("LOW");
      expect(ealDt.endTermini).toEqual(["ADM"]);
    });

    it("should have LOW and LMC as alternative end termini for UT direction", async () => {
      const { MTR_LINE_DIRECTIONS } = await import("../src/data/mtr-directions.generated.ts");

      const ealUt = MTR_LINE_DIRECTIONS.find(
        (d: { lineCode: string; direction: string }) => d.lineCode === "EAL" && d.direction === "UT"
      );

      expect(ealUt).toBeDefined();
      expect(ealUt.startTermini).toEqual(["ADM"]);
      expect(ealUt.endTermini).toContain("LMC");
      expect(ealUt.endTermini).toContain("LOW");
    });
  });

  describe("Tseung Kwan O Line (TKL)", () => {
    it("should have POA and LHP as alternative start termini for DT direction", async () => {
      const { MTR_LINE_DIRECTIONS } = await import("../src/data/mtr-directions.generated.ts");

      const tklDt = MTR_LINE_DIRECTIONS.find(
        (d: { lineCode: string; direction: string }) => d.lineCode === "TKL" && d.direction === "DT"
      );

      expect(tklDt).toBeDefined();
      expect(tklDt.startTermini).toContain("POA");
      expect(tklDt.startTermini).toContain("LHP");
      expect(tklDt.endTermini).toEqual(["NOP"]);
    });

    it("should have POA and LHP as alternative end termini for UT direction", async () => {
      const { MTR_LINE_DIRECTIONS } = await import("../src/data/mtr-directions.generated.ts");

      const tklUt = MTR_LINE_DIRECTIONS.find(
        (d: { lineCode: string; direction: string }) => d.lineCode === "TKL" && d.direction === "UT"
      );

      expect(tklUt).toBeDefined();
      expect(tklUt.startTermini).toEqual(["NOP"]);
      expect(tklUt.endTermini).toContain("POA");
      expect(tklUt.endTermini).toContain("LHP");
    });

    it("should have correct station order for TKL UT (North Point to Po Lam/LOHAS Park)", async () => {
      const { MTR_LINE_DIRECTIONS } = await import("../src/data/mtr-directions.generated.ts");

      const tklUt = MTR_LINE_DIRECTIONS.find(
        (d: { lineCode: string; direction: string }) => d.lineCode === "TKL" && d.direction === "UT"
      );

      expect(tklUt).toBeDefined();

      // Verify station order: NOP -> QUB -> YAT -> TIK -> TKO -> HAH/TKO/LHP
      const stationCodes = tklUt.stations.map((s: { code: string }) => s.code);

      // North Point should be first
      expect(stationCodes[0]).toBe("NOP");

      // LOHAS Park and Po Lam should be at the end (last 2 stations)
      const lastTwo = stationCodes.slice(-2);
      expect(lastTwo).toContain("POA");
      expect(lastTwo).toContain("LHP");
    });

    it("should have correct station order for TKL DT (Po Lam/LOHAS Park to North Point)", async () => {
      const { MTR_LINE_DIRECTIONS } = await import("../src/data/mtr-directions.generated.ts");

      const tklDt = MTR_LINE_DIRECTIONS.find(
        (d: { lineCode: string; direction: string }) => d.lineCode === "TKL" && d.direction === "DT"
      );

      expect(tklDt).toBeDefined();

      const stationCodes = tklDt.stations.map((s: { code: string }) => s.code);

      // Po Lam and LOHAS Park should be first (first 2 stations)
      const firstTwo = stationCodes.slice(0, 2);
      expect(firstTwo).toContain("POA");
      expect(firstTwo).toContain("LHP");

      // North Point should be last
      expect(stationCodes[stationCodes.length - 1]).toBe("NOP");
    });
  });

  describe("Direction Labels", () => {
    it("should generate correct label for TKL UT showing alternative termini", async () => {
      const { getDirectionLabel, getMtrDirectionEntry } = await import("../src/data/mtr.ts");

      const entry = getMtrDirectionEntry("TKL", "up");
      expect(entry).toBeDefined();

      const label = getDirectionLabel(entry!);
      expect(label).toBe("North Point → LOHAS Park/Po Lam");
    });

    it("should generate correct label for TKL DT showing alternative termini", async () => {
      const { getDirectionLabel, getMtrDirectionEntry } = await import("../src/data/mtr.ts");

      const entry = getMtrDirectionEntry("TKL", "down");
      expect(entry).toBeDefined();

      const label = getDirectionLabel(entry!);
      expect(label).toBe("LOHAS Park/Po Lam → North Point");
    });

    it("should generate correct label for EAL UT showing alternative termini", async () => {
      const { getDirectionLabel, getMtrDirectionEntry } = await import("../src/data/mtr.ts");

      const entry = getMtrDirectionEntry("EAL", "up");
      expect(entry).toBeDefined();

      const label = getDirectionLabel(entry!);
      // Termini are sorted alphabetically by code: LMC < LOW
      expect(label).toBe("Admiralty → Lok Ma Chau/Lo Wu");
    });

    it("should generate correct label for EAL DT showing alternative termini", async () => {
      const { getDirectionLabel, getMtrDirectionEntry } = await import("../src/data/mtr.ts");

      const entry = getMtrDirectionEntry("EAL", "down");
      expect(entry).toBeDefined();

      const label = getDirectionLabel(entry!);
      // Termini are sorted alphabetically by code: LMC < LOW
      expect(label).toBe("Lok Ma Chau/Lo Wu → Admiralty");
    });

    it("should generate correct Chinese label for TKL UT", async () => {
      const { getDirectionLabelZh, getMtrDirectionEntry } = await import("../src/data/mtr.ts");

      const entry = getMtrDirectionEntry("TKL", "up");
      expect(entry).toBeDefined();

      const label = getDirectionLabelZh(entry!);
      expect(label).toBe("北角 → 康城/寶琳");
    });

    it("should generate correct Chinese label for EAL UT", async () => {
      const { getDirectionLabelZh, getMtrDirectionEntry } = await import("../src/data/mtr.ts");

      const entry = getMtrDirectionEntry("EAL", "up");
      expect(entry).toBeDefined();

      const label = getDirectionLabelZh(entry!);
      // Termini are sorted alphabetically by code: LMC < LOW
      expect(label).toBe("金鐘 → 落馬洲/羅湖");
    });
  });
});
