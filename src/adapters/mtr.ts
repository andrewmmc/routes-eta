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
  valid: z.string().optional(),
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

const MtrApiResponseSchema = z.object({
  sys_time: z.string(),
  curr_time: z.string(),
  status: z.number(),
  isdelay: z.string().optional(), // Optional per spec
  message: z.string(),
  data: z.record(z.string(), MtrLineStationDataSchema).optional(),
});

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

/**
 * Derive arrival status from per-arrival timetype and global isdelay flag.
 * timetype takes precedence as it is per-arrival; isdelay is a global fallback.
 */
export function deriveStatus(
  timetype: "A" | "D" | undefined,
  isDelayed: boolean
): string | undefined {
  if (timetype === "A") return "Arriving";
  if (timetype === "D") return "Departing";
  if (isDelayed) return "Delayed";
  return undefined;
}

// ── Adapter ────────────────────────────────────────────────────────────────────

export const MTR_CAPABILITIES: AdapterCapabilities = {
  hasPlatform: true,
  hasCrowding: false,
  hasNextStation: false,
  hasTrainLength: false,
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

    if (validated.status !== 1) {
      throw new Error(`MTR API returned failure status: ${validated.message}`);
    }

    const lineInfo = MTR_LINES[params.serviceId];
    const stationInfo = getMtrStationInfo(params.serviceId, params.stopId);

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

      const destination =
        (destStation?.nameEn ?? a.dest) +
        (isViaRacecourse ? " via Racecourse" : "");
      const destinationZh =
        (destStation?.nameZh ?? a.dest) + (isViaRacecourse ? " 經馬場" : "");

      // Check if train has arrived: curr_time equals arrival time
      const isArrived = stationData?.curr_time === a.time;

      return {
        eta: parseHktTime(a.time),
        status: deriveStatus(a.timetype, isDelayed),
        platform: a.plat,
        destination,
        destinationZh,
        isArrived,
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
