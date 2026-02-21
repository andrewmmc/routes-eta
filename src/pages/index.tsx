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
            className="underline hover:text-gray-700"
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

  // Read state directly from URL params
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

  // Update URL params
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

      // Always include operator in URL
      query.operator = newOperator;

      if (newLine) query.line = newLine;
      if (newDirection) query.direction = newDirection;
      if (newStation) query.station = newStation;

      router.replace({ pathname: "/", query }, undefined, { shallow: true });
    },
    [router, selectedOperator, selectedLine, selectedDirection, selectedStation]
  );

  function handleOperatorChange(operator: OperatorId) {
    // Don't do anything if clicking the same operator
    if (operator === selectedOperator) return;

    // Reset all selections when changing operator
    updateUrlParams({
      operator,
      line: "",
      direction: "",
      station: "",
    });
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
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-1" />
            <h1 className="flex-[2] cursor-pointer text-center text-3xl font-bold hover:text-blue-600">
              <Link href="/">{t("home.title")}</Link>
            </h1>
            <div className="flex flex-1 justify-end">
              <LanguageSelector />
            </div>
          </div>
          <p className="mb-8 text-center text-gray-600">{t("home.subtitle")}</p>

          {/* Board Selector */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">
              {t("home.selectBoard")}
            </h2>

            {/* Operator Tabs */}
            <OperatorTabs
              selectedOperator={selectedOperator}
              onOperatorChange={handleOperatorChange}
            />

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
                    <p className="text-gray-500">
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
              className="w-full rounded-md px-4 py-2 text-sm font-medium text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {t("home.viewBoard")}
            </button>

            {boardUrl && (
              <p className="mt-3 text-xs text-gray-400">
                URL:{" "}
                <code className="rounded bg-gray-100 px-1">{boardUrl}</code>
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            <Disclaimer />
          </p>

          {/* GitHub Link */}
          <p className="mt-3 text-center text-xs text-gray-500">
            <a
              href="https://github.com/andrewmmc/routes-eta"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
