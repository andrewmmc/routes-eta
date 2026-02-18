/**
 * MTREmptyState Component
 *
 * Placeholder rows displayed when no arrival data is available
 * Renders 4 rows with zebra stripe pattern
 */

export interface MTREmptyStateProps {
  rows?: number;
}

export function MTREmptyState({ rows = 4 }: MTREmptyStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex flex-1 items-center justify-center ${
            index % 2 === 0 ? "bg-white" : "bg-[#d6eaf8]"
          }`}
        >
          {index === 0 && (
            <span className="text-4xl text-gray-400">暫無班次資料</span>
          )}
        </div>
      ))}
    </>
  );
}

export default MTREmptyState;
