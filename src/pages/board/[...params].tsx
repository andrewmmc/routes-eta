/**
 * Board Page - Dynamic Route
 *
 * Renders the board screen based on URL params
 *
 * URL Pattern: /board/:operatorId/:serviceId/:stationId/:direction?
 *
 * Examples:
 *   /board/mtr/TWL/CEN/up
 *   /board/kmb/960/wan-chai
 *
 * Invalid routes are redirected to home page.
 *
 * TODO: Add static generation for common routes
 * TODO: Add SEO metadata
 */

import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { BoardScreen, MTRBoard } from "../../components/board";
import { useBoardData } from "../../hooks";
import { LoadingBoard } from "../../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../../components/ui/ErrorDisplay";
import { getBoardConfigFromParams } from "../../config";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName, formatLocalizedTime } from "@/utils/localization";
import { getAdapter } from "../../adapters";
import { validateMtrRouteParams } from "../../data/mtr";

export default function BoardPage() {
  const router = useRouter();
  const params = router.query.params as string[] | undefined;
  const { t, language } = useTranslation();

  // Parse URL params with empty-string fallbacks so hooks are always called
  const [operatorId = "", serviceId = "", stopId = "", directionId] =
    params ?? [];

  // Validate route params and redirect to home if invalid
  useEffect(() => {
    if (!router.isReady) return;

    // Check required params exist
    if (!operatorId || !serviceId || !stopId || !directionId) {
      router.replace("/");
      return;
    }

    // Validate MTR routes
    if (operatorId === "mtr") {
      const isValid = validateMtrRouteParams(serviceId, stopId, directionId);
      if (!isValid) {
        router.replace("/");
        return;
      }
    }
  }, [router.isReady, router, operatorId, serviceId, stopId, directionId]);

  // Get board config (or create default)
  const config = getBoardConfigFromParams(
    operatorId,
    serviceId,
    stopId,
    directionId
  );

  // Fetch board data — hook must be called unconditionally before any returns.
  // useBoardData skips fetching when operatorId/serviceId/stopId are empty.
  const { data, isLoading, isError, error, refresh } = useBoardData({
    operatorId,
    stopId,
    serviceId,
    directionId,
    refreshInterval: 60000, // TODO: Make configurable
  });

  // Wait for router to be ready
  if (!router.isReady || !params) {
    return <LoadingBoard />;
  }

  // Show loading while validating/redirecting
  if (!operatorId || !serviceId || !stopId || !directionId) {
    return <LoadingBoard />;
  }

  // Loading state
  if (isLoading && !data) {
    return <LoadingBoard />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorDisplay
        message={error?.message || "Failed to load board data"}
        onRetry={refresh}
      />
    );
  }

  // No data state
  if (!data) {
    return <ErrorDisplay message="No data available" onRetry={refresh} />;
  }

  // Render board - use custom UI if adapter supports it
  let useCustomUI = false;
  try {
    const adapter = getAdapter(operatorId as "mtr");
    useCustomUI = adapter.capabilities.hasCustomUI;
  } catch {
    // Unknown operator - fall back to generic UI
  }

  // Format last updated for page title
  const lastUpdatedStr = formatLocalizedTime(data.lastUpdated, language);

  const stationName = getLocalizedName(data.station, language);
  const serviceName = getLocalizedName(data.service, language);
  const updateLabel = t("board.lastUpdated");

  const pageTitle = `${stationName} | ${serviceName} | ${updateLabel}: ${lastUpdatedStr}`;

  if (useCustomUI) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <MTRBoard boardState={data} layout={config.layout} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="mx-auto mb-3 max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            ← {t("nav.backToHome")}
          </Link>
        </div>
        <BoardScreen boardState={data} layout={config.layout} />
      </div>
    </>
  );
}
