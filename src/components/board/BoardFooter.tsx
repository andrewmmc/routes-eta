/**
 * BoardFooter Component
 *
 * Displays footer information (last updated time, alerts)
 *
 * TODO: Add alert ticker for service disruptions
 * TODO: Add auto-refresh indicator
 */

import type { BoardState } from "../../models";

export interface BoardFooterProps {
  boardState: BoardState;
}

export function BoardFooter({ boardState }: BoardFooterProps) {
  const { lastUpdated, alerts } = boardState;

  // TODO: Format time properly with locale
  const formattedTime = lastUpdated.toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mb-2 rounded bg-yellow-100 p-2 text-sm text-yellow-800">
          {alerts.map((alert, index) => (
            <div key={index}>{alert}</div>
          ))}
        </div>
      )}

      {/* Last Updated */}
      <div className="text-right text-sm text-gray-400">
        最後更新: {formattedTime}
      </div>
    </div>
  );
}

export default BoardFooter;
