/**
 * Default Loading Board
 *
 * Loading state for default-style board
 * Matches the BoardScreen layout with card styling and skeleton rows
 */

import type { BoardProps } from "../../../models";

export function DefaultLoadingBoard({ layout = {} }: BoardProps) {
  const rows = layout.rows ?? 4;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl bg-transit-surface border border-transit-border animate-pulse">
        {/* Line color accent top bar */}
        <div className="h-[3px] w-full bg-transit-accent" />

        <div className="p-6">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="mb-2 h-7 w-24 rounded bg-transit-border" />
            <div className="h-5 w-40 rounded bg-transit-border" />
          </div>

          {/* Column headers skeleton */}
          <div className="mb-1 flex gap-4 pb-2 border-b border-transit-border">
            <div className="w-10 h-4 rounded bg-transit-border" />
            <div className="flex-1 h-4 rounded bg-transit-border" />
            <div className="w-20 h-4 rounded bg-transit-border" />
          </div>

          {/* Rows skeleton */}
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 py-3 border-b border-transit-border"
            >
              <div className="w-10 h-5 rounded bg-transit-border" />
              <div className="flex-1 h-5 rounded bg-transit-border" />
              <div className="w-20 h-5 rounded bg-transit-border" />
            </div>
          ))}

          {/* Footer skeleton */}
          <div className="mt-4 flex justify-between">
            <div className="h-4 w-32 rounded bg-transit-border" />
            <div className="h-4 w-24 rounded bg-transit-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
