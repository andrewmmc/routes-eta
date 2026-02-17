/**
 * Station Zod Schema
 *
 * Validates station data from external APIs
 */

import { z } from "zod";

// TODO: Adjust fields based on actual API response
export const StationSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameZh: z.string(),
});

export type StationSchemaType = z.infer<typeof StationSchema>;
