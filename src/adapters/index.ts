/**
 * Adapter Registry
 *
 * Central place to register and retrieve adapters by operator ID
 */

import type { TransportAdapter } from "./base";
import type { OperatorId } from "../models/operator";
import { mtrAdapter } from "./mtr";

// Registry of all available adapters
// TODO: Add KMB, Citybus, Ferry adapters later
const adapters: Record<OperatorId, TransportAdapter> = {
  mtr: mtrAdapter,
};

/**
 * Get adapter by operator ID
 *
 * TODO: Add proper error handling for unknown operators
 */
export function getAdapter(operatorId: OperatorId): TransportAdapter {
  const adapter = adapters[operatorId];

  if (!adapter) {
    throw new Error(`Unknown operator: ${operatorId}`);
  }

  return adapter;
}

/**
 * Check if an operator is supported
 */
export function isOperatorSupported(operatorId: OperatorId): boolean {
  return operatorId in adapters;
}

/**
 * Get list of all supported operators
 */
export function getSupportedOperators(): OperatorId[] {
  return Object.keys(adapters);
}

// Re-export all adapters
export * from "./base";
export { mtrAdapter } from "./mtr";
