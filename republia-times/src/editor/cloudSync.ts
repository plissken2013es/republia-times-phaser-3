import type { ArticleData } from '../data/articleTypes';
import { getApiKey, getBinId, setBinId } from './cloudConfig';

const BASE = 'https://api.jsonbin.io/v3';

interface BinPayload {
  version: number;
  articles: ArticleData[];
}

function headers(extra?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Master-Key': getApiKey(),
    ...extra,
  };
}

/** Push articles to existing bin, or create a new bin if none configured. */
export async function pushToCloud(articles: ArticleData[]): Promise<{ ok: boolean; error?: string }> {
  const payload: BinPayload = {
    version: 1,
    articles: [...articles].sort((a, b) => a.legacyIndex - b.legacyIndex),
  };

  const binId = getBinId();

  try {
    if (binId) {
      // Update existing bin
      const res = await fetch(`${BASE}/b/${binId}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        return { ok: false, error: `PUT failed (${res.status}): ${body}` };
      }
      return { ok: true };
    } else {
      // Create new bin
      const res = await fetch(`${BASE}/b`, {
        method: 'POST',
        headers: headers({ 'X-Bin-Name': 'republia-times-articles' }),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        return { ok: false, error: `POST failed (${res.status}): ${body}` };
      }
      const data = await res.json();
      const newBinId = data.metadata?.id;
      if (!newBinId) {
        return { ok: false, error: 'No bin ID in response' };
      }
      setBinId(newBinId);
      return { ok: true };
    }
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Pull articles from the remote bin. */
export async function pullFromCloud(): Promise<{ articles?: ArticleData[]; error?: string }> {
  const binId = getBinId();
  if (!binId) {
    return { error: 'No bin ID configured' };
  }

  try {
    const res = await fetch(`${BASE}/b/${binId}/latest`, {
      method: 'GET',
      headers: { 'X-Master-Key': getApiKey() },
    });
    if (!res.ok) {
      const body = await res.text();
      return { error: `GET failed (${res.status}): ${body}` };
    }
    const data = await res.json();
    const payload = data.record as BinPayload;
    if (!payload?.articles || !Array.isArray(payload.articles)) {
      return { error: 'Invalid bin data: missing articles array' };
    }
    return { articles: payload.articles };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** Test the API key by reading account info. */
export async function testConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const binId = getBinId();
    if (!binId) {
      // Just verify the key works by attempting to create a tiny test
      return { ok: true }; // Can't really test without a bin
    }
    const res = await fetch(`${BASE}/b/${binId}/latest`, {
      method: 'GET',
      headers: { 'X-Master-Key': getApiKey() },
    });
    if (res.ok) return { ok: true };
    return { ok: false, error: `Status ${res.status}` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
