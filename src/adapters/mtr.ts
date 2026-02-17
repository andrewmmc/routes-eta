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

    // Return dummy BoardState for testing MTR UI
    // Get line color based on service ID
    const lineColors: Record<string, string> = {
      TWL: "#E2231A", // Tsuen Wan Line - red
      ISL: "#0075C2", // Island Line - blue
      KTL: "#00A040", // Kwun Tong Line - green
      TKL: "#7D499D", // Tseung Kwan O Line - purple
      EAL: "#5EB6E4", // East Rail Line - light blue
      TML: "#9A3B26", // Tuen Ma Line - brown
      SIL: "#B5BD00", // South Island Line - lime
      TCL: "#F7943E", // Tung Chung Line - orange
    };

    // Get destination based on direction
    const destinations: Record<string, { en: string; zh: string }> = {
      TWL: { en: "Central", zh: "中環" },
      ISL: { en: "Chai Wan", zh: "柴灣" },
      KTL: { en: "Whampoa", zh: "黃埔" },
      TKL: { en: "Po Lam", zh: "寶琳" },
      EAL: { en: "Lo Wu", zh: "羅湖" },
      TML: { en: "Tuen Mun", zh: "屯門" },
    };

    const dest = destinations[params.serviceId] || { en: "Central", zh: "中環" };

    return {
      operator: {
        id: "mtr",
        name: "MTR",
        nameZh: "港鐵",
      },
      station: {
        id: params.stopId,
        name: "Admiralty",
        nameZh: "金鐘",
      },
      service: {
        id: params.serviceId,
        name: "Tsuen Wan Line",
        nameZh: "荃灣綫",
        direction: params.directionId as "up" | "down",
        color: lineColors[params.serviceId] || "#E2231A",
      },
      direction: params.directionId as "up" | "down",
      arrivals: [
        {
          eta: new Date(Date.now() + 30 * 1000), // Arriving soon (< 1 min)
          status: "Arriving",
          platform: "1",
          destination: dest.en,
          destinationZh: dest.zh,
          crowding: "low",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 4 * 60 * 1000), // 4 mins
          status: "Scheduled",
          platform: "1",
          destination: dest.en,
          destinationZh: dest.zh,
          crowding: "medium",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 8 * 60 * 1000), // 8 mins
          status: "Scheduled",
          platform: "1",
          destination: dest.en,
          destinationZh: dest.zh,
          crowding: "high",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 12 * 60 * 1000), // 12 mins
          status: "Scheduled",
          platform: "1",
          destination: dest.en,
          destinationZh: dest.zh,
          crowding: "low",
          trainLength: 8,
        },
      ],
      lastUpdated: new Date(),
    };
  },
};

export default mtrAdapter;
