/**
 * MTREmptyState Component
 *
 * Placeholder rows displayed when no arrival data is available
 * Renders rows with zebra stripe pattern
 */

import { getMtrLabels } from "@/constants/mtr-labels";
import { getLanguageFontClass, getRowBgClass } from "@/utils/styles";
import type { Language } from "@/types/language";

export interface MTREmptyStateProps {
  rows: number;
  startIndex?: number;
  language?: Language;
  showLabel?: boolean;
}

export function MTREmptyState({
  rows,
  startIndex = 0,
  language = "zh",
  showLabel = false,
}: MTREmptyStateProps) {
  const labels = getMtrLabels(language);
  const textFontClass = getLanguageFontClass(language);

  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex min-h-0 flex-1 items-center justify-center ${getRowBgClass(startIndex + index)}`}
        >
          {showLabel && index === 0 ? (
            <span
              className={`text-xl text-black md:text-4xl lg:text-6xl ${textFontClass}`}
            >
              {labels.noSchedule}
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}

export default MTREmptyState;
