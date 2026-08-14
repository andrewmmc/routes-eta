/**
 * Board Configuration
 *
 * Defines board layouts and settings for different operators/stations
 */

import { DEFAULT_OPERATOR, type OperatorId } from "../models/operator";
import { isValidOperatorId } from "../utils/validation";

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
export function findMatchingBoardConfig(
  configs: Iterable<BoardConfig>,
  operatorId: string,
  serviceId: string,
  stopId: string,
  directionId?: string
): BoardConfig | undefined {
  return [...configs].find(
    (config) =>
      config.operatorId === operatorId &&
      config.serviceId === serviceId &&
      config.stopId === stopId &&
      config.directionId === directionId
  );
}

export function getBoardConfigFromParams(
  operatorId: string,
  serviceId: string,
  stopId: string,
  directionId?: string
): BoardConfig {
  const existingConfig = findMatchingBoardConfig(
    Object.values(BOARD_CONFIGS),
    operatorId,
    serviceId,
    stopId,
    directionId
  );

  if (existingConfig) {
    return existingConfig;
  }

  const resolvedOperator = isValidOperatorId(operatorId)
    ? operatorId
    : DEFAULT_OPERATOR;

  return {
    id: `${resolvedOperator}-${serviceId}-${stopId}`,
    operatorId: resolvedOperator,
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
