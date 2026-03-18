import { en } from './en';
import type { LocaleStrings } from './en';
import { es } from './es';
import { rebuildNewsCache } from '../data/buildNewsLocale';

const LANG_KEY = 'republiatimes-lang';
let active: LocaleStrings = es;

export function setLanguage(lang: 'en' | 'es'): void {
  active = lang === 'es' ? es : en;
  localStorage.setItem(LANG_KEY, lang);
  rebuildNewsCache(lang);
}

export function getLanguage(): 'en' | 'es' {
  return active === es ? 'es' : 'en';
}

export function loadLanguagePreference(): void {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'es') active = es;
  rebuildNewsCache(getLanguage());
}

/** All game code reads strings via S() */
export function S(): LocaleStrings {
  return active;
}
