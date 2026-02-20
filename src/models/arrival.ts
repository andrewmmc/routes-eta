/**
 * Arrival Domain Model
 *
 * Represents a single arrival ETA
 */

export type CrowdingLevel = "low" | "medium" | "high";

/**
 * Arrival status constants
 */
export const ARRIVAL_STATUS = {
  ARRIVED: "Arrived",
  ARRIVING: "Arriving",
  DEPARTING: "Departing",
  DELAYED: "Delayed",
  SCHEDULED: "Scheduled",
  CANCELLED: "Cancelled",
} as const;

export type ArrivalStatus =
  (typeof ARRIVAL_STATUS)[keyof typeof ARRIVAL_STATUS];

export interface Arrival {
  eta: Date | null; // Estimated arrival time
  status?: ArrivalStatus; // e.g., "Arrived", "Arriving", "Departing", "Delayed"
  platform?: string; // Platform number (optional for buses)
  destination?: string;
  destinationZh?: string;
  crowding?: CrowdingLevel; // Optional crowding level
  trainLength?: number; // Number of cars (MTR specific)
}
