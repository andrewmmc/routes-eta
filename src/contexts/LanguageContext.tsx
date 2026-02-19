import React, { createContext, useContext, useState, ReactNode } from "react";
import { DEFAULT_LANGUAGE } from "@/types/language";
import type { Language } from "@/types/language";

export { type Language } from "@/types/language";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "preferred-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "zh") {
    return stored;
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Save language to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
}
