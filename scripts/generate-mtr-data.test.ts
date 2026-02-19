import { describe, it, expect } from "vitest";
import {
  parseCsvLine,
  parseCsv,
  buildDirections,
  generateOutput,
} from "./generate-mtr-data.ts";

// ─── Minimal CSV fixtures ─────────────────────────────────────────────────────

// A minimal TWL CSV (one simple line, no branches)
const TWL_CSV = `Line Code,Direction,Station Code,Station ID,Chinese Name,English Name,Sequence
TWL,DT,TSW,1,荃灣,Tsuen Wan,1
TWL,DT,TWH,2,荃灣西,Tsuen Wan West,2
TWL,DT,CEN,3,中環,Central,3
TWL,UT,CEN,3,中環,Central,1
TWL,UT,TWH,2,荃灣西,Tsuen Wan West,2
TWL,UT,TSW,1,荃灣,Tsuen Wan,3`;

// A fictional line with a branch, using station codes that are NOT in
// SEQUENCE_ADJUSTMENTS (which hardcodes real station codes like LMC / LHP).
// This lets us test branch-merging logic in isolation.
// AAL main line: T1 → MID → T2
// AAL branch (AAB-DT/AAB-UT): ALT → MID  (ALT is a branch-only terminus)
// ALT is assigned the same sequence as T1/T2 so it becomes a co-terminus.
const BRANCH_CSV = `Line Code,Direction,Station Code,Station ID,Chinese Name,English Name,Sequence
AAL,DT,T1,1,起點,Start,1
AAL,DT,MID,2,中間,Middle,2
AAL,DT,T2,3,終點,End,3
AAL,UT,T2,3,終點,End,1
AAL,UT,MID,2,中間,Middle,2
AAL,UT,T1,1,起點,Start,3
AAL,AAB-DT,ALT,4,支線,Branch,1
AAL,AAB-DT,MID,2,中間,Middle,2
AAL,AAB-UT,MID,2,中間,Middle,1
AAL,AAB-UT,ALT,4,支線,Branch,3`;

// ─── parseCsvLine ─────────────────────────────────────────────────────────────

describe("parseCsvLine", () => {
  it("parses simple unquoted fields", () => {
    expect(parseCsvLine("TWL,DT,TSW,1,荃灣,Tsuen Wan,1")).toEqual([
      "TWL",
      "DT",
      "TSW",
      "1",
      "荃灣",
      "Tsuen Wan",
      "1",
    ]);
  });

  it("parses quoted fields containing commas", () => {
    expect(parseCsvLine(`TWL,DT,"Tsuen, Wan",1,荃灣,Tsuen Wan,1`)).toEqual([
      "TWL",
      "DT",
      "Tsuen, Wan",
      "1",
      "荃灣",
      "Tsuen Wan",
      "1",
    ]);
  });

  it("returns an empty field for consecutive commas", () => {
    const result = parseCsvLine("A,,B");
    expect(result[0]).toBe("A");
    expect(result[1]).toBe("");
    expect(result[2]).toBe("B");
  });
});

// ─── parseCsv ─────────────────────────────────────────────────────────────────

describe("parseCsv", () => {
  it("skips the header row", () => {
    const rows = parseCsv(TWL_CSV);
    expect(rows.every((r) => r.lineCode !== "Line Code")).toBe(true);
  });

  it("parses all data rows", () => {
    const rows = parseCsv(TWL_CSV);
    expect(rows).toHaveLength(6);
  });

  it("strips BOM from content", () => {
    const rows = parseCsv("\uFEFF" + TWL_CSV);
    expect(rows[0].lineCode).toBe("TWL");
  });

  it("maps fields onto CsvRow correctly", () => {
    const rows = parseCsv(TWL_CSV);
    expect(rows[0]).toEqual({
      lineCode: "TWL",
      direction: "DT",
      stationCode: "TSW",
      stationId: "1",
      nameZh: "荃灣",
      nameEn: "Tsuen Wan",
      sequence: 1,
    });
  });

  it("skips rows with fewer than 7 fields", () => {
    const csv = `Line Code,Direction,Station Code,Station ID,Chinese Name,English Name,Sequence
TWL,DT,TSW,1,荃灣
TWL,DT,CEN,3,中環,Central,3`;
    const rows = parseCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].stationCode).toBe("CEN");
  });

  it("skips rows where sequence is not a number", () => {
    const csv = `Line Code,Direction,Station Code,Station ID,Chinese Name,English Name,Sequence
TWL,DT,TSW,1,荃灣,Tsuen Wan,N/A
TWL,DT,CEN,3,中環,Central,3`;
    const rows = parseCsv(csv);
    expect(rows).toHaveLength(1);
  });

  it("handles Windows-style CRLF line endings", () => {
    const crlf = TWL_CSV.replace(/\n/g, "\r\n");
    expect(parseCsv(crlf)).toHaveLength(6);
  });
});

