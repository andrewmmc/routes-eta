/**
 * Generates src/data/mtr-directions.generated.ts from assets/mtr_lines_and_stations.csv
 *
 * Rules applied during generation:
 * - Only DT (down) and UT (up) directions are output
 * - LMC-DT/LMC-UT (Lo Wu / Lok Ma Chau branch) are merged into EAL DT/UT
 * - TKS-DT/TKS-UT (Po Lam / LOHAS Park branch) are merged into TKL DT/UT
 * - Extra stations absent from the CSV are injected via ADDITIONAL_STATIONS
 *
 * Usage: npx ts-node scripts/generate-mtr-data.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Types ────────────────────────────────────────────────────────────────────

interface CsvRow {
  lineCode: string;
  direction: string;
  stationCode: string;
  stationId: string;
  nameZh: string;
  nameEn: string;
  sequence: number;
}

interface Station {
  code: string;
  id: string;
  nameZh: string;
  nameEn: string;
  sequence: number;
}

interface DirectionEntry {
  lineCode: string;
  direction: "DT" | "UT";
  urlDirection: "down" | "up";
  stations: Station[];
  /** Station codes that are termini (origin or destination). Multiple entries indicate alternative branches. */
  startTermini: string[];
  endTermini: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Branch directions that should be merged into their parent line's main direction.
 * LMC = Lo Wu / Lok Ma Chau branch of EAL
 * TKS = Po Lam / LOHAS Park branch of TKL
 */
const DIRECTION_MERGE_MAP: Record<string, "DT" | "UT"> = {
  "LMC-DT": "DT",
  "LMC-UT": "UT",
  "TKS-DT": "DT",
  "TKS-UT": "UT",
};

/**
 * Stations absent from the CSV that need to be injected.
 * Key: "{lineCode}-{direction}-{stationCode}" (direction = DT or UT)
 * Fractional sequence values slot the station between existing ones.
 */
const ADDITIONAL_STATIONS: Record<string, Station> = {
  // Racecourse (RAC) operates between University (UNI, seq 6) and Fo Tan (FOT, seq 7) on EAL DT
  "EAL-DT-RAC": {
    code: "RAC",
    id: "70",
    nameZh: "馬場",
    nameEn: "Racecourse",
    sequence: 6.5,
  },
  // Racecourse (RAC) operates between Fo Tan (FOT, seq 8) and University (UNI, seq 9) on EAL UT
  "EAL-UT-RAC": {
    code: "RAC",
    id: "70",
    nameZh: "馬場",
    nameEn: "Racecourse",
    sequence: 8.5,
  },
};

/**
 * Sequence adjustments for branch stations to position them as alternative termini.
 * Key: "{lineCode}-{direction}-{stationCode}"
 * Value: The target sequence to match with the main line's terminus.
 *
 * This ensures branch termini share the same sequence as main termini,
 * allowing the label function to display them as alternatives.
 */
const SEQUENCE_ADJUSTMENTS: Record<string, number> = {
  // EAL: Lok Ma Chau (LMC) is an alternative terminus to Lo Wu (LOW)
  // EAL DT: LOW is at seq 1, LMC should also be at seq 1
  "EAL-DT-LMC": 1,
  // EAL UT: LOW is at seq 14, LMC should also be at seq 14
  "EAL-UT-LMC": 14,

  // TKL: LOHAS Park (LHP) is an alternative terminus to Po Lam (POA)
  // TKL DT: POA is at seq 1, LHP should also be at seq 1
  "TKL-DT-LHP": 1,
  // TKL UT: POA is at seq 7, LHP should also be at seq 7
  "TKL-UT-LHP": 7,
};

// ─── CSV Parsing ──────────────────────────────────────────────────────────────

