/**
 * Custom App Component
 *
 * TODO: Add analytics
 * TODO: Add error boundary
 */

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider, useLanguageContext } from "@/contexts/LanguageContext";
import { useEffect } from "react";

function AppContent({ Component, pageProps }: AppProps) {
  const { language } = useLanguageContext();

  // Update HTML lang attribute when language changes
  useEffect(() => {
    const htmlLang = language === 'zh' ? 'zh-HK' : 'en';
    document.documentElement.lang = htmlLang;
  }, [language]);

  return <Component {...pageProps} />;
}

export default function App(props: AppProps) {
  return (
    <LanguageProvider>
      <AppContent {...props} />
    </LanguageProvider>
  );
}
