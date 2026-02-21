/**
 * Operator Domain Model
 *
 * Represents a transport operator (e.g., MTR)
 */

// TODO: Extend this union type when adding new operators (KMB, Citybus, Ferry)
export type OperatorId = "mtr" | string;

export interface Operator {
  id: OperatorId;
  name: string; // e.g., "MTR"
  nameZh: string; // e.g., "港鐵"
}

export const OPERATORS: Record<OperatorId, Operator> = {
  mtr: {
    id: "mtr",
    name: "MTR",
    nameZh: "港鐵",
  },
};

// Order of operators to display in UI
export const OPERATOR_ORDER: OperatorId[] = Object.keys(
  OPERATORS
) as OperatorId[];

// Default operator (first in order)
export const DEFAULT_OPERATOR: OperatorId = OPERATOR_ORDER[0] || "mtr";
