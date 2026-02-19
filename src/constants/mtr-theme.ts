/**
 * MTR Theme Constants
 *
 * Centralized MTR board styling constants for consistency
 */

/**
 * MTR color palette
 */
export const MTR_COLORS = {
  /** Header background - navy blue */
  headerBg: "#1a3a5f",
  /** Alternating row background - light blue */
  rowAltBg: "#d6eaf8",
  /** Default line color - red */
  defaultLine: "#E2231A",
  /** Primary text color */
  textPrimary: "#000000",
  /** Inverse text color (on dark backgrounds) */
  textInverse: "#ffffff",
} as const;

/**
 * MTR layout constants
 */
export const MTR_LAYOUT = {
  /** Header flex ratio */
  headerFlex: "flex-[0.75]" as const,
  /** Horizontal padding for rows and header (mobile: px-4, desktop: px-16) */
  paddingX: "px-4 md:px-12 lg:px-16" as const,
  /** Default number of arrival rows to display */
  rowCount: 4,
} as const;

/**
 * MTR timing constants (in milliseconds)
 */
export const MTR_TIMING = {
  /** Language toggle interval */
  languageToggleMs: 10000,
  /** Clock update interval */
  clockUpdateMs: 1000,
  /** Threshold for "arriving" status */
  arrivingThresholdMs: 60000,
} as const;
