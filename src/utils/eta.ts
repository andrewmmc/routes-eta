/**
 * Shared ETA display helpers.
 *
 * Minutes use ceiling so a remaining 2 min 1 sec is shown as 3 minutes.
 */

export function getEtaMinutes(
  eta: Date | null,
  now: number = Date.now()
): number | null {
  if (!eta) return null;
  const diffMs = eta.getTime() - now;
  if (!Number.isFinite(diffMs)) return null;
  return Math.ceil(diffMs / 60_000);
}

export function isWithinArrivingWindow(
  eta: Date | null,
  now: number,
  thresholdMs: number
): boolean {
  if (!eta) return false;
  const diffMs = eta.getTime() - now;
  return (
    Number.isFinite(diffMs) && diffMs >= -thresholdMs && diffMs <= thresholdMs
  );
}
