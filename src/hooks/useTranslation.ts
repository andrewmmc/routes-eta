import { useLanguageContext, Language } from '@/contexts/LanguageContext';
import { translations, TranslationKey } from '@/i18n/translations';

export function useTranslation() {
  const { language, setLanguage } = useLanguageContext();

  const t = (key: TranslationKey): string => {
    const keys = key.split('.') as [keyof typeof translations, string];
    const namespace = translations[keys[0]];

    if (!namespace) {
      console.warn(`Translation namespace not found: ${keys[0]}`);
      return key;
    }

    const translation = namespace[keys[1] as keyof typeof namespace];

    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    return translation[language] || translation.en;
  };

  return {
    t,
    language,
    setLanguage,
  };
}
