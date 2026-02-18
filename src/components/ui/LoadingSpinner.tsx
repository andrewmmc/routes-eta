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
      {/* Empty Header Bar - matches MTRHeader flex-[0.75] and color */}
      <div className="flex flex-[0.75] items-center justify-between bg-[#1a3a5f] px-16" />

      {/* Empty Rows */}
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`flex flex-1 items-center justify-center ${
            index % 2 === 0 ? "bg-white" : "bg-[#d6eaf8]"
          }`}
        />
      ))}
    </div>
  );
}

export default LoadingSpinner;
