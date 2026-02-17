/**
 * MTRHeader Component
 *
 * Top header bar with weather (placeholder) and current time
 * Dark navy blue background with white text
 */

import { useState, useEffect } from "react";

export function MTRHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex flex-[0.75] items-center justify-between bg-[#1a3a5f] px-16 text-white">
      {/* Left: Weather placeholder */}
      <div className="flex items-center gap-6">
        {/* Weather icon placeholder */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
          <WeatherIcon />
        </div>
        {/* Temperature placeholder */}
        <span className="text-5xl font-semibold">--°C</span>
      </div>

      {/* Right: Current time */}
      <div className="text-7xl font-bold tracking-wider">{formattedTime}</div>
    </div>
  );
}

/**
 * Weather Icon (placeholder)
 *
 * TODO: Replace with actual weather data integration
 */
function WeatherIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      className="h-10 w-10"
    >
      {/* Sun icon as placeholder */}
      <circle cx="12" cy="12" r="5" fill="white" />
      <g stroke="white" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

export default MTRHeader;
