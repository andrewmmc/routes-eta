/**
 * MTR Loading Board
 *
 * Loading state for MTR-style board
 * Matches the MTRBoard layout with header bar and alternating row backgrounds
 */

import type { BoardProps } from "../../../models";
import { useTranslation } from "@/hooks/useTranslation";
import { MTR_COLORS, MTR_LAYOUT, getRowBgClass } from "@/utils/styles";

export function MTRLoadingBoard({ layout = {} }: BoardProps) {
  const { t } = useTranslation();
  const rows = layout.rows ?? MTR_LAYOUT.rowCount;

  return (
    <div
      className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-white"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{t("common.loading")}</span>
      {/* Empty Header Bar - matches MTRHeader */}
      <div
        className={`flex ${MTR_LAYOUT.headerFlex} items-center justify-between ${MTR_LAYOUT.paddingX}`}
        style={{ backgroundColor: MTR_COLORS.headerBg }}
      />

      {/* Empty Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex flex-1 items-center justify-center ${getRowBgClass(index)}`}
        />
      ))}
    </div>
  );
}
