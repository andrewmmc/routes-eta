/**
 * Loading Component
 *
 * Displays a loading state for the board
 */

import { MTR_COLORS, MTR_LAYOUT, getRowBgClass } from "@/utils/styles";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
    </div>
  );
}

export function LoadingBoard() {
  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Empty Header Bar - matches MTRHeader */}
      <div
        className={`flex ${MTR_LAYOUT.headerFlex} items-center justify-between ${MTR_LAYOUT.paddingX}`}
        style={{ backgroundColor: MTR_COLORS.headerBg }}
      />

      {/* Empty Rows */}
      {Array.from({ length: MTR_LAYOUT.rowCount }).map((_, index) => (
        <div
          key={index}
          className={`flex flex-1 items-center justify-center ${getRowBgClass(index)}`}
        />
      ))}
    </div>
  );
}

export default LoadingSpinner;
