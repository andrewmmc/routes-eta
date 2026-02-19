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
import { useEffect, useState } from "react";
import defaultMessages from "../../messages/zh.json";

function AppContent({ Component, pageProps }: AppProps) {
  const { language } = useLanguageContext();
  const [messages, setMessages] = useState(
    pageProps.messages ?? defaultMessages
  );

  // Update HTML lang attribute when language changes
  useEffect(() => {
    const htmlLang = language === "zh" ? "zh-HK" : "en";
    document.documentElement.lang = htmlLang;
  }, [language]);

  // Load messages for the active language
  useEffect(() => {
    import(`../../messages/${language}.json`).then((mod) => {
      setMessages(mod.default);
    });
  }, [language]);

  return (
    <NextIntlClientProvider locale={language} messages={messages}>
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
