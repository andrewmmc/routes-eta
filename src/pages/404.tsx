/**
 * Custom 404 Page
 *
 * GitHub Pages serves this for any path without a matching static file.
 * Since dynamic routes (e.g. /board/[...params]) can't be pre-rendered for
 * every possible URL, we use the Next.js client-side router to resolve the
 * actual URL path to the correct page component.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingBoard } from "@/components/ui/LoadingSpinner";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const { pathname, search, hash } = window.location;
    // Replace the current (404) route with the actual URL so Next.js
    // client-side router can match it to the correct page.
    router.replace(pathname + search + hash);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <LoadingBoard />;
}
