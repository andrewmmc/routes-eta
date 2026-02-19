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
 * Note: All MTR lines are supported dynamically via getBoardConfigFromParams().
 * This record can be used for custom overrides if needed.
 */
export const BOARD_CONFIGS: Record<string, BoardConfig> = {};

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
  // All MTR lines are supported with this default layout
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
      showCrowding: false,
      showTrainLength: false,
    },
  };
}
