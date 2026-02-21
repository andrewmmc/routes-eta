/**
 * Skin Configurations
 *
 * Maps skin IDs to their board and loading components.
 * This allows easy extension for new transport skins.
 */

import type { ComponentType } from "react";
import type { BoardProps, BoardState } from "../models";
import type { BoardLayoutConfig } from "./board-configs";
import { MTRBoard } from "../components/board/mtr";
import { MTRLoadingBoard } from "../components/board/mtr/MTRLoadingBoard";
import { BoardScreen } from "../components/board/default";
import { DefaultLoadingBoard } from "../components/board/default/DefaultLoadingBoard";

export type SkinId = "mtr" | "default";

/**
 * Props for the actual board component (requires data)
 */
export interface BoardDataProps {
  boardState: BoardState;
  layout?: Partial<BoardLayoutConfig>;
  boardParams?: {
    line: string;
    station: string;
    direction: string;
  };
}

export interface SkinConfig {
  id: SkinId;
  Board: ComponentType<BoardDataProps>;
  LoadingBoard: ComponentType<BoardProps>;
}

export const SKIN_CONFIGS: Record<SkinId, SkinConfig> = {
  mtr: {
    id: "mtr",
    Board: MTRBoard,
    LoadingBoard: MTRLoadingBoard,
  },
  default: {
    id: "default",
    Board: BoardScreen,
    LoadingBoard: DefaultLoadingBoard,
  },
} as const;

/**
 * Get skin config by ID, falls back to default skin
 */
export function getSkinConfig(skinId: SkinId): SkinConfig {
  return SKIN_CONFIGS[skinId] ?? SKIN_CONFIGS.default;
}
