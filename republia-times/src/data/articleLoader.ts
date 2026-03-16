// Loads articles from JSONBin.io if configured, otherwise falls back to static database.

import type { ArticleData } from './articleTypes';
import { articleDatabase } from './articleDatabase';

const KEY_API = 'republiatimes-editor-apiKey';
const KEY_BIN = 'republiatimes-editor-binId';
const BASE = 'https://api.jsonbin.io/v3';

/** Try to load articles from JSONBin. Returns static database on any failure. */
export async function loadArticles(): Promise<{ articles: ArticleData[]; source: 'remote' | 'static' }> {
  const apiKey = localStorage.getItem(KEY_API) ?? '';
  const binId = localStorage.getItem(KEY_BIN) ?? '';

  if (!apiKey || !binId) {
    return { articles: [...articleDatabase], source: 'static' };
  }

  try {
    const res = await fetch(`${BASE}/b/${binId}/latest`, {
      method: 'GET',
      headers: { 'X-Master-Key': apiKey },
    });

    if (!res.ok) {
      console.warn(`[ArticleLoader] JSONBin fetch failed (${res.status}), using static database`);
      return { articles: [...articleDatabase], source: 'static' };
    }

    const data = await res.json();
    const payload = data.record;

    if (!payload?.articles || !Array.isArray(payload.articles)) {
      console.warn('[ArticleLoader] Invalid bin data, using static database');
      return { articles: [...articleDatabase], source: 'static' };
    }

    console.log(`[ArticleLoader] Loaded ${payload.articles.length} articles from JSONBin`);
    return { articles: payload.articles as ArticleData[], source: 'remote' };
  } catch (e) {
    console.warn('[ArticleLoader] Network error, using static database:', (e as Error).message);
    return { articles: [...articleDatabase], source: 'static' };
  }
}
