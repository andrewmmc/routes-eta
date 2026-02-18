/**
 * Loading Component
 *
 * Displays a loading state for the board
 */

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
      {/* Empty Header Bar */}
      <div className="flex h-16 items-center justify-between bg-[#003768] px-16">
        <div className="h-6 w-32 animate-pulse rounded bg-white/20" />
        <div className="h-6 w-24 animate-pulse rounded bg-white/20" />
      </div>

      {/* Loading Rows */}
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`flex flex-1 items-center justify-between px-16 ${
            index % 2 === 0 ? "bg-white" : "bg-[#d6eaf8]"
          }`}
        >
          <div className="h-12 w-48 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSpinner;
