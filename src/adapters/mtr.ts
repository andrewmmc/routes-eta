/**
 * MTR Adapter
 *
 * Handles data fetching and transformation for MTR (Mass Transit Railway)
 *
 * TODO: Implement actual API integration with DATA.GOV.HK
 * TODO: Add proper error handling
 * TODO: Add caching strategy
 */

import type {
  TransportAdapter,
  FetchParams,
  AdapterCapabilities,
} from "./base";
import type { BoardState } from "../models";

export const MTR_CAPABILITIES: AdapterCapabilities = {
  hasPlatform: true,
  hasCrowding: true,
  hasNextStation: true,
  hasTrainLength: true,
};

export const mtrAdapter: TransportAdapter = {
  operatorId: "mtr",
  capabilities: MTR_CAPABILITIES,

  /**
   * Fetch raw ETA data from MTR API
   *
   * TODO: Replace with actual API endpoint from DATA.GOV.HK
   * TODO: Add proper request headers
   * TODO: Add timeout handling
   */
  async fetchRaw(params: FetchParams): Promise<unknown> {
    // DUMMY IMPLEMENTATION
    console.log("[MTR Adapter] fetchRaw called with:", params);

    // TODO: Replace with actual API call
    // const response = await fetch(`https://api.data.gov.hk/mtr/eta/${params.stopId}`);
    // return response.json();

    // Return dummy data for now
    return {
      line: params.serviceId,
      station: params.stopId,
      data: [],
    };
  },

  /**
   * Transform MTR API response to unified BoardState
   *
   * TODO: Map actual API fields to BoardState model
   * TODO: Handle edge cases (no data, delays, etc.)
   * TODO: Add proper Zod validation
   */
  async mapToBoardState(
    raw: unknown,
    params: FetchParams
  ): Promise<BoardState> {
    // DUMMY IMPLEMENTATION
    console.log("[MTR Adapter] mapToBoardState called with:", raw);

    // TODO: Parse and validate raw data with Zod
    // const validated = MtrApiResponseSchema.parse(raw);

    // Return dummy BoardState for now
    return {
      operator: {
        id: "mtr",
        name: "MTR",
        nameZh: "港鐵",
      },
      station: {
        id: params.stopId,
        name: params.stopId,
        nameZh: params.stopId,
      },
      service: {
        id: params.serviceId,
        name: params.serviceId,
        nameZh: params.serviceId,
      },
      arrivals: [
        {
          eta: new Date(Date.now() + 2 * 60 * 1000), // 2 mins
          status: "Arriving",
          platform: "1",
          destination: "Central",
          destinationZh: "中環",
          crowding: "low",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 6 * 60 * 1000), // 6 mins
          status: "Scheduled",
          platform: "1",
          destination: "Central",
          destinationZh: "中環",
          crowding: "medium",
          trainLength: 8,
        },
      ],
      lastUpdated: new Date(),
    };
  },
};

export default mtrAdapter;
