/**
 * Custom App Component
 *
 * TODO: Add analytics
 * TODO: Add error boundary
 */

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import {
  LanguageProvider,
  useLanguageContext,
} from "@/contexts/LanguageContext";
import { useEffect } from "react";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";

function AppContent({ Component, pageProps }: AppProps) {
  const { language } = useLanguageContext();
  const messages =
    pageProps.messages ?? (language === "en" ? enMessages : zhMessages);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    const htmlLang = language === "zh" ? "zh-HK" : "en";
    document.documentElement.lang = htmlLang;
  }, [language]);

  return (
    <NextIntlClientProvider
      locale={language}
      messages={messages}
      timeZone="Asia/Hong_Kong"
    >
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <LanguageProvider>
      <AppContent {...props} />
    </LanguageProvider>
  );
}
