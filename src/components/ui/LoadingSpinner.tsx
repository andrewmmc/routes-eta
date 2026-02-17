/**
 * Loading Component
 *
 * Displays a loading state for the board
 *
 * TODO: Add skeleton loading animation matching MTR style
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
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-4">
          <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
          <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
          <div className="h-6 w-32 rounded bg-gray-200" />
        </div>

        {/* Rows skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center py-3">
            <div className="h-6 w-16 rounded bg-gray-200" />
            <div className="ml-4 h-6 flex-1 rounded bg-gray-200" />
            <div className="ml-4 h-6 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSpinner;
