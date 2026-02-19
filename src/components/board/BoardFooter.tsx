/**
 * BoardFooter Component
 *
 * Displays footer information (last updated time, alerts)
 *
 * TODO: Add alert ticker for service disruptions
 * TODO: Add auto-refresh indicator
 */

import type { BoardState } from "../../models";
import { useTranslation } from "@/hooks/useTranslation";
import { formatLocalizedTime } from "@/utils/localization";

export interface BoardFooterProps {
  boardState: BoardState;
}

export function BoardFooter({ boardState }: BoardFooterProps) {
  const { lastUpdated, alerts } = boardState;
  const { t, language } = useTranslation();

  const formattedTime = formatLocalizedTime(lastUpdated, language);

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
        {t("board.lastUpdated")}: {formattedTime}
      </div>
    </div>
  );
}

export default BoardFooter;
