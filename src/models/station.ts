/**
 * Station Domain Model
 *
 * Represents a station, stop, or wharf
 */

export interface Station {
  id: string;
  name: string; // e.g., "Central", "Wan Chai"
  nameZh: string; // e.g., "中環", "灣仔"
}

// TODO: Add station data/lookup for each operator
// TODO: Consider adding location coordinates for future features
