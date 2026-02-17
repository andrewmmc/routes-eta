/**
 * Board Configuration
 *
 * Defines board layouts and settings for different operators/stations
 */

import type { OperatorId } from "../models/operator";

export interface BoardLayoutConfig {
  rows: number; // Number of arrival rows to show
  columns: number; // Number of columns (for multi-platform displays)
  showPlatform: boolean;
  showCrowding: boolean;
  showTrainLength: boolean;
}

export interface BoardConfig {
  id: string;
  operatorId: OperatorId;
  stopId: string;
  serviceId: string;
  directionId?: string;
  layout: BoardLayoutConfig;
}

/**
 * Pre-defined board configurations
 *
 * TODO: Add configurations for commonly used stations
 * TODO: Consider loading from external config/DB
 */
export const BOARD_CONFIGS: Record<string, BoardConfig> = {
  // MTR - Tsuen Wan Line to Central
  "mtr-tsuen-wan-central": {
    id: "mtr-tsuen-wan-central",
    operatorId: "mtr",
    stopId: "TSW",
    serviceId: "TWL",
    directionId: "down",
    layout: {
      rows: 4,
      columns: 1,
      showPlatform: true,
      showCrowding: true,
      showTrainLength: true,
    },
  },

  // MTR - Island Line to Chai Wan
  "mtr-island-chaiwan": {
    id: "mtr-island-chaiwan",
    operatorId: "mtr",
    stopId: "ISL",
    serviceId: "ISL",
    directionId: "up",
    layout: {
      rows: 4,
      columns: 1,
      showPlatform: true,
      showCrowding: true,
      showTrainLength: true,
    },
  },
};

/**
 * Get board config by ID
 *
 * TODO: Add validation
 */
export function getBoardConfig(id: string): BoardConfig | undefined {
  return BOARD_CONFIGS[id];
}

/**
 * Get board config from URL params
 *
 * TODO: Implement proper param parsing
 */
export function getBoardConfigFromParams(
  operatorId: string,
  serviceId: string,
  stopId: string,
  directionId?: string
): BoardConfig {
  // Try to find existing config
  const existingConfig = Object.values(BOARD_CONFIGS).find(
    (config) =>
      config.operatorId === operatorId &&
      config.serviceId === serviceId &&
      config.stopId === stopId &&
      (directionId === undefined || config.directionId === directionId)
  );

  if (existingConfig) {
    return existingConfig;
  }

  // Return default config
  // TODO: Get capabilities from adapter to determine layout
  return {
    id: `${operatorId}-${serviceId}-${stopId}`,
    operatorId: operatorId as OperatorId,
    stopId,
    serviceId,
    directionId,
    layout: {
      rows: 4,
      columns: 1,
      showPlatform: true,
      showCrowding: true,
      showTrainLength: true,
    },
  };
}
