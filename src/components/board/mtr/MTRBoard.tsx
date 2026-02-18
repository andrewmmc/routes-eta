/**
 * MTRBoard Component
 *
 * Main container for MTR-style arrival board display
 * Designed for 1920x1080 full screen displays
 * Strictly follows MTR station screen design
 */

import { useState, useEffect } from "react";
import type { BoardState } from "../../../models";
import type { BoardLayoutConfig } from "../../../config";
import { MTRHeader } from "./MTRHeader";
import { MTRArrivalRow } from "./MTRArrivalRow";
import { MTREmptyState } from "./MTREmptyState";

export type Language = "zh" | "en";

export interface MTRBoardProps {
  boardState: BoardState;
  layout?: Partial<BoardLayoutConfig>;
}

export function MTRBoard({ boardState, layout = {} }: MTRBoardProps) {
  const [language, setLanguage] = useState<Language>("zh");
  const [now, setNow] = useState(Date.now);

  // Toggle language every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLanguage((prev) => (prev === "zh" ? "en" : "zh"));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Update current time every minute for filtering
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const config: BoardLayoutConfig = {
    rows: layout.rows ?? 4,
    columns: layout.columns ?? 1,
    showPlatform: layout.showPlatform ?? true,
    showCrowding: layout.showCrowding ?? true,
    showTrainLength: layout.showTrainLength ?? true,
  };

  // Filter out arrivals more than 60 minutes away
  const visibleArrivals = boardState.arrivals.filter((arrival) => {
    if (!arrival.eta) return true;
    const diffMs = arrival.eta.getTime() - now;
    const diffMins = diffMs / 60000;
    return diffMins <= 60;
  });

  const displayedArrivals = visibleArrivals.slice(0, config.rows);
  const emptyRowsCount = config.rows - displayedArrivals.length;
  const hasNoData = displayedArrivals.length === 0;

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top Header Bar - Weather & Time */}
      <MTRHeader />

      {/* Arrival Rows */}
      {displayedArrivals.map((arrival, index) => (
        <MTRArrivalRow
          key={index}
          arrival={arrival}
          index={index}
          lineColor={boardState.service.color}
          language={language}
        />
      ))}

      {/* Filler rows to always show config.rows */}
      {emptyRowsCount > 0 && (
        <MTREmptyState
          rows={emptyRowsCount}
          startIndex={displayedArrivals.length}
          showMessage={hasNoData}
          language={language}
        />
      )}
    </div>
  );
}

export default MTRBoard;
