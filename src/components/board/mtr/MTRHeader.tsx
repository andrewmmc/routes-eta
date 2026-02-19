/**
 * MTRHeader Component
 *
 * Top header bar with weather (placeholder) and current time
 * Dark navy blue background with white text
 * Clickable to navigate back to home page
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { MTR_COLORS, MTR_LAYOUT, MTR_TIMING } from "@/utils/styles";

export function MTRHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, MTR_TIMING.clockUpdateMs);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Link
      href="/"
      className={`flex ${MTR_LAYOUT.headerFlex} cursor-pointer items-center justify-between ${MTR_LAYOUT.paddingX} text-white`}
      style={{ backgroundColor: MTR_COLORS.headerBg }}
    >
      {/* Left: Weather placeholder */}
      <span className="text-2xl font-mtr-english md:text-4xl lg:text-5xl">
        {/* --°C */}
      </span>

      {/* Right: Current time */}
      <div className="text-3xl font-mtr-english md:text-5xl lg:text-7xl">
        {formattedTime}
      </div>
    </Link>
  );
}

export default MTRHeader;
