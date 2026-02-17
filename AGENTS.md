# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run format:check  # Check formatting
```

## Architecture

This is a Hong Kong transport arrival display UI (MTR station screen style) built with Next.js Page Router, TypeScript, Tailwind CSS, SWR, and Zod.

### Key Pattern: Adapter Layer

The UI does **not** directly consume external API data. All data flows through the adapter pattern:

```
External API → Adapter → BoardState (unified model) → UI Components
```

**Adding a new operator:**
1. Create adapter in `src/adapters/{operator}.ts` implementing `TransportAdapter` interface
2. Implement `fetchRaw()` to call the API
3. Implement `mapToBoardState()` to transform API response to unified `BoardState`
4. Define `capabilities` (hasPlatform, hasCrowding, etc.)
5. Register in `src/adapters/index.ts`

**The unified BoardState model:**
- `Operator` - Transport operator (MTR, KMB, etc.)
- `Station` - Stop/station info
- `Service` - Route/line info
- `Arrival[]` - ETA entries with platform, destination, crowding
- `lastUpdated` - Timestamp

### Routing

Board URLs follow the pattern:
```
/board/{operatorId}/{serviceId}/{stationId}/{direction?}
```

Example: `/board/mtr/TWL/CEN/down`

### Data Flow

1. `useBoardData` hook (SWR) fetches via adapter
2. Adapter calls external API via `fetchRaw()`
3. Adapter transforms response via `mapToBoardState()`
4. `BoardScreen` component renders `BoardState`

### Current Status

- MTR adapter has dummy implementation (needs real DATA.GOV.HK API integration)
- KMB, Citybus, Ferry adapters to be added later
