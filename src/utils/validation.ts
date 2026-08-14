/**
 * Validation Utilities
 *
 * Runtime validation helpers for transport data
 */

import { DEFAULT_OPERATOR, type OperatorId } from "../models/operator";
import {
  getMtrDirectionEntry,
  MTR_LINES,
  validateMtrRouteParams,
} from "../data/mtr";

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
  return id === "mtr";
}

export interface HomeSelection {
  operator: OperatorId;
  line: string;
  direction: string;
  station: string;
}

function firstQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Validate home-page query params and drop impossible combinations. */
export function parseHomeQuery(query: {
  operator?: string | string[];
  line?: string | string[];
  direction?: string | string[];
  station?: string | string[];
}): HomeSelection {
  const operatorRaw = firstQueryValue(query.operator);
  const operator = isValidOperatorId(operatorRaw)
    ? operatorRaw
    : DEFAULT_OPERATOR;

  const line = firstQueryValue(query.line);
  const directionRaw = firstQueryValue(query.direction);
  const station = firstQueryValue(query.station);

  if (operator !== "mtr" || !MTR_LINES[line]) {
    return { operator, line: "", direction: "", station: "" };
  }

  const directionEntry =
    directionRaw === "up" || directionRaw === "down"
      ? getMtrDirectionEntry(line, directionRaw)
      : undefined;
  const direction = directionEntry ? directionRaw : "";

  const stationValid = validateMtrRouteParams(
    line,
    station,
    direction || undefined
  );

  return {
    operator,
    line,
    direction,
    station: stationValid ? station : "",
  };
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
