/**
 * MTR Selector Component
 *
 * Selector for MTR line, direction, and station
 */

import { useMemo, useCallback } from "react";
import {
  MTR_LINES,
  MTR_LINE_DIRECTIONS,
  getMtrLineDirections,
  getDirectionLabel,
  type MtrDirectionEntry,
  type MtrStationEntry,
} from "@/data/mtr";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName } from "@/utils/localization";

const LINE_ORDER = [
  "AEL",
  "DRL",
  "EAL",
  "ISL",
  "KTL",
  "SIL",
  "TCL",
  "TKL",
  "TML",
  "TWL",
];

/**
 * Get button color for MTR line
 */
export function getMtrButtonColor(lineCode: string): string | undefined {
  const line = MTR_LINES[lineCode];
  return line?.color;
}

interface MTRSelectorProps {
  selectedLine: string;
  selectedDirection: string;
  selectedStation: string;
  onLineChange: (line: string) => void;
  onDirectionChange: (direction: string, resetStation?: boolean) => void;
  onStationChange: (station: string) => void;
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-transit-muted">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

const selectClass =
  "w-full appearance-none bg-transit-surface border border-transit-border text-foreground px-3 py-2.5 pr-9 text-sm font-code focus:border-transit-accent focus:ring-1 focus:ring-transit-accent focus:outline-none disabled:bg-background disabled:text-transit-muted disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer";

export function MTRSelector({
  selectedLine,
  selectedDirection,
  selectedStation,
  onLineChange,
  onDirectionChange,
  onStationChange,
}: MTRSelectorProps) {
  const { t, language } = useTranslation();

  const directions = useMemo<MtrDirectionEntry[]>(() => {
    if (!selectedLine) return [];
    return getMtrLineDirections(selectedLine);
  }, [selectedLine]);

  const stations = useMemo<MtrStationEntry[]>(() => {
    if (!selectedLine || !selectedDirection) return [];
    const entry = MTR_LINE_DIRECTIONS.find(
      (d) => d.lineCode === selectedLine && d.urlDirection === selectedDirection
    );
    return entry?.stations ?? [];
  }, [selectedLine, selectedDirection]);

  const handleDirectionChange = useCallback(
    (dir: string) => {
      const newEntry = MTR_LINE_DIRECTIONS.find(
        (d) => d.lineCode === selectedLine && d.urlDirection === dir
      );
      const codesInNewDir = newEntry?.stations.map((s) => s.code) ?? [];
      const shouldResetStation = !codesInNewDir.includes(selectedStation);
      onDirectionChange(dir, shouldResetStation);
    },
    [selectedLine, selectedStation, onDirectionChange]
  );

  return (
    <>
      {/* Line selector */}
      <div className="mb-4">
        <label className="mb-1.5 flex items-center gap-1.5">
          {selectedLine && MTR_LINES[selectedLine] && (
            <span
              className="inline-block w-2.5 h-2.5 shrink-0"
              style={{ backgroundColor: MTR_LINES[selectedLine].color }}
            />
          )}
          <span className="text-sm font-code tracking-widest uppercase text-transit-muted">
            {t("home.line")}
          </span>
        </label>
        <SelectWrapper>
          <select
            className={selectClass}
            value={selectedLine}
            onChange={(e) => onLineChange(e.target.value)}
          >
            <option value="">{t("home.selectLine")}</option>
            {LINE_ORDER.map((code) => {
              const line = MTR_LINES[code];
              if (!line) return null;
              return (
                <option key={code} value={code}>
                  {getLocalizedName(
                    { name: line.nameEn, nameZh: line.nameZh },
                    language
                  )}
                </option>
              );
            })}
          </select>
        </SelectWrapper>
      </div>

      {/* Direction selector */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-code tracking-widest uppercase text-transit-muted">
          {t("home.direction")}
        </label>
        <SelectWrapper>
          <select
            className={selectClass}
            value={selectedDirection}
            onChange={(e) => handleDirectionChange(e.target.value)}
            disabled={!selectedLine}
          >
            <option value="">{t("home.selectDirection")}</option>
            {directions.map((d) => (
              <option key={d.urlDirection} value={d.urlDirection}>
                {getDirectionLabel(d, language)}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </div>

      {/* Station selector */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-code tracking-widest uppercase text-transit-muted">
          {t("home.station")}
        </label>
        <SelectWrapper>
          <select
            className={selectClass}
            value={selectedStation}
            onChange={(e) => onStationChange(e.target.value)}
            disabled={!selectedDirection}
          >
            <option value="">{t("home.selectStation")}</option>
            {stations.map((s) => (
              <option key={s.code} value={s.code}>
                {getLocalizedName(
                  { name: s.nameEn, nameZh: s.nameZh },
                  language
                )}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </div>
    </>
  );
}
