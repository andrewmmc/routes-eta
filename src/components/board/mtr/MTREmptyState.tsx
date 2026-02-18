/**
 * MTREmptyState Component
 *
 * Placeholder rows displayed when no arrival data is available
 * Renders rows with zebra stripe pattern
 */

export interface MTREmptyStateProps {
  rows: number;
  startIndex?: number;
  showMessage?: boolean;
}

export function MTREmptyState({
  rows,
  startIndex = 0,
  showMessage = true,
}: MTREmptyStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex flex-1 items-center justify-center ${
            (startIndex + index) % 2 === 0 ? "bg-white" : "bg-[#d6eaf8]"
          }`}
        >
          {showMessage && index === 0 && (
            <span className="text-4xl text-gray-400">暫無班次資料</span>
          )}
        </div>
      ))}
    </>
  );
}

export default MTREmptyState;
