# Routes ETA - Implementation Plan

## Project Overview

Build a Hong Kong transport arrival display UI (MTR station screen style) with an extensible architecture that supports multiple transport operators through an adapter pattern.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Board Screen   │  │  UI Components  │  (Skin-able)      │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Adapter Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ MTR      │  │ KMB      │  │ Citybus  │  │ Ferry    │     │
│  │ Adapter  │  │ Adapter  │  │ Adapter  │  │ Adapter  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Unified Domain Model                       │
│         (Operator, Station, Service, Arrival, BoardState)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Data Sources                      │
│              DATA.GOV.HK Open Data APIs                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer             | Technology                         |
| ----------------- | ---------------------------------- |
| Framework         | Next.js (Page Router) + TypeScript |
| Styling           | Tailwind CSS                       |
| Data Fetching     | SWR                                |
| Schema Validation | Zod                                |
| Data Source       | DATA.GOV.HK APIs                   |

---

## Core Domain Models

### 1. Operator

```typescript
type OperatorId = "mtr" | "kmb" | "citybus" | "ferry" | string;

interface Operator {
  id: OperatorId;
  name: string; // e.g., "MTR", "KMB"
  nameZh: string; // e.g., "港鐵", "九巴"
}
```

### 2. Station

```typescript
interface Station {
  id: string;
  name: string;
  nameZh: string;
}
```

### 3. Service

```typescript
interface Service {
  id: string; // Route/Line ID
  name: string; // e.g., "Tsuen Wan Line", "960"
  nameZh: string; // e.g., "荃灣綫", "960"
  direction?: Direction;
}
```

### 4. Arrival

```typescript
interface Arrival {
  eta: Date | null; // Estimated arrival time
  status?: string; // e.g., "Departed", "Arriving"
  platform?: string; // Platform number (optional for buses)
  destination?: string;
  crowding?: "low" | "medium" | "high"; // Optional
}
```

### 5. BoardState

```typescript
interface BoardState {
  operator: Operator;
  station: Station;
  service: Service;
  arrivals: Arrival[];
  alerts?: string[];
  lastUpdated: Date;
}
```

---

## Adapter Pattern

Each operator adapter implements:

```typescript
interface TransportAdapter {
  operatorId: OperatorId;

  // Fetch raw data from API
  fetchRaw(params: FetchParams): Promise<unknown>;

  // Transform to unified model
  mapToBoardState(raw: unknown): Promise<BoardState>;

  // Declare supported features
  capabilities: AdapterCapabilities;
}

interface AdapterCapabilities {
  hasPlatform: boolean; // MTR: yes, Bus: no
  hasCrowding: boolean; // MTR: no
  hasNextStation: boolean; // Ferry: no
}
```

---

## Routing Structure (Config-Driven)

### URL Pattern

```
/board/:operatorId/:serviceId/:stationId/:direction
```

### Examples

| URL                                    | Description             |
| -------------------------------------- | ----------------------- |
| `/board/mtr/tsuen-wan-line/central/up` | MTR Central → Tsuen Wan |
| `/board/kmb/960/wan-chai/down`         | KMB 960 from Wan Chai   |
| `/board/ferry/central-mui-wo/central`  | Ferry to Mui Wo         |

### Board Config

```typescript
interface BoardConfig {
  operatorId: OperatorId;
  stopId: string;
  serviceId: string;
  directionId?: string;
  layout: {
    rows: number;
    columns: number;
    showPlatform: boolean;
    showCrowding: boolean;
  };
}
```

---

## Data Update Strategy

### Phase 1: Polling (Initial)

- Refresh every 60 seconds
- Simple, reliable, works immediately

### Phase 2: Optimized Polling (Later)

- SWR with `refreshInterval: 60000`
- Background revalidation
- Error retry with exponential backoff

---

## Implementation Phases

### Phase 1: Foundation

- [ ] Set up Next.js page router structure
- [ ] Define domain models with Zod schemas
- [ ] Create base adapter interface
- [ ] Implement MTR adapter (first operator)
- [ ] Build basic board UI component

### Phase 2: MTR Board Screen

- [ ] Design MTR-style arrival screen UI
- [ ] Implement polling with SWR
- [ ] Add loading/error states
- [ ] Support multiple MTR lines/stations

### Phase 3: Extensibility

- [ ] Add KMB adapter
- [ ] Add Citybus adapter
- [ ] Create config-driven board routing
- [ ] Test multi-operator support

### Phase 4: Enhancements

- [ ] Add BFF layer (Next.js route handlers)
- [ ] Implement caching
- [ ] Add Ferry adapter
- [ ] Build settings/configuration UI

---

## File Structure

```
src/
├── adapters/
│   ├── base.ts              # Adapter interface
│   ├── mtr.ts               # MTR adapter
│   ├── kmb.ts               # KMB adapter (later)
│   └── index.ts
├── models/
│   ├── operator.ts
│   ├── station.ts
│   ├── service.ts
│   ├── arrival.ts
│   └── board-state.ts
├── schemas/                  # Zod schemas
│   └── ...
├── pages/
│   ├── board/
│   │   └── [...params].tsx   # Dynamic board routes
│   └── ...
├── components/
│   ├── board/
│   │   ├── BoardScreen.tsx
│   │   ├── ArrivalRow.tsx
│   │   └── ...
│   └── ui/
│       └── ...
├── hooks/
│   └── useBoardData.ts
├── config/
│   └── board-configs.ts
└── lib/
    └── api.ts
```

---

## Data Sources (DATA.GOV.HK)

