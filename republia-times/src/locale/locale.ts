import { en } from './en';
import type { LocaleStrings } from './en';
import { es } from './es';

const LANG_KEY = 'republiatimes-lang';
let active: LocaleStrings = en;

export function setLanguage(lang: 'en' | 'es'): void {
  active = lang === 'es' ? es : en;
  localStorage.setItem(LANG_KEY, lang);
}

export function getLanguage(): 'en' | 'es' {
  return active === es ? 'es' : 'en';
}

export function loadLanguagePreference(): void {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'es') active = es;
}

/** All game code reads strings via S() */
export function S(): LocaleStrings {
  return active;
}
