/**
 * MTREmptyState Component
 *
 * Placeholder rows displayed when no arrival data is available
 * Renders rows with zebra stripe pattern
 */

import { getRowBgClass } from "@/utils/styles";

export interface MTREmptyStateProps {
  rows: number;
  startIndex?: number;
}

export function MTREmptyState({ rows, startIndex = 0 }: MTREmptyStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex min-h-16 flex-1 items-center justify-center ${getRowBgClass(startIndex + index)}`}
        />
      ))}
    </>
  );
}

export default MTREmptyState;
