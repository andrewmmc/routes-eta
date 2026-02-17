/**
 * Service Domain Model
 *
 * Represents a route or line (e.g., Tsuen Wan Line, Bus 960)
 */

export type Direction = "up" | "down" | "inbound" | "outbound";

export interface Service {
  id: string; // Route/Line ID
  name: string; // e.g., "Tsuen Wan Line", "960"
  nameZh: string; // e.g., "荃灣綫", "960"
  direction?: Direction;
  color?: string; // Line color for UI styling
}

// TODO: Add service/line data for each operator
