/**
 * Operator Zod Schema
 *
 * Validates operator data from external APIs
 */

import { z } from "zod";

// TODO: Adjust regex/validation based on actual API response
export const OperatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameZh: z.string(),
});

export type OperatorSchemaType = z.infer<typeof OperatorSchema>;
