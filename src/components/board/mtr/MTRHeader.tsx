/**
 * MTRHeader Component
 *
 * Top header bar with weather (placeholder) and current time
 * Dark navy blue background with white text
 * Clickable to navigate back to home page
 *
 * When no direction is provided, uses the line color as background
 * and displays the line name (alternating zh/en every 10s) on the left.
 */

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Language } from "@/types/language";
import {
  getLanguageFontClass,
  MTR_COLORS,
  MTR_LAYOUT,
  MTR_TIMING,
} from "@/utils/styles";

export interface MTRHeaderProps {
  boardParams?: { line: string; station: string; direction?: string };
  service?: { name: string; nameZh: string; color?: string };
  language: Language;
}

export function MTRHeader({ boardParams, service, language }: MTRHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, MTR_TIMING.clockUpdateMs);
    return () => clearInterval(clockTimer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Construct home URL with query params to preserve selection state
  const homeHref = useMemo(() => {
    if (!boardParams) return "/";
    const query: Record<string, string> = {
      line: boardParams.line,
      station: boardParams.station,
    };
    if (boardParams.direction) query.direction = boardParams.direction;
    const params = new URLSearchParams(query);
    return `/?${params.toString()}`;
  }, [boardParams]);

  const hasDirection = !!boardParams?.direction;

  if (!hasDirection && service) {
    // No-direction mode: line color background, line name on left
    const lineName = language === "zh" ? service.nameZh : service.name;
    const fontClass = getLanguageFontClass(language);

    return (
      <Link
        href={homeHref}
        className={`flex ${MTR_LAYOUT.headerFlex} cursor-pointer items-center py-2 md:py-2 lg:py-3 ${MTR_LAYOUT.paddingX} text-white`}
        style={{ backgroundColor: service.color ?? MTR_COLORS.headerBg }}
      >
        <span
          className={`text-3xl text-white md:text-5xl lg:text-7xl ${fontClass}`}
        >
          {lineName}
        </span>
      </Link>
    );
  }

  // Default: navy background with time on right
  return (
    <Link
      href={homeHref}
      className={`flex ${MTR_LAYOUT.headerFlex} cursor-pointer items-center justify-between py-2 md:py-2 lg:py-3 ${MTR_LAYOUT.paddingX} text-white`}
      style={{ backgroundColor: MTR_COLORS.headerBg }}
    >
      {/* Left: Weather placeholder */}
      <span className="text-2xl font-mtr-english md:text-4xl lg:text-5xl">
        {/* --°C */}
      </span>

      {/* Right: Current time */}
      <div className="text-4xl font-mtr-english md:text-5xl lg:text-7xl">
        {formattedTime}
      </div>
    </Link>
  );
}

export default MTRHeader;
