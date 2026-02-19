/**
 * useBoardData Hook
 *
 * Fetches and manages board state data using SWR
 */

import useSWR from "swr";
import type { BoardState, Arrival } from "../models";
import { getAdapter } from "../adapters";
import type { FetchParams } from "../adapters/base";

export const MAX_ETA_MS = 60 * 60000; // 60 minutes

export function filterByMaxEta(arrivals: Arrival[]): Arrival[] {
  const now = Date.now();
  return arrivals.filter(
    (arrival) => !arrival.eta || arrival.eta.getTime() - now <= MAX_ETA_MS,
  );
}

export interface UseBoardDataOptions {
  operatorId: string;
  stopId: string;
  serviceId: string;
  directionId?: string;
  refreshInterval?: number;
}

export interface UseBoardDataReturn {
  data: BoardState | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/**
 * Custom hook to fetch board data
 *
 * TODO: Add proper error handling
 * TODO: Add retry logic
 * TODO: Consider adding offline support
 */
export function useBoardData({
  operatorId,
  stopId,
  serviceId,
  directionId,
  refreshInterval = 60000, // Default: 60 seconds
}: UseBoardDataOptions): UseBoardDataReturn {
  // Null key tells SWR to skip fetching when required params are missing
  const cacheKey =
    operatorId && serviceId && stopId
      ? `board-${operatorId}-${serviceId}-${stopId}-${directionId || ""}`
      : null;

  const fetcher = async (): Promise<BoardState> => {
    // DUMMY IMPLEMENTATION
    // TODO: Replace with actual data fetching logic

    const adapter = getAdapter(operatorId);
    const params: FetchParams = { stopId, serviceId, directionId };

    // Fetch raw data
    const raw = await adapter.fetchRaw(params);

    // Transform to BoardState
    const boardState = await adapter.mapToBoardState(raw, params);
    return {
      ...boardState,
      arrivals: filterByMaxEta(boardState.arrivals),
    };
  };

  const { data, isLoading, error, mutate } = useSWR(cacheKey, fetcher, {
    refreshInterval,
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    // TODO: Add more SWR options as needed
  });

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refresh: () => mutate(),
  };
}

export default useBoardData;
