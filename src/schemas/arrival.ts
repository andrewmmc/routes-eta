/**
 * Arrival Zod Schema
 *
 * Validates arrival/ETA data from external APIs
 */

import { z } from "zod";

// TODO: Adjust fields based on actual API response from DATA.GOV.HK
// TODO: Add proper date parsing for ETA field
export const ArrivalSchema = z.object({
  eta: z.string().or(z.date()).nullable(),
  status: z.string().optional(),
  platform: z.string().optional(),
  destination: z.string().optional(),
  destinationZh: z.string().optional(),
  crowding: z.enum(["low", "medium", "high"]).optional(),
  trainLength: z.number().optional(),
});

export type ArrivalSchemaType = z.infer<typeof ArrivalSchema>;

// TODO: Add MTR-specific schema
// TODO: Add KMB-specific schema
// TODO: Add Citybus-specific schema