| Operator | API Endpoint               |
| -------- | -------------------------- |
| MTR      | Train service status & ETA |
| KMB      | Bus ETA API                |
| Citybus  | Bus ETA API                |
| Ferry    | Ferry schedule API         |

---

## Unit Test Plan

UI component tests are out of scope. Focus is on logic and utility functions only.

### Test Infrastructure

- **Test runner:** Vitest (already installed, `npm run test`)
- **No additional setup needed** — no jsdom, no `@testing-library`
- Test files co-located with source: `src/**/*.test.ts`

### Files to Test

#### 1. `src/lib/api.ts` — `formatETA()` & `formatCountdown()`

Pure time-diff formatters. Clear branching logic, zero dependencies.

| Case                     | `formatETA` expected |
| ------------------------ | -------------------- |
| `null`                   | `"--"`               |
| ETA in the past / ≤0 min | `"Arr"`              |
| ETA in exactly 1 min     | `"1 min"`            |
| ETA in N mins            | `"N mins"`           |

Same matrix for `formatCountdown()` (returns `"MM:SS"`).

---

#### 2. `src/adapters/mtr.ts` — Helper Functions

Three private helpers and the main transform. Will need to export them or test via `mapToBoardState()`.

| Function            | Cases                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `parseHktTime()`    | Valid HKT string → Date; invalid string → null                                                                                     |
| `toApiDirection()`  | `"up"` / `"down"` → correct API string; unknown → fallback                                                                         |
| `deriveStatus()`    | All possible API status codes → `ArrivalStatus` enum values                                                                        |
| `mapToBoardState()` | Valid raw API fixture → correct `BoardState` shape; empty arrivals array; platform/crowding fields present when capability enabled |

---

#### 3. `src/adapters/index.ts` — Adapter Registry

| Function                         | Cases                            |
| -------------------------------- | -------------------------------- |
| `getAdapter("mtr")`              | Returns the MTR adapter instance |
| `getAdapter("unknown")`          | Returns `undefined` or throws    |
| `isOperatorSupported("mtr")`     | `true`                           |
| `isOperatorSupported("unknown")` | `false`                          |
| `getSupportedOperators()`        | Array contains `"mtr"`           |

---

#### 4. `src/utils/localization.ts`

| Function                                            | Cases                          |
| --------------------------------------------------- | ------------------------------ |
| `getLocalizedName(obj, "en")`                       | Returns `name` field           |
| `getLocalizedName(obj, "zh")`                       | Returns `nameZh` field         |
| `getLocalizedName(obj, "zh")` when `nameZh` missing | Falls back to `name`           |
| `formatLocalizedTime(date, "en")`                   | Returns en-US formatted string |
| `formatLocalizedTime(date, "zh")`                   | Returns zh-HK formatted string |

---

#### 5. `src/config/board-configs.ts` — `getBoardConfigFromParams()`

| Case                                                            |
| --------------------------------------------------------------- |
| Known operator/service/stop/direction → returns matching config |
| Unknown combination → returns a default layout config           |
| `getBoardConfig(id)` with valid id → found                      |
| `getBoardConfig(id)` with invalid id → `undefined`              |

---

#### 6. `src/hooks/useBoardData.ts` — `filterByMaxEta()`

Pure array filter (60-min window). No React context needed if extracted and exported.

| Case                                                                  |
| --------------------------------------------------------------------- |
| Empty array → `[]`                                                    |
| All arrivals within 60 min → all returned                             |
| Arrivals beyond 60 min → filtered out                                 |
| Arrivals with `null` ETA → filtered out (or kept, depending on logic) |

---

#### 7. `src/data/mtr.ts` — Data Helpers _(partially covered)_

Extend existing `scripts/generate-mtr-data.test.ts` or add `src/data/mtr.test.ts`:

| Function                                    | Cases                                        |
| ------------------------------------------- | -------------------------------------------- |
| `getMtrLineDirections("EAL")`               | Returns both directions including LMC branch |
| `getMtrStationInfo("TWL", "CEN")`           | Returns correct station name EN + ZH         |
| `getMtrStationInfo("TWL", "NONEXISTENT")`   | Returns `undefined`                          |
| `getDirectionLabel` / `getDirectionLabelZh` | Already covered — verify completeness        |

---

### Suggested File Layout

```
src/
  lib/
    api.test.ts              # formatETA, formatCountdown
  adapters/
    mtr.test.ts              # parseHktTime, toApiDirection, deriveStatus, mapToBoardState
    index.test.ts            # getAdapter, isOperatorSupported, getSupportedOperators
  utils/
    localization.test.ts     # getLocalizedName, formatLocalizedTime
  config/
    board-configs.test.ts    # getBoardConfig, getBoardConfigFromParams
  hooks/
    useBoardData.test.ts     # filterByMaxEta (pure helper only)
  data/
    mtr.test.ts              # getMtrStationInfo, getMtrLineDirections
```

### Implementation Notes

1. **Export private helpers** — `parseHktTime`, `toApiDirection`, `deriveStatus` in `mtr.ts` and `filterByMaxEta` in `useBoardData.ts` are currently unexported. Either export them (preferred) or test indirectly through `mapToBoardState` / hook output.
2. **No mocking needed** for most tests — all target functions are pure or use static data.
3. **`mapToBoardState()` tests** will need fixture JSON matching the MTR API Zod schema shape.
4. **`formatLocalizedTime()`** uses `Date` — pass a fixed `new Date("2026-01-01T12:00:00+08:00")` to avoid flakiness.
5. **`apiFetch()`** in `api.ts` wraps `fetch` — skip or mock with `vi.stubGlobal("fetch", ...)` if testing it; `formatETA`/`formatCountdown` are independently testable without touching fetch.
