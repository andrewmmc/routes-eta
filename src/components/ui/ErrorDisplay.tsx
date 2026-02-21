/**
 * Error Component
 *
 * Displays an error state for the board
 */

import { useTranslation } from "@/hooks/useTranslation";

export interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const { t } = useTranslation();

  const displayMessage = message || t("errors.noData");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-md bg-transit-surface border border-transit-border">
        <div className="h-[3px] w-full bg-transit-accent" />
        <div className="px-6 py-12 text-center">
          <p className="text-[10px] font-code tracking-widest uppercase text-transit-accent mb-4">
            {t("errors.loadFailed")}
          </p>
          <p className="font-heading text-xl font-medium uppercase tracking-wide text-foreground mb-6">
            {displayMessage}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-transit-accent text-white text-sm font-heading font-medium tracking-widest uppercase hover:brightness-110 transition-all"
            >
              {t("common.retry")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
