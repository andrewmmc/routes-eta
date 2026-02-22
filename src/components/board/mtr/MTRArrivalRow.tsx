/**
 * MTRArrivalRow Component
 *
 * Single arrival entry row with alternating background colors
 * Layout: [Destination] --- [Line Circle] --- [Platform Circle + ETA]
 */

import { useRef, useState, useEffect, useCallback } from "react";
import type { Arrival } from "../../../models";
import { ARRIVAL_STATUS } from "../../../models/arrival";
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
  isDepartureStation?: boolean;
}

export function MTRArrivalRow({
  arrival,
  index,
  lineColor = MTR_COLORS.defaultLine,
  language,
  isDepartureStation = false,
}: MTRArrivalRowProps) {
  const bgColor = getRowBgClass(index);
  const containerRef = useRef<HTMLDivElement>(null);
  const zhTextRef = useRef<HTMLSpanElement>(null);
  const enTextRef = useRef<HTMLSpanElement>(null);
  const [marqueeNeeded, setMarqueeNeeded] = useState({ zh: false, en: false });

  // Determine if arriving soon (within 1 minute)
  const isArrivingSoon = isArriving(arrival.eta);

  // Get text based on current language
  const labels = getMtrLabels(language);

  // Get destination based on language
  const destinationZh = arrival.destinationZh || arrival.destination;
  const destinationEn = arrival.destination;
  const destination = language === "zh" ? destinationZh : destinationEn;

  // Font class based on language
  const textFontClass = getLanguageFontClass(language);

  // Check overflow for both languages
  const checkOverflow = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const zhWidth = zhTextRef.current?.scrollWidth ?? 0;
      const enWidth = enTextRef.current?.scrollWidth ?? 0;
      setMarqueeNeeded({
        zh: zhWidth > containerWidth,
        en: enWidth > containerWidth,
      });
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [checkOverflow, destinationZh, destinationEn]);

  const shouldMarquee = language === "zh" ? marqueeNeeded.zh : marqueeNeeded.en;

  return (
    <div
      className={`flex min-h-16 flex-1 items-center justify-between px-4 md:px-12 lg:px-16 ${bgColor}`}
    >
      {/* Hidden elements to measure text width for both languages */}
      <span
        ref={zhTextRef}
        className="invisible absolute whitespace-nowrap text-3xl font-mtr-chinese md:text-5xl lg:text-7xl"
        aria-hidden="true"
      >
        {destinationZh}
      </span>
      <span
        ref={enTextRef}
        className="invisible absolute whitespace-nowrap text-3xl font-mtr-english md:text-5xl lg:text-7xl"
        aria-hidden="true"
      >
        {destinationEn}
      </span>

      {/* Left: Destination */}
      <div
        ref={containerRef}
        className={`min-w-0 flex-1 whitespace-nowrap ${shouldMarquee ? "mtr-marquee-container" : ""}`}
      >
        <span
          className={`inline-block whitespace-nowrap text-3xl text-black md:text-5xl lg:text-7xl ${textFontClass} ${shouldMarquee ? "mtr-marquee-content" : ""}`}
          style={shouldMarquee ? { paddingRight: "2rem" } : undefined}
        >
          {shouldMarquee ? `${destination}　　　　${destination}` : destination}
        </span>
      </div>

      {/* Right: Platform circle + ETA in separate columns */}
      <div className="flex shrink-0 items-center">
        {/* Column 1: Platform circle */}
        <div className="flex w-14 items-center justify-center md:w-20 lg:w-28">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-mtr-english text-white md:h-14 md:w-14 md:text-4xl lg:h-20 lg:w-20 lg:text-6xl"
            style={{ backgroundColor: lineColor }}
          >
            <span className="mt-0.5 leading-none md:mt-1 lg:mt-1.5">
              {arrival.platform}
            </span>
          </div>
        </div>

        {/* Column 2: ETA */}
        <div className="flex min-w-[120px] items-center justify-end gap-2 md:min-w-[240px] md:gap-3 lg:min-w-[320px] lg:gap-4">
          {arrival.status === ARRIVAL_STATUS.ARRIVED ? null : isArrivingSoon ? ( // Train has arrived - leave column empty
            <span
              className={`text-xl text-black md:text-4xl lg:text-6xl ${textFontClass}`}
            >
              {isDepartureStation ? labels.departing : labels.arriving}
            </span>
          ) : (
            <>
              <span className="text-4xl font-mtr-english text-black md:text-5xl lg:text-7xl">
                {formatETAMinutes(arrival.eta)}
              </span>
              <span
                className={`text-lg text-black md:text-3xl lg:text-5xl ${textFontClass}`}
              >
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
 * Format ETA as minutes only (rounds at 0.5)
 */
function formatETAMinutes(eta: Date | null): string {
  if (!eta) return "";

  const diffMs = eta.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 0) return "0";

  return diffMins.toString();
}

export default MTRArrivalRow;
