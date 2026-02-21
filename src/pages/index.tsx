/**
 * Home Page
 *
 * Landing page with transport operator tabs and selectors
 */

import { useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  OperatorTabs,
  MTRSelector,
  getMtrButtonColor,
} from "@/components/home";
import { DEFAULT_OPERATOR, type OperatorId } from "@/models/operator";

function Disclaimer() {
  const { t } = useTranslation();

  return (
    <>
      {t.rich("home.disclaimer", {
        link: (chunks) => (
          <a
            href="https://data.gov.hk"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            {chunks}
          </a>
        ),
      })}
    </>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const selectedOperator =
    (router.query.operator as OperatorId) || DEFAULT_OPERATOR;
  const selectedLine = (router.query.line as string) || "";
  const selectedDirection = (router.query.direction as string) || "";
  const selectedStation = (router.query.station as string) || "";

  const { canNavigate, boardUrl, buttonColor } = (() => {
    switch (selectedOperator) {
      case "mtr":
        return {
          canNavigate: !!(selectedLine && selectedDirection && selectedStation),
          boardUrl:
            selectedLine && selectedDirection && selectedStation
              ? `/board/mtr/${selectedLine}/${selectedStation}/${selectedDirection}`
              : null,
          buttonColor: getMtrButtonColor(selectedLine),
        };
      default:
        return { canNavigate: false, boardUrl: null, buttonColor: undefined };
    }
  })();

  const updateUrlParams = useCallback(
    (params: {
      operator?: OperatorId;
      line?: string;
      direction?: string;
      station?: string;
    }) => {
      const query: Record<string, string> = {};
      const newOperator =
        params.operator !== undefined ? params.operator : selectedOperator;
      const newLine = params.line !== undefined ? params.line : selectedLine;
      const newDirection =
        params.direction !== undefined ? params.direction : selectedDirection;
      const newStation =
        params.station !== undefined ? params.station : selectedStation;

      query.operator = newOperator;
      if (newLine) query.line = newLine;
      if (newDirection) query.direction = newDirection;
      if (newStation) query.station = newStation;

      router.replace({ pathname: "/", query }, undefined, { shallow: true });
    },
    [router, selectedOperator, selectedLine, selectedDirection, selectedStation]
  );

  function handleOperatorChange(operator: OperatorId) {
    if (operator === selectedOperator) return;
    updateUrlParams({ operator, line: "", direction: "", station: "" });
  }

  function handleLineChange(lineCode: string) {
    updateUrlParams({ line: lineCode, direction: "", station: "" });
  }

  function handleDirectionChange(dir: string, resetStation: boolean = true) {
    updateUrlParams({ direction: dir, station: resetStation ? "" : undefined });
  }

  function handleStationChange(stationCode: string) {
    updateUrlParams({ station: stationCode });
  }

  function handleGo() {
    if (boardUrl) router.push(boardUrl);
  }

  return (
    <>
      <Head>
        <title>{t("home.title")}</title>
      </Head>

      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md px-4 py-10 flex flex-col min-h-screen">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 border-2 border-transit-accent flex items-center justify-center shrink-0">
                <span className="text-[9px] font-code font-bold text-transit-accent leading-none">
                  HK
                </span>
              </div>
              <span className="text-sm font-code text-transit-muted tracking-widest uppercase">
                Transit ETA
              </span>
            </div>
            <LanguageSelector />
          </div>

          {/* Hero heading */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-semibold tracking-wide text-foreground uppercase leading-tight mb-1.5">
              <Link
                href="/"
                className="hover:text-transit-accent transition-colors"
              >
                {t("home.title")}
              </Link>
            </h1>
            <p className="text-sm font-code text-transit-muted tracking-wide">
              {t("home.subtitle")}
            </p>
          </div>

          {/* Selector card */}
          <div className="bg-transit-surface border border-transit-border">
            {/* Accent top bar — uses line color when selected, else accent red */}
            <div
              className="h-[3px] w-full transition-colors duration-300"
              style={{
                backgroundColor: buttonColor ?? "var(--transit-accent)",
              }}
            />

            {/* Operator Tabs */}
            <OperatorTabs
              selectedOperator={selectedOperator}
              onOperatorChange={handleOperatorChange}
            />

            <div className="p-5 pb-6">
              {/* Operator Selector */}
              {(() => {
                switch (selectedOperator) {
                  case "mtr":
                    return (
                      <MTRSelector
                        selectedLine={selectedLine}
                        selectedDirection={selectedDirection}
                        selectedStation={selectedStation}
                        onLineChange={handleLineChange}
                        onDirectionChange={handleDirectionChange}
                        onStationChange={handleStationChange}
                      />
                    );
                  default:
                    return (
                      <p className="mb-6 text-sm font-code text-transit-muted">
                        Operator &quot;{selectedOperator}&quot; is not yet
                        implemented.
                      </p>
                    );
                }
              })()}

              {/* Go button */}
              <button
                onClick={handleGo}
                disabled={!canNavigate}
                style={
                  canNavigate && buttonColor
                    ? { backgroundColor: buttonColor }
                    : undefined
                }
                className="w-full py-3 text-sm font-heading font-medium tracking-widest uppercase text-white transition-all duration-150 hover:brightness-110 active:brightness-90 disabled:cursor-not-allowed disabled:bg-transit-border disabled:text-transit-muted"
              >
                {t("home.viewBoard")}
              </button>

              {boardUrl && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-code text-transit-muted">
                  <span
                    className="transition-colors duration-300"
                    style={{
                      color: buttonColor ?? "var(--transit-accent)",
                    }}
                  >
                    ▶
                  </span>
                  <code
                    className="transition-colors duration-300"
                    style={{
                      color: buttonColor ?? "var(--transit-accent)",
                    }}
                  >
                    {boardUrl}
                  </code>
                </p>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-transit-border space-y-2">
            <p className="text-xs font-code text-transit-muted leading-relaxed">
              <Disclaimer />
            </p>
            <p className="text-xs font-code text-transit-muted text-center pt-1">
              <a
                href="https://github.com/andrewmmc/routes-eta"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
