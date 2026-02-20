/**
 * MTR Lines and Stations Data
 *
 * MTR_LINE_DIRECTIONS is generated — run scripts/generate-mtr-data.ts to regenerate.
 */

import { MTR_LINE_DIRECTIONS as _directions } from "./mtr-directions.generated";
import type { Language } from "@/types/language";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MtrLineInfo {
  code: string;
  nameEn: string;
  nameZh: string;
  color: string;
}

export interface MtrStationEntry {
  code: string;
  id: string;
  nameZh: string;
  nameEn: string;
  sequence: number;
}

export interface MtrDirectionEntry {
  lineCode: string;
  /** Raw CSV direction: "DT" (down), "UT" (up) */
  direction: string;
  /** URL-friendly direction used in board routes: "down" or "up" */
  urlDirection: string;
  stations: MtrStationEntry[];
  /** Station codes that are origin termini. Multiple entries indicate alternative branches. */
  startTermini: string[];
  /** Station codes that are destination termini. Multiple entries indicate alternative branches. */
  endTermini: string[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────

export const MTR_LINES: Record<string, MtrLineInfo> = {
  AEL: {
    code: "AEL",
    nameEn: "Airport Express",
    nameZh: "機場快綫",
    color: "#00888A",
  },
  DRL: {
    code: "DRL",
    nameEn: "Disneyland Resort Line",
    nameZh: "迪士尼綫",
    color: "#F173AC",
  },
  EAL: {
    code: "EAL",
    nameEn: "East Rail Line",
    nameZh: "東鐵綫",
    color: "#53B7E8",
  },
  ISL: {
    code: "ISL",
    nameEn: "Island Line",
    nameZh: "港島綫",
    color: "#007DC5",
  },
  KTL: {
    code: "KTL",
    nameEn: "Kwun Tong Line",
    nameZh: "觀塘綫",
    color: "#00AB4E",
  },
  TML: {
    code: "TML",
    nameEn: "Tuen Ma Line",
    nameZh: "屯馬綫",
    color: "#923011",
  },
  TCL: {
    code: "TCL",
    nameEn: "Tung Chung Line",
    nameZh: "東涌綫",
    color: "#F7943E",
  },
  TKL: {
    code: "TKL",
    nameEn: "Tseung Kwan O Line",
    nameZh: "將軍澳綫",
    color: "#7D499D",
  },
  TWL: {
    code: "TWL",
    nameEn: "Tsuen Wan Line",
    nameZh: "荃灣綫",
    color: "#ED1D24",
  },
  SIL: {
    code: "SIL",
    nameEn: "South Island Line",
    nameZh: "南港島綫",
    color: "#BAC429",
  },
};

// Re-export with explicit type so consumers always get MtrDirectionEntry[]
export const MTR_LINE_DIRECTIONS: MtrDirectionEntry[] = _directions;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get all direction entries for a given line. */
export function getMtrLineDirections(lineCode: string): MtrDirectionEntry[] {
  return MTR_LINE_DIRECTIONS.filter((d) => d.lineCode === lineCode);
}

/** Get a specific direction entry by line and URL direction ("up" | "down"). */
export function getMtrDirectionEntry(
  lineCode: string,
  urlDirection: string
): MtrDirectionEntry | undefined {
  return MTR_LINE_DIRECTIONS.find(
    (d) => d.lineCode === lineCode && d.urlDirection === urlDirection
  );
}

/** Look up a station within any direction of a given line. */
export function getMtrStationInfo(
  lineCode: string,
  stationCode: string
): MtrStationEntry | undefined {
  for (const entry of MTR_LINE_DIRECTIONS) {
    if (entry.lineCode !== lineCode) continue;
    const station = entry.stations.find((s) => s.code === stationCode);
    if (station) return station;
  }
  return undefined;
}

/** Format termini names, joining multiple alternatives with "/" */
function formatTermini(
  terminiCodes: string[],
  stations: MtrStationEntry[],
  getName: (s: MtrStationEntry) => string
): string {
  const names = terminiCodes
    .map((code) => stations.find((s) => s.code === code))
    .filter((s): s is MtrStationEntry => s !== undefined)
    .map(getName);
  return names.join("/");
}

/**
 * Get direction label with language support
 * @param entry - MTR direction entry
 * @param language - "en" for English, "zh" for Chinese
 * @returns Direction label like "Central → Tsuen Wan" or "中環 → 荃灣"
 */
export function getDirectionLabel(
  entry: MtrDirectionEntry,
  language: Language = "en"
): string {
  const getName =
    language === "zh"
      ? (s: MtrStationEntry) => s.nameZh
      : (s: MtrStationEntry) => s.nameEn;
  const startLabel = formatTermini(entry.startTermini, entry.stations, getName);
  const endLabel = formatTermini(entry.endTermini, entry.stations, getName);
  if (!startLabel || !endLabel) return entry.direction;
  return `${startLabel} → ${endLabel}`;
}

/**
 * Get direction label in Chinese
 * @deprecated Use `getDirectionLabel(entry, "zh")` instead
 */
export function getDirectionLabelZh(entry: MtrDirectionEntry): string {
  return getDirectionLabel(entry, "zh");
}

/**
 * Validate MTR route params
 * @returns true if params are valid, false otherwise
 */
export function validateMtrRouteParams(
  lineCode: string,
  stationCode: string,
  direction: string | undefined
): boolean {
  // Check line exists
  if (!MTR_LINES[lineCode]) return false;

  // Check direction is valid (up or down)
  if (direction !== "up" && direction !== "down") return false;

  // Check station exists in the line's direction
  const directionEntry = getMtrDirectionEntry(lineCode, direction);
  if (!directionEntry) return false;

  const stationExists = directionEntry.stations.some(
    (s) => s.code === stationCode
  );
  if (!stationExists) return false;

  return true;
}
