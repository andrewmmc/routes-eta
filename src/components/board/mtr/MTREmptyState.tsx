/**
 * MTREmptyState Component
 *
 * Placeholder rows displayed when no arrival data is available
 * Renders rows with zebra stripe pattern
 */

import type { Language } from "@/types/language";
import { getMtrLabels } from "@/constants/mtr-labels";
import { getRowBgClass, getLanguageFontClass } from "@/utils/styles";

export interface MTREmptyStateProps {
  rows: number;
  startIndex?: number;
  showMessage?: boolean;
  language: Language;
}

export function MTREmptyState({
  rows,
  startIndex = 0,
  showMessage = true,
  language,
}: MTREmptyStateProps) {
  const labels = getMtrLabels(language);
  const textFontClass = getLanguageFontClass(language);

  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex min-h-16 flex-1 items-center justify-center ${getRowBgClass(startIndex + index)}`}
        >
          {showMessage && index === 0 && (
            <span
              className={`text-2xl text-gray-400 md:text-3xl lg:text-4xl ${textFontClass}`}
            >
              {labels.noSchedule}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

export default MTREmptyState;
