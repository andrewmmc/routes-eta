# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Commands

```bash
npm run dev            # Start development server (localhost:3000)
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run format         # Format with Prettier
npm run format:check   # Check formatting
npm run test           # Run tests (vitest)
npm run test:watch     # Run tests in watch mode
npm run generate:mtr   # Regenerate src/data/mtr-directions.generated.ts from CSV
```

## Architecture

This is a Hong Kong transport arrival display UI (MTR station screen style) built with Next.js Page Router, TypeScript, Tailwind CSS, SWR, Zod, and next-intl.

### Deployment: GitHub Pages (Static Export)

This project is deployed to GitHub Pages and uses Next.js static export. **Only use Next.js features compatible with static export:**

- ✅ **Allowed**: `useEffect`, `useState`, `useRouter` (client-side), dynamic routes with `[...params]`, client-side data fetching (SWR, fetch)
- ❌ **Not allowed**: `getServerSideProps`, `getStaticProps`, `getInitialProps`, API routes, server-side middleware, Image Optimization (`next/image` with external URLs)

Route validation and redirects must be done client-side using `useEffect` + `router.replace()`, not server-side.

### Key Pattern: Adapter Layer

The UI does **not** directly consume external API data. All data flows through the adapter pattern:

```
External API → Adapter → BoardState (unified model) → UI Components
```

**Adding a new operator:**

1. Create adapter in `src/adapters/{operator}.ts` implementing `TransportAdapter` interface
2. Implement `fetchRaw()` to call the API
3. Implement `mapToBoardState(raw, params: FetchParams)` to transform API response to unified `BoardState`
4. Define `capabilities` (hasPlatform, hasCrowding, hasNextStation, hasTrainLength)
5. Register in `src/adapters/index.ts`
6. Extend the `OperatorId` union in `src/models/operator.ts`

**The unified BoardState model** (`src/models/`):

- `Operator` - Transport operator (id, name, nameZh)
- `Station` - Stop/station info (id, name, nameZh)
- `Service` - Route/line info (id, name, nameZh, direction?, color?)
- `Arrival[]` - ETA entries: eta, status, platform, destination, destinationZh, crowding, trainLength, isArrived
- `direction?` - Top-level direction (mirrors service.direction)
- `alerts?` - Service alert strings
- `lastUpdated` - Timestamp

**AdapterCapabilities** (`src/adapters/base.ts`):

```typescript
interface AdapterCapabilities {
  hasPlatform: boolean;
  hasCrowding: boolean;
  hasNextStation: boolean;
  hasTrainLength: boolean;
}
```

### Routing

Board URLs follow the pattern:

```
/board/{operatorId}/{serviceId}/{stationId}/{direction?}
```

Examples:

- `/board/mtr/TWL/CEN/down` — Tsuen Wan Line at Central (downbound)
- `/board/mtr/EAL/LOW/up` — East Rail Line at Lo Wu

The board page (`src/pages/board/[...params].tsx`) renders `MTRBoard` for MTR and the generic `BoardScreen` for other operators.

### Data Flow

1. `useBoardData` hook (SWR) fetches via adapter, refresh interval: 60s
2. Adapter calls external API via `fetchRaw()`
3. Adapter transforms response via `mapToBoardState(raw, params)`
4. `filterByMaxEta()` removes arrivals beyond 60 minutes (null-eta arrivals are kept)
5. `MTRBoard` or `BoardScreen` component renders `BoardState`

### i18n

- Supported languages: `"en"` (English) and `"zh"` (Traditional Chinese, default)
- `next-intl` provides translation strings from `messages/en.json` and `messages/zh.json`
- `LanguageContext` / `LanguageProvider` (`src/contexts/`) persist the selected language to `localStorage`
- `useTranslation()` hook wraps both systems
- `MTRBoard` auto-toggles language display every 10 seconds (independent of the user's UI language setting)

### Static MTR Data

- `src/data/mtr.ts` — MTR line definitions (10 lines: AEL, DRL, EAL, ISL, KTL, SIL, TCL, TKL, TML, TWL), helpers: `getMtrLineDirections()`, `getMtrStationInfo()`, `getMtrDirectionEntry()`
- `src/data/mtr-directions.generated.ts` — Auto-generated from `assets/mtr_lines_and_stations.csv`; **do not edit manually**. Regenerate with `npm run generate:mtr`

### Key Directories

| Path                          | Description                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `src/adapters/`               | Adapter implementations + registry + base interfaces                                 |
| `src/models/`                 | TypeScript domain model interfaces (Operator, Station, Service, Arrival, BoardState) |
| `src/hooks/`                  | `useBoardData` (SWR), `useTranslation`                                               |
| `src/components/board/`       | Generic board UI components (BoardScreen, BoardHeader, ArrivalRow, BoardFooter)      |
| `src/components/board/mtr/`   | MTR-specific skin (MTRBoard, MTRHeader, MTRArrivalRow, MTREmptyState)                |
| `src/components/ui/`          | Shared UI (LoadingBoard, LoadingSpinner, ErrorDisplay)                               |
| `src/lib/api.ts`              | `apiFetch`, `formatETA`, `formatCountdown`                                           |
| `src/config/board-configs.ts` | Board layout config (currently all generated dynamically)                            |
| `src/utils/localization.ts`   | `getLocalizedName`, `formatLocalizedTime`                                            |
| `src/schemas/`                | Zod validation schemas                                                               |
| `src/pages/`                  | Next.js Page Router pages (`/`, `/board/[...params]`)                                |
| `messages/`                   | i18n strings (en.json, zh.json)                                                      |
| `scripts/`                    | Code generation scripts                                                              |

### Current Status

- MTR adapter: **fully implemented** with real DATA.GOV.HK API (`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php`)
- KMB, Citybus, Ferry adapters: not yet implemented
- Weather display in MTR header: placeholder only (shows `--°C`)
- Board configs (`BOARD_CONFIGS`): empty; all configs generated dynamically via `getBoardConfigFromParams()`

### Testing

Tests are co-located with source files (`*.test.ts`). Run with `npm run test`.

Key test files:

- `src/adapters/mtr.test.ts` — MTR adapter (parseHktTime, toApiDirection, deriveStatus, mapToBoardState)
- `src/adapters/index.test.ts` — Adapter registry
- `src/lib/api.test.ts` — formatETA, formatCountdown
- `src/hooks/useBoardData.test.ts` — filterByMaxEta, MAX_ETA_MS
- `src/data/mtr.test.ts` — MTR static data helpers
- `src/config/board-configs.test.ts` — Board config helpers
- `src/utils/localization.test.ts` — Localization utilities
