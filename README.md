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
```

## Status

- MTR adapter: dummy implementation (needs real API integration)
- KMB, Citybus, Ferry: to be added later

## License

MIT
