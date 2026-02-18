/**
 * Home Page
 *
 * Landing page with MTR line/station/direction selector
 */

import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  MTR_LINES,
  MTR_LINE_DIRECTIONS,
  getMtrLineDirections,
  getDirectionLabel,
  getDirectionLabelZh,
  type MtrDirectionEntry,
  type MtrStationEntry,
} from "../data/mtr";

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

export default function HomePage() {
  const router = useRouter();

  const [selectedLine, setSelectedLine] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");

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

  const canNavigate = selectedLine && selectedDirection && selectedStation;

  const boardUrl = canNavigate
    ? `/board/mtr/${selectedLine}/${selectedStation}/${selectedDirection}`
    : null;

  function handleLineChange(lineCode: string) {
    setSelectedLine(lineCode);
    setSelectedDirection("");
    setSelectedStation("");
  }

  function handleDirectionChange(dir: string) {
    setSelectedDirection(dir);
    // Keep the selected station if it also exists in the new direction
    const newEntry = MTR_LINE_DIRECTIONS.find(
      (d) => d.lineCode === selectedLine && d.urlDirection === dir
    );
    const codesInNewDir = newEntry?.stations.map((s) => s.code) ?? [];
    if (!codesInNewDir.includes(selectedStation)) {
      setSelectedStation("");
    }
  }

  function handleGo() {
    if (boardUrl) router.push(boardUrl);
  }

  const selectedLineInfo = selectedLine ? MTR_LINES[selectedLine] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Routes ETA</h1>
        <p className="mb-8 text-center text-gray-600">
          Hong Kong Transport Arrival Board Display
        </p>

        {/* Board Selector */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">Select Board</h2>

          {/* Line selector */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Line
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={selectedLine}
              onChange={(e) => handleLineChange(e.target.value)}
            >
              <option value="">Select a line...</option>
              {LINE_ORDER.map((code) => {
                const line = MTR_LINES[code];
                if (!line) return null;
                return (
                  <option key={code} value={code}>
                    {line.nameEn} ({line.nameZh})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Direction selector */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Direction
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              value={selectedDirection}
              onChange={(e) => handleDirectionChange(e.target.value)}
              disabled={!selectedLine}
            >
              <option value="">Select a direction...</option>
              {directions.map((d) => (
                <option key={d.urlDirection} value={d.urlDirection}>
                  {getDirectionLabel(d)} ({getDirectionLabelZh(d)})
                </option>
              ))}
            </select>
          </div>

          {/* Station selector */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Station
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              disabled={!selectedDirection}
            >
              <option value="">Select a station...</option>
              {stations.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.nameEn} ({s.nameZh})
                </option>
              ))}
            </select>
          </div>

          {/* Go button */}
          <button
            onClick={handleGo}
            disabled={!canNavigate}
            style={
              canNavigate && selectedLineInfo
                ? { backgroundColor: selectedLineInfo.color }
                : undefined
            }
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            View Arrival Board
          </button>

          {boardUrl && (
            <p className="mt-3 text-xs text-gray-400">
              URL:{" "}
              <code className="rounded bg-gray-100 px-1">{boardUrl}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
