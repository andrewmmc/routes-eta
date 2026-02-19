import { Language } from '@/contexts/LanguageContext';

interface LocalizableObject {
  name: string;
  nameZh?: string;
}

/**
 * Get the localized name from an object with name and nameZh properties
 */
export function getLocalizedName(obj: LocalizableObject, lang: Language): string {
  if (lang === 'zh' && obj.nameZh) {
    return obj.nameZh;
  }
  return obj.name;
}

/**
 * Format a date/time string in the appropriate locale
 */
export function formatLocalizedTime(date: Date, lang: Language): string {
  const locale = lang === 'zh' ? 'zh-HK' : 'en-US';

  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
