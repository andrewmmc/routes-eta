/**
 * BoardScreen Component
 *
 * Main component that renders the complete arrival board display
 * MTR station screen style UI
 *
 * TODO: Implement actual MTR screen styling
 * TODO: Add responsive layout
 * TODO: Add full-screen mode support
 */

import type { BoardState } from "../../models";
import type { BoardLayoutConfig } from "../../config";
import { BoardHeader } from "./BoardHeader";
import { BoardFooter } from "./BoardFooter";
import { ArrivalRow } from "./ArrivalRow";
import { useTranslation } from "@/hooks/useTranslation";

export interface BoardScreenProps {
  boardState: BoardState;
  layout?: Partial<BoardLayoutConfig>;
}

export function BoardScreen({ boardState, layout = {} }: BoardScreenProps) {
  const { t } = useTranslation();

  // Merge default layout with provided layout
  const config: BoardLayoutConfig = {
    rows: layout.rows ?? 4,
    columns: layout.columns ?? 1,
    showPlatform: layout.showPlatform ?? true,
    showCrowding: layout.showCrowding ?? true,
    showTrainLength: layout.showTrainLength ?? true,
  };

  // Limit arrivals to configured rows
  const displayedArrivals = boardState.arrivals.slice(0, config.rows);

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      {/* Header */}
      <BoardHeader boardState={boardState} />

      {/* Column Headers */}
      <div className="mb-2 flex border-b border-gray-300 pb-2 text-sm text-gray-500">
        {config.showPlatform && (
          <div className="w-16 text-center">{t("board.platform")}</div>
        )}
        <div className="flex-1">{t("board.destination")}</div>
        {config.showTrainLength && (
          <div className="mx-4 w-12 text-center">{t("board.trainLength")}</div>
        )}
        {config.showCrowding && (
          <div className="mx-4 w-8 text-center">{t("board.crowding")}</div>
        )}
        <div className="w-24 text-right">{t("board.arrival")}</div>
      </div>

      {/* Arrival Rows */}
      <div className="divide-y divide-gray-100">
        {displayedArrivals.map((arrival, index) => (
          <ArrivalRow
            key={index}
            arrival={arrival}
            showPlatform={config.showPlatform}
            showCrowding={config.showCrowding}
            showTrainLength={config.showTrainLength}
          />
        ))}

        {/* Empty state */}
        {displayedArrivals.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            {t("board.noSchedule")}
          </div>
        )}
      </div>

      {/* Footer */}
      <BoardFooter boardState={boardState} />
    </div>
  );
}

export default BoardScreen;
