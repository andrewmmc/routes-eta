/**
 * MTRBoard Component
 *
 * Main container for MTR-style arrival board display
 * Designed for 1920x1080 full screen displays
 * Strictly follows MTR station screen design
 */

import type { BoardState } from "../../../models";
import type { BoardLayoutConfig } from "../../../config";
import { MTRHeader } from "./MTRHeader";
import { MTRArrivalRow } from "./MTRArrivalRow";

export interface MTRBoardProps {
  boardState: BoardState;
  layout?: Partial<BoardLayoutConfig>;
}

export function MTRBoard({ boardState, layout = {} }: MTRBoardProps) {
  const config: BoardLayoutConfig = {
    rows: layout.rows ?? 4,
    columns: layout.columns ?? 1,
    showPlatform: layout.showPlatform ?? true,
    showCrowding: layout.showCrowding ?? true,
    showTrainLength: layout.showTrainLength ?? true,
  };

  const displayedArrivals = boardState.arrivals.slice(0, config.rows);

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
        />
      ))}

      {/* Empty state - render 4 placeholder rows */}
      {displayedArrivals.length === 0 &&
        Array.from({ length: config.rows }).map((_, index) => (
          <div
            key={index}
            className={`flex flex-1 items-center justify-center ${
              index % 2 === 0 ? "bg-white" : "bg-[#d6eaf8]"
            }`}
          >
            {index === Math.floor(config.rows / 2) && (
              <span className="text-4xl text-gray-400">暫無班次資料</span>
            )}
          </div>
        ))}
    </div>
  );
}

export default MTRBoard;
