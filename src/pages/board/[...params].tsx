/**
 * Board Page - Dynamic Route
 *
 * Renders the board screen based on URL params
 *
 * URL Pattern: /board/:operatorId/:serviceId/:stationId/:direction?
 *
 * Examples:
 *   /board/mtr/tsuen-wan-line/central/up
 *   /board/kmb/960/wan-chai
 *
 * TODO: Add proper error handling for invalid params
 * TODO: Add static generation for common routes
 * TODO: Add SEO metadata
 */

import { useRouter } from "next/router";
import Head from "next/head";
import { BoardScreen, MTRBoard } from "../../components/board";
import { useBoardData } from "../../hooks";
import { LoadingBoard } from "../../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../../components/ui/ErrorDisplay";
import { getBoardConfigFromParams } from "../../config";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName, formatLocalizedTime } from "@/utils/localization";

export default function BoardPage() {
  const router = useRouter();
  const params = router.query.params as string[] | undefined;
  const { t, language } = useTranslation();

  // Parse URL params with empty-string fallbacks so hooks are always called
  // TODO: Add proper validation
  const [operatorId = "", serviceId = "", stopId = "", directionId] =
    params ?? [];

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

  if (!operatorId || !serviceId || !stopId) {
    return (
      <ErrorDisplay message={t('errors.invalidUrl')} />
    );
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

  // Render board - use MTR skin for MTR operator
  const isMTR = operatorId === "mtr";

  // Format last updated for page title
  const lastUpdatedStr = formatLocalizedTime(data.lastUpdated, language);

  const stationName = getLocalizedName(data.station, language);
  const serviceName = getLocalizedName(data.service, language);
  const updateLabel = t('board.lastUpdated');

  const pageTitle = `${stationName} | ${serviceName} | ${updateLabel}: ${lastUpdatedStr}`;

  if (isMTR) {
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
        <BoardScreen boardState={data} layout={config.layout} />
      </div>
    </>
  );
}

/**
 * Get server-side props
 *
 * TODO: Implement for SSR/SSG
 * TODO: Add proper param validation
 */
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { params } = context;
//
//   // Validate params
//   // Fetch initial data
//   // Return props
// }
