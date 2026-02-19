/**
 * MTR Labels
 *
 * Centralized text labels for MTR board components
 */

import type { Language } from "@/types/language";

export const MTR_LABELS = {
  zh: {
    arriving: "即將抵達",
    minutes: "分鐘",
    noSchedule: "暫無班次資料",
  },
  en: {
    arriving: "Arriving",
    minutes: "min",
    noSchedule: "No schedule information",
  },
} as const;

export function getMtrLabels(language: Language) {
  return MTR_LABELS[language];
}
