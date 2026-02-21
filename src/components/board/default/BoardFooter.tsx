/**
 * BoardFooter Component
 *
 * Displays footer information (last updated time, alerts)
 */

import type { BoardState } from "../../../models";
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
    <div className="mt-5 pt-4 border-t border-transit-border">
      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mb-3 px-3 py-2 bg-transit-accent-bg border-l-2 border-transit-accent">
          {alerts.map((alert, index) => (
            <p key={index} className="text-sm font-code text-foreground">
              {alert}
            </p>
          ))}
        </div>
      )}

      {/* Last Updated */}
      <p className="text-right text-sm font-code text-transit-muted tracking-wide">
        {t("board.lastUpdated")}: {formattedTime}
      </p>
    </div>
  );
}

export default BoardFooter;
