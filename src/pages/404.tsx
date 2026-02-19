/**
 * Custom 404 Page
 *
 * GitHub Pages serves 404.html for any path it cannot resolve to a static file.
 * Dynamic catch-all routes (e.g. /board/[...params]) are not pre-rendered for
 * every possible URL, so direct navigation or page refresh on those routes hits
 * this page. We detect board-route URLs and render the board page component so
 * Next.js client-side routing can take over.
 */

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import BoardPage from "./board/[...params]";

/**
 * Detect whether the current URL is a board route on first render.
 * Uses useSyncExternalStore to read window.location synchronously
 * (avoiding setState inside useEffect).
 */
function useIsBoardRoute(): boolean {
  return useSyncExternalStore(
    // subscribe — location doesn't change for our purposes
    () => () => {},
    // getSnapshot — client
    () => window.location.pathname.startsWith("/board/"),
    // getServerSnapshot — SSR/static always false
    () => false
  );
}

export default function Custom404() {
  const router = useRouter();
  const isBoardRoute = useIsBoardRoute();

  useEffect(() => {
    if (!isBoardRoute) return;
    const { pathname } = window.location;
    // Rewrite the Next.js router state so the board page can read its params
    // from router.query, then render the board component in place.
    const segments = pathname.replace(/\/$/, "").split("/").slice(2); // strip leading /board/
    router.replace(
      { pathname: "/board/[...params]", query: { params: segments } },
      pathname,
      { shallow: true }
    );
  }, [isBoardRoute]); // eslint-disable-line react-hooks/exhaustive-deps

  // Matched a board route — render the board page
  if (isBoardRoute) {
    return <BoardPage />;
  }

  // Genuine 404
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="mt-4 text-gray-600">Page not found</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
