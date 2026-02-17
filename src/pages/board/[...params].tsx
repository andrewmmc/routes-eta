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

export default function BoardPage() {
  const router = useRouter();
  const params = router.query.params as string[] | undefined;

  // Wait for router to be ready
  if (!router.isReady || !params) {
    return <LoadingBoard />;
  }

  // Parse URL params
  // TODO: Add proper validation
  const [operatorId, serviceId, stopId, directionId] = params;

  if (!operatorId || !serviceId || !stopId) {
    return (
      <ErrorDisplay message="Invalid URL parameters. Format: /board/[operator]/[service]/[station]" />
    );
  }

  // Get board config (or create default)
  const config = getBoardConfigFromParams(
    operatorId,
    serviceId,
    stopId,
    directionId
  );

  // Fetch board data
  const { data, isLoading, isError, error, refresh } = useBoardData({
    operatorId,
    stopId,
    serviceId,
    directionId,
    refreshInterval: 60000, // TODO: Make configurable
  });

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
  const lastUpdatedStr = data.lastUpdated.toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const pageTitle = `${data.station.nameZh || data.station.name} | ${data.service.nameZh || data.service.name} | 更新: ${lastUpdatedStr}`;

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
