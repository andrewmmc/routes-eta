/**
 * BoardScreen Component
 *
 * Main component that renders the complete arrival board display
 */

import type { BoardState } from "../../../models";
import type { BoardLayoutConfig } from "../../../config";
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

  const config: BoardLayoutConfig = {
    rows: layout.rows ?? 4,
    columns: layout.columns ?? 1,
    showPlatform: layout.showPlatform ?? true,
    showCrowding: layout.showCrowding ?? true,
    showTrainLength: layout.showTrainLength ?? true,
  };

  const displayedArrivals = boardState.arrivals.slice(0, config.rows);
  const lineColor = boardState.service.color || "var(--transit-accent)";

  return (
    <div className="mx-auto max-w-2xl bg-transit-surface border border-transit-border">
      {/* Line color accent top bar */}
      <div className="h-[3px] w-full" style={{ backgroundColor: lineColor }} />

      <div className="p-6">
        {/* Header */}
        <BoardHeader boardState={boardState} />

        {/* Column Headers */}
        <div className="mb-1 flex gap-4 pb-2 border-b border-transit-border">
          {config.showPlatform && (
            <div className="w-10 text-center text-sm font-code tracking-widest uppercase text-transit-muted">
              {t("board.platform")}
            </div>
          )}
          <div className="flex-1 text-sm font-code tracking-widest uppercase text-transit-muted">
            {t("board.destination")}
          </div>
          {config.showTrainLength && (
            <div className="w-10 text-center text-sm font-code tracking-widest uppercase text-transit-muted">
              {t("board.trainLength")}
            </div>
          )}
          {config.showCrowding && (
            <div className="w-10 text-center text-sm font-code tracking-widest uppercase text-transit-muted">
              {t("board.crowding")}
            </div>
          )}
          <div className="w-20 text-right text-sm font-code tracking-widest uppercase text-transit-muted">
            {t("board.arrival")}
          </div>
        </div>

        {/* Arrival Rows */}
        <div>
          {displayedArrivals.map((arrival, index) => (
            <ArrivalRow
              key={index}
              arrival={arrival}
              showPlatform={config.showPlatform}
              showCrowding={config.showCrowding}
              showTrainLength={config.showTrainLength}
            />
          ))}

          {displayedArrivals.length === 0 && (
            <div className="py-16 text-center font-code text-sm text-transit-muted">
              {t("board.noSchedule")}
            </div>
          )}
        </div>

        {/* Footer */}
        <BoardFooter boardState={boardState} />
      </div>
    </div>
  );
}

export default BoardScreen;
