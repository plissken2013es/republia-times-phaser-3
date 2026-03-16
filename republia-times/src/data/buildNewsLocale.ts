// Runtime bridge: generates news_N locale entries from the article database.

import type { NewsEntry } from '../locale/en';
import type { ArticleData } from './articleTypes';
import { articleDatabase } from './articleDatabase';

type NewsCache = Record<`news_${number}`, NewsEntry>;

let activeArticles: readonly ArticleData[] = articleDatabase;
let cache: NewsCache = {};
let initialized = false;

/** Set the active article source (e.g. from remote). Must call rebuildNewsCache after. */
export function setArticleSource(articles: ArticleData[]): void {
  activeArticles = articles;
}

/** Get the active article source. */
export function getArticleSource(): readonly ArticleData[] {
  return activeArticles;
}

/** Rebuild the news entry cache for the given language. Call on lang change. */
export function rebuildNewsCache(lang: 'en' | 'es' = 'en'): void {
  const entries: NewsCache = {};
  for (const article of activeArticles) {
    const t = article.text[lang];
    entries[`news_${article.legacyIndex}`] = [t.blurb, t.headline];
  }
  cache = entries;
  initialized = true;
}

/** Look up a single news entry by legacy index. */
export function getNewsEntry(index: number): NewsEntry {
  if (!initialized) {
    rebuildNewsCache('en');
  }
  return cache[`news_${index}`];
}
