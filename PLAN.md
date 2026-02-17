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
  hasCrowding: boolean; // MTR: yes
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
