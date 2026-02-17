/**
 * MTRArrivalRow Component
 *
 * Single arrival entry row with alternating background colors
 * Layout: [Destination] --- [Line Circle] --- [Platform Circle + ETA]
 */

import type { Arrival } from "../../../models";

export interface MTRArrivalRowProps {
  arrival: Arrival;
  index: number;
  lineColor?: string;
}

export function MTRArrivalRow({
  arrival,
  index,
  lineColor = "#E2231A",
}: MTRArrivalRowProps) {
  // Alternating row colors (zebra striping)
  const isEven = index % 2 === 0;
  const bgColor = isEven ? "bg-white" : "bg-[#d6eaf8]";

  // Determine if arriving soon (within 1 minute)
  const isArrivingSoon = isArriving(arrival.eta);

  return (
    <div
      className={`flex flex-1 items-center justify-between px-16 ${bgColor}`}
    >
      {/* Left: Destination */}
      <span className="text-7xl font-bold text-black">
        {arrival.destinationZh || arrival.destination}
      </span>

      {/* Right: Platform circle + ETA in separate columns */}
      <div className="flex items-center">
        {/* Column 1: Platform circle */}
        <div className="flex w-28 items-center justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold text-white"
            style={{ backgroundColor: lineColor }}
          >
            {arrival.platform}
          </div>
        </div>

        {/* Column 2: ETA */}
        <div className="flex min-w-[320px] items-center justify-end gap-4">
          {isArrivingSoon ? (
            <span className="text-6xl font-bold text-black">即將抵達</span>
          ) : (
            <>
              <span className="text-7xl font-bold text-black">
                {formatETAMinutes(arrival.eta)}
              </span>
              <span className="text-5xl text-black">分鐘</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Check if train is arriving (within 1 minute)
 */
function isArriving(eta: Date | null): boolean {
  if (!eta) return false;
  const diffMs = eta.getTime() - Date.now();
  return diffMs <= 60000;
}

/**
 * Format ETA as minutes only
 */
function formatETAMinutes(eta: Date | null): string {
  if (!eta) return "--";

  const diffMs = eta.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 0) return "0";

  return diffMins.toString();
}

export default MTRArrivalRow;
