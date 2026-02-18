/**
 * Error Component
 *
 * Displays an error state for the board
 *
 * TODO: Add retry button
 * TODO: Add more detailed error messages
 */

export interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message = "無法載入資料，請稍後再試",
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-2xl rounded-lg bg-red-50 px-6 py-16 shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-red-800">載入失敗</h2>
          <p className="mb-4 text-red-600">{message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              重試
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
