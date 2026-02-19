/**
 * Language Type
 *
 * Supported languages for the application
 */

export type Language = "en" | "zh";

export const DEFAULT_LANGUAGE = "zh" as const satisfies Language;
