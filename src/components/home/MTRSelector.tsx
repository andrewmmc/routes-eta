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
      // Keep the selected station if it also exists in the new direction
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
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t("home.line")}
        </label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
      </div>

      {/* Direction selector */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t("home.direction")}
        </label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
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
      </div>

      {/* Station selector */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t("home.station")}
        </label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
          value={selectedStation}
          onChange={(e) => onStationChange(e.target.value)}
          disabled={!selectedDirection}
        >
          <option value="">{t("home.selectStation")}</option>
          {stations.map((s) => (
            <option key={s.code} value={s.code}>
              {getLocalizedName({ name: s.nameEn, nameZh: s.nameZh }, language)}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
