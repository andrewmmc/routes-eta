import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  ReactNode,
} from "react";
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
const languageListeners = new Set<() => void>();

function getLanguageSnapshot(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "zh" ? stored : DEFAULT_LANGUAGE;
}

function subscribeToLanguage(onStoreChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };

  languageListeners.add(onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    languageListeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    () => DEFAULT_LANGUAGE
  );

  // Save language to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem(STORAGE_KEY, newLanguage);
    languageListeners.forEach((listener) => listener());
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