/** Parse a single CSV line, correctly handling both quoted and unquoted fields. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;

  while (i < line.length) {
    if (line[i] === '"') {
      i++; // skip opening quote
      let value = "";
      while (i < line.length && line[i] !== '"') {
        value += line[i++];
      }
      i++; // skip closing quote
      if (line[i] === ",") i++; // skip separator
      fields.push(value);
    } else {
      let value = "";
      while (i < line.length && line[i] !== ",") {
        value += line[i++];
      }
      if (line[i] === ",") i++; // skip separator
      fields.push(value.trim());
    }
  }

  return fields;
}

function parseCsv(content: string): CsvRow[] {
  const normalized = content
    .replace(/^\uFEFF/, "") // strip BOM
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const [, ...dataLines] = normalized.trim().split("\n"); // skip header
  const rows: CsvRow[] = [];

  for (const line of dataLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const fields = parseCsvLine(trimmed);
    if (fields.length < 7) continue;

    const sequence = parseFloat(fields[6]);
    if (isNaN(sequence)) continue;

    rows.push({
      lineCode: fields[0],
      direction: fields[1],
      stationCode: fields[2],
      stationId: fields[3],
      nameZh: fields[4],
      nameEn: fields[5],
      sequence,
    });
  }

  return rows;
}

// ─── Direction Building ───────────────────────────────────────────────────────

function getBaseDirection(direction: string): "DT" | "UT" {
  return DIRECTION_MERGE_MAP[direction] ?? (direction as "DT" | "UT");
}

function buildDirections(rows: CsvRow[]): DirectionEntry[] {
  // Group stations by "{lineCode}-{direction}", merging branch directions
  const groups = new Map<string, Map<string, Station>>();

  // Separate rows into main directions and branch directions
  // Main directions should be processed first so their sequences take precedence
  const mainRows: CsvRow[] = [];
  const branchRows: CsvRow[] = [];

  for (const row of rows) {
    if (DIRECTION_MERGE_MAP[row.direction]) {
      branchRows.push(row);
    } else if (row.direction === "DT" || row.direction === "UT") {
      mainRows.push(row);
    }
  }

  // Process main directions first
  for (const row of mainRows) {
    const key = `${row.lineCode}-${row.direction}`;
    if (!groups.has(key)) groups.set(key, new Map());
    const group = groups.get(key)!;

    group.set(row.stationCode, {
      code: row.stationCode,
      id: row.stationId,
      nameZh: row.nameZh,
      nameEn: row.nameEn,
      sequence: row.sequence,
    });
  }

  // Then process branch directions - only add stations not in main direction
  for (const row of branchRows) {
    const direction = getBaseDirection(row.direction);
    const key = `${row.lineCode}-${direction}`;

    if (!groups.has(key)) groups.set(key, new Map());
    const group = groups.get(key)!;

    // Only add if not already present from main direction
    if (!group.has(row.stationCode)) {
      // Apply sequence adjustment for branch-only stations
      const adjustmentKey = `${row.lineCode}-${direction}-${row.stationCode}`;
      const adjustedSequence =
        SEQUENCE_ADJUSTMENTS[adjustmentKey] ?? row.sequence;

      group.set(row.stationCode, {
        code: row.stationCode,
        id: row.stationId,
        nameZh: row.nameZh,
        nameEn: row.nameEn,
        sequence: adjustedSequence,
      });
    }
  }

  // Inject additional stations
  for (const [key, station] of Object.entries(ADDITIONAL_STATIONS)) {
    const [lineCode, direction] = key.split("-"); // e.g. "EAL-DT-RAC" → "EAL", "DT"
    groups.get(`${lineCode}-${direction}`)?.set(station.code, station);
  }

  // Build sorted entries with sequences renumbered from 1
  const entries: DirectionEntry[] = [];

  for (const [key, stationsMap] of groups) {
    const [lineCode, direction] = key.split("-") as [string, "DT" | "UT"];

    const stationArray = Array.from(stationsMap.values());

    // Find min and max sequences to identify termini
    const sequences = stationArray.map((s) => s.sequence);
    const minSeq = Math.min(...sequences);
    const maxSeq = Math.max(...sequences);

    // Identify start and end termini (stations at min/max sequence)
    const startTermini = stationArray
      .filter((s) => s.sequence === minSeq)
      .map((s) => s.code)
      .sort();
    const endTermini = stationArray
      .filter((s) => s.sequence === maxSeq)
      .map((s) => s.code)
      .sort();

    // Sort by sequence, then by station code for stable ordering of alternative termini
    const stations = stationArray
      .sort((a, b) => {
        if (a.sequence !== b.sequence) return a.sequence - b.sequence;
        return a.code.localeCompare(b.code);
      })
      .map((station, index) => ({ ...station, sequence: index + 1 }));

    entries.push({
      lineCode,
      direction,
      urlDirection: direction === "DT" ? "down" : "up",
      stations,
      startTermini,
      endTermini,
    });
  }

  // Sort by line code, then UT before DT
  entries.sort((a, b) => {
    if (a.lineCode !== b.lineCode) return a.lineCode.localeCompare(b.lineCode);
    return a.direction === "UT" ? -1 : 1;
  });

  return entries;
}

// ─── Code Generation ──────────────────────────────────────────────────────────

function renderStation(s: Station): string {
  return `      { code: "${s.code}", id: "${s.id}", nameZh: "${s.nameZh}", nameEn: "${s.nameEn}", sequence: ${s.sequence} },`;
}

function renderDirectionEntry(entry: DirectionEntry): string {
  const stationLines = entry.stations.map(renderStation).join("\n");
  const startTerminiStr = entry.startTermini.map((c) => `"${c}"`).join(", ");
  const endTerminiStr = entry.endTermini.map((c) => `"${c}"`).join(", ");
  return [
    "  {",
    `    lineCode: "${entry.lineCode}",`,
    `    direction: "${entry.direction}",`,
    `    urlDirection: "${entry.urlDirection}",`,
    "    stations: [",
    stationLines,
    "    ],",
    `    startTermini: [${startTerminiStr}],`,
    `    endTermini: [${endTerminiStr}],`,
    "  },",
  ].join("\n");
}

function generateOutput(entries: DirectionEntry[]): string {
  const body = entries.map(renderDirectionEntry).join("\n");
  return [
    "// Generated by scripts/generate-mtr-data.ts — do not edit manually",
    "",
    "export const MTR_LINE_DIRECTIONS = [",
    body,
    "];",
    "",
  ].join("\n");
}

// ─── Exports (for testing) ────────────────────────────────────────────────────

export { parseCsvLine, parseCsv, buildDirections, generateOutput };
export type { CsvRow, Station, DirectionEntry };

// ─── Entry Point ──────────────────────────────────────────────────────────────

function main() {
  const csvPath = path.join(__dirname, "../assets/mtr_lines_and_stations.csv");
  const outputPath = path.join(
    __dirname,
    "../src/data/mtr-directions.generated.ts"
  );

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(csvContent);
  console.log(`Parsed ${rows.length} rows`);

  const entries = buildDirections(rows);
  console.log(`Built ${entries.length} direction entries`);

  fs.writeFileSync(outputPath, generateOutput(entries));
  console.log(`Written to ${outputPath}`);
}

// Only run when executed directly (not imported by tests)
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main();
}
