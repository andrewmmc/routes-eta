/**
 * API Utilities
 *
 * Common utilities for API calls
 */

/**
 * Base API URL
 *
 * TODO: Configure based on environment
 * TODO: Consider using environment variables
 */
export const API_BASE_URL = "https://data.gov.hk";

/**
 * Default request headers
 */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Generic fetch wrapper with error handling
 *
 * TODO: Add timeout support
 * TODO: Add retry logic
 * TODO: Add request cancellation
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Format ETA time for display
 *
 * TODO: Add localization support
 * TODO: Handle edge cases (passed, very soon, etc.)
 */
export function formatETA(eta: Date | null): string {
  if (!eta) {
    return "--";
  }

  const now = new Date();
  const diffMs = eta.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 0) {
    return "Arr";
  }

  if (diffMins === 1) {
    return "1 min";
  }

  return `${diffMins} mins`;
}

/**
 * Format ETA time as countdown
 *
 * TODO: Add proper countdown formatting
 */
export function formatCountdown(eta: Date | null): string {
  if (!eta) {
    return "--:--";
  }

  const now = new Date();
  const diffMs = eta.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "00:00";
  }

  const mins = Math.floor(diffMs / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);

  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
