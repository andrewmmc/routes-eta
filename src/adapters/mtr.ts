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
import {
  MTR_LINES,
  getMtrStationInfo,
  getMtrDirectionEntry,
  getDirectionLabel,
} from "../data/mtr";

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

    // Look up real line and station info from data module
    const lineInfo = MTR_LINES[params.serviceId];
    const stationInfo = getMtrStationInfo(params.serviceId, params.stopId);

    // Determine destination from the direction entry (last station in direction)
    const dirEntry = params.directionId
      ? getMtrDirectionEntry(params.serviceId, params.directionId)
      : undefined;
    const terminalStation = dirEntry?.stations[dirEntry.stations.length - 1];
    const dest = terminalStation
      ? { en: terminalStation.nameEn, zh: terminalStation.nameZh }
      : { en: "Terminal", zh: "終點站" };

    const directionLabel = dirEntry ? getDirectionLabel(dirEntry) : undefined;

    return {
      operator: {
        id: "mtr",
        name: "MTR",
        nameZh: "港鐵",
      },
      station: {
        id: params.stopId,
        name: stationInfo?.nameEn ?? params.stopId,
        nameZh: stationInfo?.nameZh ?? params.stopId,
      },
      service: {
        id: params.serviceId,
        name: lineInfo?.nameEn ?? params.serviceId,
        nameZh: lineInfo?.nameZh ?? params.serviceId,
        direction: params.directionId as "up" | "down",
        color: lineInfo?.color ?? "#E2231A",
      },
      direction: params.directionId as "up" | "down",
      arrivals: [
        {
          eta: new Date(Date.now() + 30 * 1000),
          status: "Arriving",
          platform: "1",
          destination: directionLabel ?? dest.en,
          destinationZh: dest.zh,
          crowding: "low",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 4 * 60 * 1000),
          status: "Scheduled",
          platform: "1",
          destination: directionLabel ?? dest.en,
          destinationZh: dest.zh,
          crowding: "medium",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 8 * 60 * 1000),
          status: "Scheduled",
          platform: "1",
          destination: directionLabel ?? dest.en,
          destinationZh: dest.zh,
          crowding: "high",
          trainLength: 8,
        },
        {
          eta: new Date(Date.now() + 12 * 60 * 1000),
          status: "Scheduled",
          platform: "1",
          destination: directionLabel ?? dest.en,
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
