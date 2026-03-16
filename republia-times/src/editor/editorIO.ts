import { ArticleCategory, ArticleData, LoyaltyEffect } from '../data/articleTypes';

interface ExportSchema {
  version: number;
  articles: ArticleData[];
}

export function exportJSON(articles: ArticleData[]): void {
  const data: ExportSchema = {
    version: 1,
    articles: [...articles].sort((a, b) => a.legacyIndex - b.legacyIndex),
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `articles-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<{ articles: ArticleData[]; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as ExportSchema;
        if (!data.version || !Array.isArray(data.articles)) {
          resolve({ articles: [], error: 'Invalid schema: missing version or articles array' });
          return;
        }
        // Basic validation
        for (const a of data.articles) {
          if (typeof a.id !== 'string' || typeof a.legacyIndex !== 'number') {
            resolve({ articles: [], error: `Invalid article: ${JSON.stringify(a).slice(0, 80)}` });
            return;
          }
        }
        resolve({ articles: data.articles });
      } catch (e) {
        resolve({ articles: [], error: `JSON parse error: ${(e as Error).message}` });
      }
    };
    reader.readAsText(file);
  });
}

const CATEGORY_ORDER: ArticleCategory[] = [
  ArticleCategory.Plot,
  ArticleCategory.Military,
  ArticleCategory.War,
  ArticleCategory.Politics,
  ArticleCategory.Weather,
  ArticleCategory.Sports,
  ArticleCategory.Entertainment,
];

function loyaltyToString(effect: LoyaltyEffect): string {
  switch (effect) {
    case LoyaltyEffect.Up: return 'LoyaltyEffect.Up';
    case LoyaltyEffect.Down: return 'LoyaltyEffect.Down';
    case LoyaltyEffect.None: return 'LoyaltyEffect.None';
  }
}

function categoryToString(cat: ArticleCategory): string {
  return `ArticleCategory.${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
}

function escapeTS(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function textField(val: string | null): string {
  if (val === null) return 'null';
  return `'${escapeTS(val)}'`;
}

export function generateTS(articles: ArticleData[]): string {
  const sorted = [...articles].sort((a, b) => a.legacyIndex - b.legacyIndex);

  const lines: string[] = [];
  lines.push('// Canonical article database — single source of truth for all news items.');
  lines.push('// Metadata + EN/ES text inline. legacyIndex preserves save compatibility.');
  lines.push('');
  lines.push("import { ArticleCategory, ArticleData, LoyaltyEffect } from './articleTypes';");
  lines.push('');
  lines.push('export const articleDatabase: readonly ArticleData[] = [');

  let currentCategory: ArticleCategory | null = null;

  for (const a of sorted) {
    if (a.category !== currentCategory) {
      currentCategory = a.category;
      const catIdx = CATEGORY_ORDER.indexOf(a.category);
      const label = a.category.charAt(0).toUpperCase() + a.category.slice(1);
      if (catIdx > 0) lines.push('');
      lines.push(`  // ── ${label} ──`);
    }

    lines.push('  {');
    lines.push(`    id: '${escapeTS(a.id)}',`);
    lines.push(`    legacyIndex: ${a.legacyIndex},`);
    lines.push(`    category: ${categoryToString(a.category)},`);
    lines.push(`    dayRangeStart: ${a.dayRangeStart}, dayRangeEnd: ${a.dayRangeEnd},`);
    lines.push(`    loyaltyEffect: ${loyaltyToString(a.loyaltyEffect)},`);
    lines.push(`    interesting: ${a.interesting},`);
    lines.push('    text: {');
    lines.push(`      en: { blurb: ${textField(a.text.en.blurb)}, headline: ${textField(a.text.en.headline)} },`);
    lines.push(`      es: { blurb: ${textField(a.text.es.blurb)}, headline: ${textField(a.text.es.headline)} },`);
    lines.push('    },');
    lines.push('  },');
  }

  lines.push('];');
  lines.push('');
  return lines.join('\n');
}
