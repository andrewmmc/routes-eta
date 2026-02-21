/**
 * BoardHeader Component
 *
 * Displays the header section of the board screen
 * Shows line name, station name, direction
 */

import type { BoardState } from "../../../models";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName } from "@/utils/localization";

export interface BoardHeaderProps {
  boardState: BoardState;
}

export function BoardHeader({ boardState }: BoardHeaderProps) {
  const { operator, station, service } = boardState;
  const { t, language } = useTranslation();

  const lineColor = service.color || "var(--transit-accent)";

  const operatorName = getLocalizedName(operator, language);
  const serviceName = getLocalizedName(service, language);
  const stationName = getLocalizedName(station, language);
  const directionLabel =
    service.direction === "up" ? t("home.up") : t("home.down");

  return (
    <div className="mb-5 pb-5 border-b border-transit-border">
      {/* Operator */}
      <p className="text-sm font-code tracking-widest uppercase text-transit-muted mb-2">
        {operatorName}
      </p>

      {/* Line Name */}
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-1 h-10 shrink-0"
          style={{ backgroundColor: lineColor }}
        />
        <h1 className="font-heading text-4xl font-semibold uppercase tracking-wide leading-none">
          {serviceName}
        </h1>
      </div>

      {/* Station Name */}
      <p className="font-heading text-2xl font-medium uppercase tracking-wide text-foreground mt-2">
        {stationName}
      </p>

      {/* Direction */}
      {service.direction && (
        <p className="text-sm font-code text-transit-muted mt-1 tracking-wide">
          {language === "zh" ? "往" : "To"} {directionLabel}
        </p>
      )}
    </div>
  );
}

export default BoardHeader;
