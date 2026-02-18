# Routes ETA

Hong Kong transport arrival display UI (MTR station screen style) with an extensible architecture that supports multiple transport operators through an adapter pattern.

## Tech Stack

- **Framework**: Next.js (Page Router) + TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Schema Validation**: Zod
- **Data Source**: DATA.GOV.HK APIs

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### Sample Boards

- `/board/mtr/TWL/CEN/down` - MTR Tsuen Wan Line to Central
- `/board/mtr/ISL/CHW/up` - MTR Island Line to Chai Wan

### URL Pattern

```
/board/{operatorId}/{serviceId}/{stationId}/{direction?}
```

## Architecture

```
External API → Adapter → BoardState (unified model) → UI Components
```

The UI does not directly consume external API data. Each transport operator has an adapter that:
1. Fetches raw data from the API
2. Transforms it to the unified `BoardState` model
3. Declares supported capabilities (platform, crowding, etc.)

This allows adding new operators without modifying UI components.

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npm run format:check  # Check formatting
npm run test          # Run tests
npm run generate:mtr  # Regenerate MTR data from CSV
```

## MTR Data Generation

MTR line and station data is generated from `src/data/mtr_lines_and_stations.csv` using the `scripts/generate-mtr-data.ts` script.

### Branch Line Handling

The script handles MTR lines with branches by merging branch directions into their parent line:

- **East Rail Line (EAL)**: Lok Ma Chau branch (LMC-DT/LMC-UT) is merged into main EAL directions. Lo Wu and Lok Ma Chau are displayed as alternative termini (e.g., "Admiralty → Lok Ma Chau/Lo Wu").

- **Tseung Kwan O Line (TKL)**: LOHAS Park branch (TKS-DT/TKS-UT) is merged into main TKL directions. Po Lam and LOHAS Park are displayed as alternative termini (e.g., "North Point → LOHAS Park/Po Lam").

Direction labels show all alternative termini with "/" separator when a line has multiple branches.

### Regenerating Data

If you modify the CSV or the generation script:

```bash
npm run generate:mtr
```

## Status

- MTR adapter: dummy implementation (needs real API integration)
- KMB, Citybus, Ferry: to be added later

## License

MIT
