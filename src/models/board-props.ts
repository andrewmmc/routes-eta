/**
 * Board Props
 *
 * Shared props interface for board components (both data and loading states)
 */

import type { BoardState } from "./board-state";
import type { BoardLayoutConfig } from "../config";

export interface BoardProps {
  boardState?: BoardState;
  layout?: Partial<BoardLayoutConfig>;
  boardParams?: {
    line: string;
    station: string;
    direction: string;
  };
}
