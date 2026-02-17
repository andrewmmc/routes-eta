/**
 * Custom App Component
 *
 * TODO: Add global providers (theme, context, etc.)
 * TODO: Add analytics
 * TODO: Add error boundary
 */

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
