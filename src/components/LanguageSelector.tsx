import { useTranslation } from "@/hooks/useTranslation";

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="border border-transit-border-strong px-3 py-1.5 text-sm font-code text-transit-muted tracking-wider uppercase hover:border-transit-accent hover:text-transit-accent transition-colors duration-150 cursor-pointer"
      aria-label="Toggle language"
    >
      {language === "en" ? "中文" : "EN"}
    </button>
  );
}
