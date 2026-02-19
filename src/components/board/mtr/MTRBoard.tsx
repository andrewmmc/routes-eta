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
import type { Language } from "@/types/language";
import { MTR_LAYOUT, MTR_TIMING } from "@/utils/styles";
import { MTRHeader } from "./MTRHeader";
import { MTRArrivalRow } from "./MTRArrivalRow";
import { MTREmptyState } from "./MTREmptyState";

export type { Language } from "@/types/language";

export interface MTRBoardProps {
  boardState: BoardState;
  layout?: Partial<BoardLayoutConfig>;
}

export function MTRBoard({ boardState, layout = {} }: MTRBoardProps) {
  const [language, setLanguage] = useState<Language>("zh");

  // Toggle language periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setLanguage((prev) => (prev === "zh" ? "en" : "zh"));
    }, MTR_TIMING.languageToggleMs);

    return () => clearInterval(timer);
  }, []);

  const config: BoardLayoutConfig = {
    rows: layout.rows ?? MTR_LAYOUT.rowCount,
    columns: layout.columns ?? 1,
    showPlatform: layout.showPlatform ?? true,
    showCrowding: layout.showCrowding ?? true,
    showTrainLength: layout.showTrainLength ?? true,
  };

  const displayedArrivals = boardState.arrivals.slice(0, config.rows);
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
