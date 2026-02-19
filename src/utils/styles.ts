/**
 * Style Utilities
 *
 * Shared styling utility functions and constants
 */

import type { Language } from "@/types/language";

// Re-export MTR theme constants for convenience
export { MTR_COLORS, MTR_LAYOUT, MTR_TIMING } from "@/constants/mtr-theme";

/**
 * Get row background color class (pre-computed for Tailwind)
 */
export function getRowBgClass(index: number): "bg-white" | "bg-[#d6eaf8]" {
  return index % 2 === 0 ? "bg-white" : "bg-[#d6eaf8]";
}

/**
 * Get language-specific font class for MTR displays
 */
export function getLanguageFontClass(language: Language): string {
  return language === "zh" ? "font-mtr-chinese" : "font-mtr-english";
}
