/**
 * Validation Utilities
 *
 * Runtime validation helpers for transport data
 */

import type { OperatorId } from "@/models/operator";
import { validateMtrRouteParams } from "../data/mtr";

/**
 * Valid MTR directions
 */
export type MtrDirection = "up" | "down";

/**
 * Validate MTR direction string
 */
export function validateMtrDirection(
  direction: string | undefined
): MtrDirection | null {
  if (direction === "up" || direction === "down") {
    return direction;
  }
  return null;
}

/**
 * Check if operator ID is valid
 */
export function isValidOperatorId(id: string): id is OperatorId {
  return id === "mtr"; // Add more operators as they're implemented
}

/** Validate the complete catch-all board route before data fetching starts. */
export function validateBoardRouteParams(
  params: string[] | undefined
): boolean {
  if (!params || (params.length !== 3 && params.length !== 4)) return false;

  const [operatorId, serviceId, stopId, directionId] = params;
  return (
    operatorId === "mtr" &&
    validateMtrRouteParams(serviceId, stopId, directionId)
  );
}
