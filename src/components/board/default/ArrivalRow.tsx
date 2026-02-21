/**
 * ArrivalRow Component
 *
 * Displays a single arrival entry in the board
 */

import type { Arrival } from "../../../models";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName } from "@/utils/localization";

export interface ArrivalRowProps {
  arrival: Arrival;
  showPlatform?: boolean;
  showCrowding?: boolean;
  showTrainLength?: boolean;
}

export function ArrivalRow({
  arrival,
  showPlatform = false,
  showCrowding = false,
  showTrainLength = false,
}: ArrivalRowProps) {
  const { t, language } = useTranslation();

  const destinationName = getLocalizedName(
    { name: arrival.destination ?? "", nameZh: arrival.destinationZh },
    language
  );

  const etaText = formatETA(arrival.eta);
  const isArriving =
    arrival.status === "Arrived" ||
    arrival.status === "Arriving" ||
    etaText === "Arr";

  return (
    <div className="flex items-center gap-4 py-4 border-b border-transit-border last:border-0">
      {/* Platform */}
      {showPlatform && arrival.platform && (
        <div className="w-10 h-10 flex items-center justify-center bg-transit-border shrink-0">
          <span className="font-heading text-xl font-semibold leading-none">
            {arrival.platform}
          </span>
        </div>
      )}

      {/* Destination */}
      <div className="flex-1 min-w-0">
        <p className="font-heading text-xl font-medium uppercase tracking-wide truncate leading-tight">
          {destinationName}
        </p>
        {arrival.status && (
          <p className="text-sm font-code text-transit-muted mt-0.5 tracking-wide">
            {arrival.status}
          </p>
        )}
      </div>

      {/* Train Length */}
      {showTrainLength && arrival.trainLength && (
        <div className="text-sm font-code text-transit-muted text-center leading-tight shrink-0">
          <span className="block text-sm font-medium text-foreground">
            {arrival.trainLength}
          </span>
          {t("board.cars")}
        </div>
      )}

      {/* Crowding */}
      {showCrowding && arrival.crowding && (
        <div className="shrink-0">
          <CrowdingIndicator level={arrival.crowding} />
        </div>
      )}

      {/* ETA */}
      <div className="w-20 text-right shrink-0">
        <span
          className={`font-code text-2xl font-medium tabular-nums ${
            isArriving ? "text-transit-accent" : "text-foreground"
          }`}
        >
          {etaText}
        </span>
      </div>
    </div>
  );
}

function CrowdingIndicator({ level }: { level: string }) {
  const bars = {
    low: 1,
    medium: 2,
    high: 3,
  };
  const colors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };
  const activeCount = bars[level as keyof typeof bars] ?? 1;
  const activeColor = colors[level as keyof typeof colors] ?? "bg-gray-400";

  return (
    <div className="flex items-end gap-0.5" title={`Crowding: ${level}`}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1.5 ${i <= activeCount ? activeColor : "bg-transit-border"}`}
          style={{ height: `${i * 5 + 4}px` }}
        />
      ))}
    </div>
  );
}

export function formatETA(eta: Date | null): string {
  if (!eta) return "--";

  const diffMs = eta.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 0) return "Arr";
  if (diffMins === 1) return "1 min";
  return `${diffMins} mins`;
}

export default ArrivalRow;
