/**
 * MTR Adapter
 *
 * Handles data fetching and transformation for MTR (Mass Transit Railway)
 * API: https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php
 *
 * API spec notes:
 * - ttnt, valid, source are dummy fields (always N/A) — do not use for logic
 * - timetype is EAL-only: "A" = Arrival time, "D" = Departure time
 * - route is EAL-only: "" = Normal, "RAC" = Via Racecourse station
 * - isdelay is optional at the top level
 */

import { z } from "zod";
import type {
  TransportAdapter,
  FetchParams,
  AdapterCapabilities,
} from "./base";
import type { BoardState } from "../models";
import { ARRIVAL_STATUS, type ArrivalStatus } from "../models/arrival";
import { MTR_LINES, getMtrStationInfo } from "../data/mtr";

// ── Zod schemas ────────────────────────────────────────────────────────────────

const MtrArrivalSchema = z.object({
  // seq is documented as Numbers but the API returns it as a string
  seq: z.coerce.number(),
  dest: z.string(),
  // plat is documented as Numbers but the API returns it as a string
  plat: z.coerce.string(),
  time: z.string(), // "YYYY-MM-DD HH:MM:SS" in HKT (UTC+8)
  // ttnt, valid, source are dummy fields per spec — kept for schema completeness only
  ttnt: z.union([z.string(), z.number()]).optional(),
  valid: z.string().optional(), // "Y" = real ETA, "N" = timetable schedule only
  source: z.string().optional(),
  // EAL-only optional fields
  timetype: z.enum(["A", "D"]).optional(), // A = Arrival, D = Departure
  route: z.string().optional(), // "" = Normal, "RAC" = Via Racecourse
});

const MtrLineStationDataSchema = z.object({
  curr_time: z.string(),
  sys_time: z.string(),
  UP: z.array(MtrArrivalSchema).optional(),
  DOWN: z.array(MtrArrivalSchema).optional(),
});

const MtrSuccessResponseSchema = z.object({
  sys_time: z.string(),
  curr_time: z.string(),
  status: z.literal(1),
  isdelay: z.string().optional(), // Optional per spec
  message: z.string(),
  data: z.record(z.string(), MtrLineStationDataSchema).optional(),
});

const MtrErrorResponseSchema = z.object({
  resultCode: z.number(),
  timestamp: z.string(),
  status: z.literal(0),
  message: z.string(),
  error: z.object({
    errorCode: z.string(),
    errorMsg: z.string(),
  }),
});

const MtrApiResponseSchema = z.union([
  MtrSuccessResponseSchema,
  MtrErrorResponseSchema,
]);

type MtrArrival = z.infer<typeof MtrArrivalSchema>;

// ── Helpers ────────────────────────────────────────────────────────────────────

const MTR_API_BASE = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";

/**
 * Parse an HKT datetime string ("YYYY-MM-DD HH:MM:SS") to a Date object.
 * HKT is UTC+8.
 */
export function parseHktTime(timeStr: string): Date {
  return new Date(timeStr.replace(" ", "T") + "+08:00");
}

/**
 * Map the URL-friendly direction ("up" / "down") to the API key ("UP" / "DOWN").
 */
export function toApiDirection(
  directionId: string | undefined
): "UP" | "DOWN" | null {
  if (!directionId) return null;
  const upper = directionId.toUpperCase();
  if (upper === "UP" || upper === "DOWN") return upper;
  return null;
}

/** Threshold for "arriving" status (1 minute in milliseconds) */
const ARRIVING_THRESHOLD_MS = 60000;

export interface DeriveStatusParams {
  /** Arrival time string from API (HKT format) */
  arrivalTime: string;
  /** Current time string from API (HKT format) */
  currTime: string;
  /** EAL-only: "A" = Arrival, "D" = Departure */
  timetype?: "A" | "D";
  /** "Y" = real ETA, "N" = timetable schedule only */
  valid?: string;
  /** Global delay flag */
  isDelayed: boolean;
}

/**
 * Derive arrival status with priority:
 * 1. Time proximity (within 1 min) → "Arriving"
 * 2. timetype (EAL-only) → "Arriving" or "Departing"
 * 3. valid === "N" → "Scheduled"
 * 4. isDelayed → "Delayed"
 */
export function deriveStatus(
  params: DeriveStatusParams
): ArrivalStatus | undefined {
  const { arrivalTime, currTime, timetype, valid, isDelayed } = params;

  // 1. Check time proximity
  const arrivalDate = parseHktTime(arrivalTime);
  const currDate = parseHktTime(currTime);
  const diffMs = arrivalDate.getTime() - currDate.getTime();
  if (diffMs <= ARRIVING_THRESHOLD_MS && diffMs >= 0) {
    return ARRIVAL_STATUS.ARRIVING;
  }

  // 2. Check timetype (EAL-only)
  if (timetype === "A") return ARRIVAL_STATUS.ARRIVING;
  if (timetype === "D") return ARRIVAL_STATUS.DEPARTING;

  // 3. Check valid field
  if (valid === "N") return ARRIVAL_STATUS.SCHEDULED;

  // 4. Check delay flag
  if (isDelayed) return ARRIVAL_STATUS.DELAYED;

  return undefined;
}

