import enTranslations from './translations/en.json'
import filTranslations from './translations/fil.json'

export type Locale = 'en' | 'fil'

export const locales: Locale[] = ['en', 'fil']
export const defaultLocale: Locale = 'en'

const translations = {
  en: enTranslations,
  fil: filTranslations,
}

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale]
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }
  
  return defaultLocale
}

export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  
  if (locales.includes(firstSegment as Locale)) {
    return '/' + segments.slice(2).join('/')
  }
  
  return pathname
}

export function getLocalizedPathname(pathname: string, locale: Locale): string {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname)
  
  if (locale === defaultLocale) {
    return pathWithoutLocale
  }
  
  return `/${locale}${pathWithoutLocale}`
}

export function getLocaleDisplayName(locale: Locale): string {
  const displayNames: Record<Locale, string> = {
    en: 'English',
    fil: 'Filipino',
  }
  
  return displayNames[locale]
}

export function getLocaleFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: '🇺🇸',
    fil: '🇵🇭',
  }
  
  return flags[locale]
}