// ─── buildDirections ──────────────────────────────────────────────────────────

describe("buildDirections", () => {
  describe("simple line (TWL)", () => {
    it("produces DT and UT entries", () => {
      const rows = parseCsv(TWL_CSV);
      const entries = buildDirections(rows);
      const codes = entries.map((e) => `${e.lineCode}-${e.direction}`);
      expect(codes).toContain("TWL-DT");
      expect(codes).toContain("TWL-UT");
    });

    it("sets urlDirection correctly", () => {
      const rows = parseCsv(TWL_CSV);
      const entries = buildDirections(rows);
      const dt = entries.find(
        (e) => e.lineCode === "TWL" && e.direction === "DT"
      )!;
      const ut = entries.find(
        (e) => e.lineCode === "TWL" && e.direction === "UT"
      )!;
      expect(dt.urlDirection).toBe("down");
      expect(ut.urlDirection).toBe("up");
    });

    it("identifies single start and end termini", () => {
      const rows = parseCsv(TWL_CSV);
      const entries = buildDirections(rows);
      const dt = entries.find(
        (e) => e.lineCode === "TWL" && e.direction === "DT"
      )!;
      expect(dt.startTermini).toEqual(["TSW"]);
      expect(dt.endTermini).toEqual(["CEN"]);
    });

    it("renumbers station sequences from 1", () => {
      const rows = parseCsv(TWL_CSV);
      const entries = buildDirections(rows);
      const dt = entries.find(
        (e) => e.lineCode === "TWL" && e.direction === "DT"
      )!;
      expect(dt.stations.map((s) => s.sequence)).toEqual([1, 2, 3]);
    });
  });

  describe("branch merging (fictional AAL line)", () => {
    // Uses BRANCH_CSV with invented station codes to test the merging
    // pipeline in isolation. AAB-DT/AAB-UT are not in DIRECTION_MERGE_MAP,
    // so these rows are intentionally ignored (unknown branch codes are
    // silently skipped — only registered branches are merged).
    it("produces DT and UT entries for main line only", () => {
      const rows = parseCsv(BRANCH_CSV);
      const entries = buildDirections(rows);
      expect(
        entries.find((e) => e.lineCode === "AAL" && e.direction === "DT")
      ).toBeDefined();
      expect(
        entries.find((e) => e.lineCode === "AAL" && e.direction === "UT")
      ).toBeDefined();
    });

    it("silently ignores rows with unregistered branch direction codes", () => {
      const rows = parseCsv(BRANCH_CSV);
      const entries = buildDirections(rows);
      // AAB-DT/AAB-UT are not in DIRECTION_MERGE_MAP — no separate entry created
      expect(entries.find((e) => e.lineCode === "AAB")).toBeUndefined();
      // ALT station (branch-only) is not included since its rows were dropped
      const dt = entries.find(
        (e) => e.lineCode === "AAL" && e.direction === "DT"
      )!;
      expect(dt.stations.map((s) => s.code)).not.toContain("ALT");
    });
  });

  describe("branch merging — real EAL / TKL data with SEQUENCE_ADJUSTMENTS", () => {
    // These tests use the actual CSV file to verify the full pipeline including
    // SEQUENCE_ADJUSTMENTS aligning real branch station codes to their termini.
    it("EAL-DT has LOW and LMC as alternative start termini", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const dir = path.dirname(fileURLToPath(import.meta.url));
      const csv = fs.readFileSync(
        path.join(dir, "../assets/mtr_lines_and_stations.csv"),
        "utf-8"
      );
      const entries = buildDirections(parseCsv(csv));
      const dt = entries.find(
        (e) => e.lineCode === "EAL" && e.direction === "DT"
      )!;
      expect(dt.startTermini).toContain("LOW");
      expect(dt.startTermini).toContain("LMC");
    });

    it("EAL-UT has LOW and LMC as alternative end termini", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const dir = path.dirname(fileURLToPath(import.meta.url));
      const csv = fs.readFileSync(
        path.join(dir, "../assets/mtr_lines_and_stations.csv"),
        "utf-8"
      );
      const entries = buildDirections(parseCsv(csv));
      const ut = entries.find(
        (e) => e.lineCode === "EAL" && e.direction === "UT"
      )!;
      expect(ut.endTermini).toContain("LOW");
      expect(ut.endTermini).toContain("LMC");
    });

    it("TKL-DT has POA and LHP as alternative start termini", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const dir = path.dirname(fileURLToPath(import.meta.url));
      const csv = fs.readFileSync(
        path.join(dir, "../assets/mtr_lines_and_stations.csv"),
        "utf-8"
      );
      const entries = buildDirections(parseCsv(csv));
      const dt = entries.find(
        (e) => e.lineCode === "TKL" && e.direction === "DT"
      )!;
      expect(dt.startTermini).toContain("POA");
      expect(dt.startTermini).toContain("LHP");
    });

    it("TKL-UT has POA and LHP as alternative end termini", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const dir = path.dirname(fileURLToPath(import.meta.url));
      const csv = fs.readFileSync(
        path.join(dir, "../assets/mtr_lines_and_stations.csv"),
        "utf-8"
      );
      const entries = buildDirections(parseCsv(csv));
      const ut = entries.find(
        (e) => e.lineCode === "TKL" && e.direction === "UT"
      )!;
      expect(ut.endTermini).toContain("POA");
      expect(ut.endTermini).toContain("LHP");
    });
  });

  describe("output ordering", () => {
    it("sorts entries by line code then UT before DT", () => {
      const rows = parseCsv(
        TWL_CSV + "\n" + BRANCH_CSV.split("\n").slice(1).join("\n")
      );
      const entries = buildDirections(rows);
      const keys = entries.map((e) => `${e.lineCode}-${e.direction}`);
      const aalUtIdx = keys.indexOf("AAL-UT");
      const aalDtIdx = keys.indexOf("AAL-DT");
      const twlIdx = keys.indexOf("TWL-UT");
      expect(aalUtIdx).toBeLessThan(aalDtIdx); // UT before DT within same line
      expect(aalDtIdx).toBeLessThan(twlIdx); // AAL before TWL alphabetically
    });
  });
});

// ─── generateOutput ───────────────────────────────────────────────────────────

describe("generateOutput", () => {
  it("emits the do-not-edit header comment", () => {
    const rows = parseCsv(TWL_CSV);
    const entries = buildDirections(rows);
    const output = generateOutput(entries);
    expect(output).toContain(
      "// Generated by scripts/generate-mtr-data.ts — do not edit manually"
    );
  });

  it("exports MTR_LINE_DIRECTIONS", () => {
    const rows = parseCsv(TWL_CSV);
    const entries = buildDirections(rows);
    const output = generateOutput(entries);
    expect(output).toContain("export const MTR_LINE_DIRECTIONS");
  });

  it("includes station codes in the output", () => {
    const rows = parseCsv(TWL_CSV);
    const entries = buildDirections(rows);
    const output = generateOutput(entries);
    expect(output).toContain('"TSW"');
    expect(output).toContain('"CEN"');
  });

  it("includes startTermini and endTermini arrays", () => {
    const rows = parseCsv(TWL_CSV);
    const entries = buildDirections(rows);
    const output = generateOutput(entries);
    expect(output).toContain("startTermini:");
    expect(output).toContain("endTermini:");
  });
});
