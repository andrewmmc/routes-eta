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
import { useBoardData } from "../../hooks";
import { ErrorDisplay } from "../../components/ui/ErrorDisplay";
import {
  getBoardConfigFromParams,
  getSkinConfig,
  type SkinId,
} from "../../config";
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

  // Determine skin based on adapter capabilities
  let skinId: SkinId = "default";
  try {
    const adapter = getAdapter(operatorId as "mtr");
    if (adapter.capabilities.hasCustomUI) {
      // TODO: skin <> operator mapping
      skinId = "mtr";
    }
  } catch {
    // Unknown operator - fall back to default skin
  }

  const skinConfig = getSkinConfig(skinId);
  const { Board, LoadingBoard } = skinConfig;

  const loadingProps = {
    layout: config.layout,
  };

  // Wait for router to be ready
  if (!router.isReady || !params) {
    return <LoadingBoard {...loadingProps} />;
  }

  // Show loading while validating/redirecting
  if (!operatorId || !serviceId || !stopId || !directionId) {
    return <LoadingBoard {...loadingProps} />;
  }

  // Loading state
  if (isLoading && !data) {
    return <LoadingBoard {...loadingProps} />;
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

  // Format last updated for page title
  const lastUpdatedStr = formatLocalizedTime(data.lastUpdated, language);

  const stationName = getLocalizedName(data.station, language);
  const serviceName = getLocalizedName(data.service, language);
  const updateLabel = t("board.lastUpdated");

  const pageTitle = `${stationName} | ${serviceName} | ${updateLabel}: ${lastUpdatedStr}`;

  const boardProps = {
    boardState: data,
    layout: config.layout,
    boardParams: {
      line: serviceId,
      station: stopId,
      direction: directionId,
    },
  };

  // Render with skin - MTR skin doesn't need back link wrapper
  if (skinId === "mtr") {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <Board {...boardProps} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto mb-4 max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-code text-transit-muted tracking-wide hover:text-foreground transition-colors"
          >
            ← {t("nav.backToHome")}
          </Link>
        </div>
        <Board {...boardProps} />
      </div>
    </>
  );
}
