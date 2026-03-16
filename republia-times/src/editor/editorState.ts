import { articleDatabase } from '../data/articleDatabase';
import { ArticleCategory, ArticleData, LoyaltyEffect } from '../data/articleTypes';

export type Listener = () => void;

export class EditorState {
  public articles: ArticleData[];
  public selectedIndex: number | null = null;
  public searchQuery = '';
  public categoryFilter: ArticleCategory | null = null;
  public dirty = false;

  private listeners: Listener[] = [];

  public constructor() {
    // Deep clone the database so edits don't mutate the imported constant
    this.articles = JSON.parse(JSON.stringify(articleDatabase)) as ArticleData[];
  }

  public onChange(listener: Listener): void {
    this.listeners.push(listener);
  }

  public notify(): void {
    for (const fn of this.listeners) fn();
  }

  public getFilteredArticles(): ArticleData[] {
    let result = this.articles;

    if (this.categoryFilter) {
      result = result.filter((a) => a.category === this.categoryFilter);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.text.en.blurb.toLowerCase().includes(q) ||
          (a.text.en.headline?.toLowerCase().includes(q) ?? false) ||
          a.text.es.blurb.toLowerCase().includes(q) ||
          (a.text.es.headline?.toLowerCase().includes(q) ?? false),
      );
    }

    return result;
  }

  public getSelectedArticle(): ArticleData | null {
    if (this.selectedIndex === null) return null;
    return this.articles.find((a) => a.legacyIndex === this.selectedIndex) ?? null;
  }

  public selectByLegacyIndex(index: number | null): void {
    this.selectedIndex = index;
    this.notify();
  }

  public updateArticle(legacyIndex: number, updates: Partial<ArticleData>): void {
    const idx = this.articles.findIndex((a) => a.legacyIndex === legacyIndex);
    if (idx === -1) return;
    this.articles[idx] = { ...this.articles[idx], ...updates };
    this.dirty = true;
    this.notify();
  }

  public updateArticleText(
    legacyIndex: number,
    lang: 'en' | 'es',
    field: 'blurb' | 'headline',
    value: string | null,
  ): void {
    const idx = this.articles.findIndex((a) => a.legacyIndex === legacyIndex);
    if (idx === -1) return;
    const article = { ...this.articles[idx] };
    article.text = {
      ...article.text,
      [lang]: { ...article.text[lang], [field]: value },
    };
    this.articles[idx] = article;
    this.dirty = true;
    this.notify();
  }

  public addArticle(): ArticleData {
    const maxIndex = this.articles.reduce((max, a) => Math.max(max, a.legacyIndex), -1);
    const newArticle: ArticleData = {
      id: `new-article-${maxIndex + 1}`,
      legacyIndex: maxIndex + 1,
      category: ArticleCategory.War,
      dayRangeStart: 0,
      dayRangeEnd: 0,
      loyaltyEffect: LoyaltyEffect.None,
      interesting: true,
      placeable: true,
      text: {
        en: { blurb: 'New article blurb text', headline: 'New Headline!' },
        es: { blurb: 'Texto del nuevo artículo', headline: 'Nuevo Titular!' },
      },
    };
    this.articles.push(newArticle);
    this.selectedIndex = newArticle.legacyIndex;
    this.dirty = true;
    this.notify();
    return newArticle;
  }

  public deleteArticle(legacyIndex: number): void {
    this.articles = this.articles.filter((a) => a.legacyIndex !== legacyIndex);
    if (this.selectedIndex === legacyIndex) {
      this.selectedIndex = null;
    }
    this.dirty = true;
    this.notify();
  }

  public setSearch(query: string): void {
    this.searchQuery = query;
    this.notify();
  }

  public setCategoryFilter(cat: ArticleCategory | null): void {
    this.categoryFilter = cat;
    this.notify();
  }

  public replaceAll(articles: ArticleData[]): void {
    this.articles = articles;
    this.selectedIndex = null;
    this.dirty = true;
    this.notify();
  }
}
