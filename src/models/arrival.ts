/**
 * Arrival Domain Model
 *
 * Represents a single arrival ETA
 */

export type CrowdingLevel = "low" | "medium" | "high";

export interface Arrival {
  eta: Date | null; // Estimated arrival time
  status?: string; // e.g., "Departed", "Arriving", "Delayed"
  platform?: string; // Platform number (optional for buses)
  destination?: string;
  destinationZh?: string;
  crowding?: CrowdingLevel; // Optional crowding level
  trainLength?: number; // Number of cars (MTR specific)
}

// TODO: Add helper functions for formatting arrival time
// TODO: Add status constants/enums
