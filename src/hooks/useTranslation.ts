/**
 * Thin wrapper that combines next-intl's useTranslations with the app's
 * language switcher context. Keeps the same call-site API as before:
 *
 *   const { t, language, setLanguage } = useTranslation();
 *
 * For rich text (inline React elements), use next-intl's t.rich() directly:
 *
 *   t.rich('home.disclaimer', {
 *     link: (chunks) => <a href="...">{chunks}</a>,
 *   })
 */
import { useTranslations } from "next-intl";
import { useLanguageContext } from "@/contexts/LanguageContext";

export function useTranslation() {
  const t = useTranslations();
  const { language, setLanguage } = useLanguageContext();

  return { t, language, setLanguage };
}