export interface DestinationTextResult {
  destination: string;
  destinationZh: string;
}

export interface DestinationParams {
  serviceId: string;
  stopId: string;
  directionId: string | undefined;
  destCode: string;
  destNameEn: string | undefined;
  destNameZh: string | undefined;
  isViaRacecourse: boolean;
}

/**
 * Get destination text for an arrival, handling special cases like AEL.
 */
export function getDestinationText(
  params: DestinationParams
): DestinationTextResult {
  const {
    serviceId,
    stopId,
    directionId,
    destCode,
    destNameEn,
    destNameZh,
    isViaRacecourse,
  } = params;

  // Special case: AEL UP direction at HOK, KOW, TSY shows "Airport & AsiaWorld-Expo"
  // but only when the actual destination is AWE (AsiaWorld-Expo)
  const isAelUpFromCityToAwe =
    serviceId === "AEL" &&
    directionId === "up" &&
    ["HOK", "KOW", "TSY"].includes(stopId) &&
    destCode === "AWE";

  if (isAelUpFromCityToAwe) {
    return {
      destination: "Airport & AsiaWorld-Expo",
      destinationZh: "機場及博覽館",
    };
  }

  return {
    destination:
      (destNameEn ?? destCode) + (isViaRacecourse ? " via Racecourse" : ""),
    destinationZh:
      (destNameZh ?? destCode) + (isViaRacecourse ? " 經馬場" : ""),
  };
}

// ── Adapter ────────────────────────────────────────────────────────────────────

export const MTR_CAPABILITIES: AdapterCapabilities = {
  hasPlatform: true,
  hasCrowding: false,
  hasNextStation: false,
  hasTrainLength: false,
  hasCustomUI: true, // MTR has its own branded board UI
};

export const mtrAdapter: TransportAdapter = {
  operatorId: "mtr",
  capabilities: MTR_CAPABILITIES,

  async fetchRaw(params: FetchParams): Promise<unknown> {
    const url = new URL(MTR_API_BASE);
    url.searchParams.set("line", params.serviceId);
    url.searchParams.set("sta", params.stopId);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`MTR API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },

  async mapToBoardState(
    raw: unknown,
    params: FetchParams
  ): Promise<BoardState> {
    const validated = MtrApiResponseSchema.parse(raw);

    const lineInfo = MTR_LINES[params.serviceId];
    const stationInfo = getMtrStationInfo(params.serviceId, params.stopId);

    // Handle error/unsuccessful responses by returning empty arrivals
    if (validated.status === 0) {
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
        arrivals: [],
        lastUpdated: parseHktTime(validated.timestamp),
      };
    }

    // The data key uses the format "{LINE}-{STATION}"
    const dataKey = `${params.serviceId}-${params.stopId}`;
    const stationData = validated.data?.[dataKey];

    const dir = toApiDirection(params.directionId);
    const rawArrivals: MtrArrival[] =
      dir === "UP"
        ? (stationData?.UP ?? [])
        : dir === "DOWN"
          ? (stationData?.DOWN ?? [])
          : [...(stationData?.UP ?? []), ...(stationData?.DOWN ?? [])];

    // Sort by seq ascending — do NOT filter by valid (it is a dummy field per spec)
    const sortedArrivals = [...rawArrivals].sort((a, b) => a.seq - b.seq);

    const isDelayed = validated.isdelay === "Y";

    const arrivals = sortedArrivals.map((a) => {
      const destStation = getMtrStationInfo(params.serviceId, a.dest);
      const isViaRacecourse = a.route === "RAC";

      const { destination, destinationZh } = getDestinationText({
        serviceId: params.serviceId,
        stopId: params.stopId,
        directionId: params.directionId,
        destCode: a.dest,
        destNameEn: destStation?.nameEn,
        destNameZh: destStation?.nameZh,
        isViaRacecourse,
      });

      // Check if train has arrived: curr_time equals arrival time
      const isArrived = stationData?.curr_time === a.time;

      return {
        eta: parseHktTime(a.time),
        status: isArrived
          ? ARRIVAL_STATUS.ARRIVED
          : deriveStatus({
              arrivalTime: a.time,
              currTime: stationData?.curr_time ?? "",
              timetype: a.timetype,
              valid: a.valid,
              isDelayed,
            }),
        platform: a.plat,
        destination,
        destinationZh,
      };
    });

    const lastUpdated = stationData?.curr_time
      ? parseHktTime(stationData.curr_time)
      : new Date();

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
      arrivals,
      lastUpdated,
    };
  },
};

export default mtrAdapter;
