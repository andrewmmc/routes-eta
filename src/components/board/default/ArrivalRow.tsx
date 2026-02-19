/**
 * ArrivalRow Component
 *
 * Displays a single arrival entry in the board
 *
 * TODO: Style to match MTR station screen design
 * TODO: Add animation for arriving trains
 * TODO: Add crowding indicator visuals
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

  // TODO: Add proper styling with Tailwind
  // TODO: Add color coding based on crowding level
  // TODO: Add platform highlight

  const destinationName = getLocalizedName(
    { name: arrival.destination ?? "", nameZh: arrival.destinationZh },
    language
  );

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      {/* Platform */}
      {showPlatform && arrival.platform && (
        <div className="w-16 text-center">
          <span className="text-2xl font-bold">{arrival.platform}</span>
        </div>
      )}

      {/* Destination */}
      <div className="flex-1">
        <div className="text-lg font-semibold">{destinationName}</div>
        {arrival.status && (
          <div className="text-sm text-gray-500">{arrival.status}</div>
        )}
      </div>

      {/* Train Length */}
      {showTrainLength && arrival.trainLength && (
        <div className="mx-4 text-sm text-gray-400">
          {arrival.trainLength} {t("board.cars")}
        </div>
      )}

      {/* Crowding */}
      {showCrowding && arrival.crowding && (
        <div className="mx-4">
          <CrowdingIndicator level={arrival.crowding} />
        </div>
      )}

      {/* ETA */}
      <div className="w-24 text-right text-2xl font-bold">
        {formatETA(arrival.eta)}
      </div>
    </div>
  );
}

/**
 * Crowding Indicator Component
 *
 * TODO: Add proper visual design
 */
function CrowdingIndicator({ level }: { level: string }) {
  // TODO: Use colors matching MTR style
  const colors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  return (
    <div
      className={`h-4 w-4 rounded-full ${colors[level as keyof typeof colors] || "bg-gray-300"}`}
      title={`Crowding: ${level}`}
    />
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
