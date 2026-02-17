/**
 * Transport Adapter Base Interface
 *
 * All operator adapters must implement this interface
 * This enables the unified UI to work with any transport operator
 */

import type { BoardState } from "../models";
import type { OperatorId } from "../models/operator";

/**
 * Parameters for fetching data
 * TODO: Adjust based on actual API requirements
 */
export interface FetchParams {
  stopId: string;
  serviceId: string;
  directionId?: string;
}

/**
 * Capabilities that an adapter supports
 * Used to conditionally show/hide UI elements
 */
export interface AdapterCapabilities {
  hasPlatform: boolean; // MTR: yes, Bus: no
  hasCrowding: boolean; // MTR: yes
  hasNextStation: boolean; // Ferry: no
  hasTrainLength: boolean; // MTR: yes
}

/**
 * Base adapter interface
 */
export interface TransportAdapter {
  operatorId: OperatorId;

  // Fetch raw data from API
  fetchRaw(params: FetchParams): Promise<unknown>;

  // Transform raw data to unified BoardState model
  mapToBoardState(raw: unknown, params: FetchParams): Promise<BoardState>;

  // Declare supported features
  capabilities: AdapterCapabilities;
}

// TODO: Add error types for adapter operations
// TODO: Add retry configuration interface
