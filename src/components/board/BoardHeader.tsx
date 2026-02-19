/**
 * BoardHeader Component
 *
 * Displays the header section of the board screen
 * Shows line name, station name, direction
 *
 * TODO: Style to match MTR station screen design
 * TODO: Add line color indicator
 * TODO: Add operator logo
 */

import type { BoardState } from "../../models";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName } from "@/utils/localization";

export interface BoardHeaderProps {
  boardState: BoardState;
}

export function BoardHeader({ boardState }: BoardHeaderProps) {
  const { operator, station, service } = boardState;
  const { t, language } = useTranslation();

  // TODO: Get line color from service config
  const lineColor = service.color || "#000000";

  const operatorName = getLocalizedName(operator, language);
  const serviceName = getLocalizedName(service, language);
  const stationName = getLocalizedName(station, language);
  const directionLabel =
    service.direction === "up" ? t("home.up") : t("home.down");

  return (
    <div className="mb-4 border-b-4 pb-4" style={{ borderColor: lineColor }}>
      {/* Operator */}
      <div className="text-sm text-gray-500">{operatorName}</div>

      {/* Line Name */}
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-3 rounded"
          style={{ backgroundColor: lineColor }}
        />
        <h1 className="text-3xl font-bold">{serviceName}</h1>
      </div>

      {/* Station Name */}
      <div className="mt-2 text-xl">{stationName}</div>

      {/* Direction */}
      {service.direction && (
        <div className="text-sm text-gray-400">
          {language === "zh" ? "往" : "To"} {directionLabel}
        </div>
      )}
    </div>
  );
}

export default BoardHeader;
