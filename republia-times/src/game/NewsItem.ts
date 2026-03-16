import { getNewsEntry } from '../data/buildNewsLocale';
import type { NewsEntry } from '../locale/en';
import { GameState } from './GameState';
import { Goal } from './Goal';
import { ArticleCategory } from '../data/articleTypes';
import { articleDatabase } from '../data/articleDatabase';

export enum ArticleSize {
  S = 0,
  M = 1,
  B = 2,
}

export class NewsItem {
  public static readonly LOYALTY_UP = 1;
  public static readonly LOYALTY_DOWN = -1;
  public static readonly LOYALTY_NONE = 0;

  public dayRangeStart: number;
  public dayRangeEnd: number;
  public loyaltyEffect: number;
  public interesting: boolean;
  public appearTime = 0;
  public used = false;
  public readonly category: ArticleCategory;

  /** Index into the locale news_N entries (legacy, for save compat) */
  public readonly index: number;

  public constructor(
    index: number,
    dayRangeStart: number,
    dayRangeEnd: number,
    loyaltyEffect: number,
    interesting: boolean,
    category: ArticleCategory,
  ) {
    this.index = index;
    this.dayRangeStart = dayRangeStart;
    this.dayRangeEnd = dayRangeEnd;
    this.loyaltyEffect = loyaltyEffect;
    this.interesting = interesting;
    this.category = category;
  }

  private getNewsEntry(): NewsEntry {
    return getNewsEntry(this.index);
  }

  public isWeather(): boolean {
    return this.category === ArticleCategory.Weather;
  }

  public isRebelLeader(): boolean {
    return this.getNewsEntry()[0].includes('***');
  }

  public hasArticleText(): boolean {
    return this.getNewsEntry()[1] !== null;
  }

  public getBlurbText(): string {
    return this.getProcessedText(this.getNewsEntry()[0]);
  }

  public getArticleText(): string {
    const entry = this.getNewsEntry();
    return entry[1] ? this.getProcessedText(entry[1]) : '';
  }

  public static resetAllNewsItems(): void {
    for (const newsItem of NewsItem.allNewsItems) {
      newsItem.used = false;
    }
  }

  private getProcessedText(str: string): string {
    if (str.includes('|')) {
      const tokens = str.split('|');
      const goalStatus = Goal.getCurGoalStatus();
      str = tokens[goalStatus - 1] ?? tokens[0];
    }
    return GameState.expandGovNames(str);
  }

  /** Initialise allNewsItems from the article database. Call once at startup. */
  public static initAllNewsItems(): void {
    const items: NewsItem[] = [];
    for (const article of articleDatabase) {
      items.push(
        new NewsItem(
          article.legacyIndex,
          article.dayRangeStart,
          article.dayRangeEnd,
          article.loyaltyEffect,
          article.interesting,
          article.category,
        ),
      );
    }
    (NewsItem as { allNewsItems: NewsItem[] }).allNewsItems = items;
  }

  // Initialised from database at startup via initAllNewsItems()
  public static readonly allNewsItems: NewsItem[] = [];
}

// Auto-init from database so static consumers always have data
NewsItem.initAllNewsItems();
