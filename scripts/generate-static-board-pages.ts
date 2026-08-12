/**
 * Materialize every valid MTR board route for static hosts such as GitHub Pages.
 *
 * Next.js exports the catch-all page only at /board/[...params]/. This script
 * copies that shell to each known MTR route and injects its route parameters so
 * direct requests return HTTP 200 without relying on the custom 404 page.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  buildDirections,
  parseCsv,
  type DirectionEntry,
} from "./generate-mtr-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getStaticBoardRoutes(entries: DirectionEntry[]): string[][] {
  const routes = new Map<string, string[]>();

  for (const entry of entries) {
    for (const station of entry.stations) {
      const withoutDirection = ["mtr", entry.lineCode, station.code];
      const withDirection = [...withoutDirection, entry.urlDirection];

      routes.set(withoutDirection.join("/"), withoutDirection);
      routes.set(withDirection.join("/"), withDirection);
    }
  }

  return [...routes.values()].sort((a, b) =>
    a.join("/").localeCompare(b.join("/"))
  );
}

export function injectRouteParams(html: string, params: string[]): string {
  const queryMarker = '"query":{}';
  if (!html.includes(queryMarker)) {
    throw new Error("Dynamic board template is missing an empty Next.js query");
  }

  return html.replace(
    queryMarker,
    `"query":{"params":${JSON.stringify(params)}}`
  );
}

export function generateStaticBoardPages(
  outputDir: string,
  entries: DirectionEntry[]
): number {
  const templatePath = path.join(
    outputDir,
    "board",
    "[...params]",
    "index.html"
  );
  const template = fs.readFileSync(templatePath, "utf8");
  const routes = getStaticBoardRoutes(entries);

  for (const params of routes) {
    const routeDir = path.join(outputDir, "board", ...params);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(
      path.join(routeDir, "index.html"),
      injectRouteParams(template, params)
    );
  }

  return routes.length;
}

function main() {
  const csvPath = path.join(__dirname, "../assets/mtr_lines_and_stations.csv");
  const outputDir = path.join(__dirname, "../out");
  const entries = buildDirections(parseCsv(fs.readFileSync(csvPath, "utf8")));
  const count = generateStaticBoardPages(outputDir, entries);
  console.log(`Generated ${count} static MTR board pages`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main();
}
