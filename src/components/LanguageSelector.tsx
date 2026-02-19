import { useTranslation } from "@/hooks/useTranslation";

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      aria-label="Toggle language"
    >
      {language === "en" ? "中文" : "EN"}
    </button>
  );
}
