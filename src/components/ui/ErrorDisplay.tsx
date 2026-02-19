/**
 * Error Component
 *
 * Displays an error state for the board
 *
 * TODO: Add retry button
 * TODO: Add more detailed error messages
 */

import { useTranslation } from "@/hooks/useTranslation";

export interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message,
  onRetry,
}: ErrorDisplayProps) {
  const { t } = useTranslation();

  const displayMessage = message || t('errors.noData');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-2xl rounded-lg bg-red-50 px-6 py-16 shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-red-800">{t('errors.loadFailed')}</h2>
          <p className="mb-4 text-red-600">{displayMessage}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              {t('common.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
