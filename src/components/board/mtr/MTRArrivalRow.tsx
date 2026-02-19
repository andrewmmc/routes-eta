/**
 * MTRArrivalRow Component
 *
 * Single arrival entry row with alternating background colors
 * Layout: [Destination] --- [Line Circle] --- [Platform Circle + ETA]
 */

import type { Arrival } from "../../../models";
import type { Language } from "@/types/language";
import { getMtrLabels } from "@/constants/mtr-labels";
import {
  getRowBgClass,
  getLanguageFontClass,
  MTR_COLORS,
  MTR_TIMING,
} from "@/utils/styles";

export interface MTRArrivalRowProps {
  arrival: Arrival;
  index: number;
  lineColor?: string;
  language: Language;
}

export function MTRArrivalRow({
  arrival,
  index,
  lineColor = MTR_COLORS.defaultLine,
  language,
}: MTRArrivalRowProps) {
  const bgColor = getRowBgClass(index);

  // Determine if arriving soon (within 1 minute)
  const isArrivingSoon = isArriving(arrival.eta);

  // Get text based on current language
  const labels = getMtrLabels(language);

  // Get destination based on language
  const destination =
    language === "zh"
      ? arrival.destinationZh || arrival.destination
      : arrival.destination;

  // Font class based on language
  const textFontClass = getLanguageFontClass(language);

  return (
    <div
      className={`flex flex-1 items-center justify-between px-16 ${bgColor}`}
    >
      {/* Left: Destination */}
      <span className={`text-7xl text-black ${textFontClass}`}>
        {destination}
      </span>

      {/* Right: Platform circle + ETA in separate columns */}
      <div className="flex items-center">
        {/* Column 1: Platform circle */}
        <div className="flex w-28 items-center justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-mtr-english text-white"
            style={{ backgroundColor: lineColor }}
          >
            {arrival.platform}
          </div>
        </div>

        {/* Column 2: ETA */}
        <div className="flex min-w-[320px] items-center justify-end gap-4">
          {arrival.isArrived ? null : isArrivingSoon ? ( // Train has arrived - leave column empty
            <span className={`text-6xl text-black ${textFontClass}`}>
              {labels.arriving}
            </span>
          ) : (
            <>
              <span className="text-7xl font-mtr-english text-black">
                {formatETAMinutes(arrival.eta)}
              </span>
              <span className={`text-5xl text-black ${textFontClass}`}>
                {labels.minutes}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Check if train is arriving (within threshold)
 */
function isArriving(eta: Date | null): boolean {
  if (!eta) return false;
  const diffMs = eta.getTime() - Date.now();
  return diffMs <= MTR_TIMING.arrivingThresholdMs;
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
