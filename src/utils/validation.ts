/**
 * Validation Utilities
 *
 * Runtime validation helpers for transport data
 */

import type { OperatorId } from "@/models/operator";

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
