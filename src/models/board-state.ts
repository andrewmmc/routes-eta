/**
 * BoardState Domain Model
 *
 * Represents the complete state for a board screen display
 * This is the unified model that all adapters map to
 */

import type { Operator } from "./operator";
import type { Station } from "./station";
import type { Service, Direction } from "./service";
import type { Arrival } from "./arrival";

export interface BoardState {
  operator: Operator;
  station: Station;
  service: Service;
  direction?: Direction;
  arrivals: Arrival[];
  alerts?: string[]; // Service alerts or disruptions
  lastUpdated: Date;
}

// TODO: Add factory function to create empty/default BoardState
// TODO: Add validation helpers
