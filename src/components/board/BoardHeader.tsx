/**
 * BoardHeader Component
 *
 * Displays the header section of the board screen
 * Shows line name, station name, direction
 *
 * TODO: Style to match MTR station screen design
 * TODO: Add line color indicator
 * TODO: Add operator logo
 */

import type { BoardState } from "../../models";

export interface BoardHeaderProps {
  boardState: BoardState;
}

export function BoardHeader({ boardState }: BoardHeaderProps) {
  const { operator, station, service } = boardState;

  // TODO: Get line color from service config
  const lineColor = service.color || "#000000";

  return (
    <div className="mb-4 border-b-4 pb-4" style={{ borderColor: lineColor }}>
      {/* Operator */}
      <div className="text-sm text-gray-500">
        {operator.name} {operator.nameZh}
      </div>

      {/* Line Name */}
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-3 rounded"
          style={{ backgroundColor: lineColor }}
        />
        <h1 className="text-3xl font-bold">{service.nameZh || service.name}</h1>
      </div>

      {/* Station Name */}
      <div className="mt-2 text-xl">{station.nameZh || station.name}</div>

      {/* Direction */}
      {service.direction && (
        <div className="text-sm text-gray-400">
          往 {service.direction === "up" ? "Up" : "Down"}
        </div>
      )}
    </div>
  );
}

export default BoardHeader;
