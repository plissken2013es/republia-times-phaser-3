import { S } from '../locale/locale';
import type { NewsEntry } from '../locale/en';
import { GameState } from './GameState';
import { Goal } from './Goal';

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

  /** Index into the locale news_N entries */
  public readonly index: number;

  public constructor(
    index: number,
    dayRangeStart: number,
    dayRangeEnd: number,
    loyaltyEffect: number,
    interesting: boolean,
  ) {
    this.index = index;
    this.dayRangeStart = dayRangeStart;
    this.dayRangeEnd = dayRangeEnd;
    this.loyaltyEffect = loyaltyEffect;
    this.interesting = interesting;
  }

  private getNewsEntry(): NewsEntry {
    const key = `news_${this.index}` as `news_${number}`;
    return S()[key];
  }

  public isWeather(): boolean {
    const entry = this.getNewsEntry();
    return entry[0].includes('Weather:') || entry[0].includes('Clima:');
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

  // All news items — text is now read from locale at runtime via index
  // Constructor: (index, dayRangeStart, dayRangeEnd, loyaltyEffect, interesting)
  public static readonly allNewsItems: NewsItem[] = [
    // plot
    new NewsItem(0, 1, 3, NewsItem.LOYALTY_UP, true),
    new NewsItem(1, 3, -1, NewsItem.LOYALTY_NONE, true),
    new NewsItem(2, 4, -1, NewsItem.LOYALTY_NONE, true),
    new NewsItem(3, 6, -1, NewsItem.LOYALTY_NONE, true),
    new NewsItem(4, 7, -1, NewsItem.LOYALTY_NONE, true),
    new NewsItem(5, 8, -1, NewsItem.LOYALTY_NONE, true),
    new NewsItem(6, 9, -1, NewsItem.LOYALTY_NONE, true),
    new NewsItem(7, 10, -1, NewsItem.LOYALTY_NONE, true),

    // plot (day-ranged military)
    new NewsItem(8, 7, 100, NewsItem.LOYALTY_UP, true),
    new NewsItem(9, 8, 100, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(10, 9, 100, NewsItem.LOYALTY_UP, true),
    new NewsItem(11, 10, 100, NewsItem.LOYALTY_DOWN, true),

    // war (always interesting)
    new NewsItem(12, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(13, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(14, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(15, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(16, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(17, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(18, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(19, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(20, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(21, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(22, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(23, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(24, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(25, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(26, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(27, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(28, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(29, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(30, 0, 0, NewsItem.LOYALTY_DOWN, true),

    // politics (never interesting)
    new NewsItem(31, 0, 0, NewsItem.LOYALTY_UP, false),
    new NewsItem(32, 0, 0, NewsItem.LOYALTY_UP, false),
    new NewsItem(33, 0, 0, NewsItem.LOYALTY_UP, false),
    new NewsItem(34, 0, 0, NewsItem.LOYALTY_UP, false),
    new NewsItem(35, 0, 0, NewsItem.LOYALTY_UP, false),
    new NewsItem(36, 0, 0, NewsItem.LOYALTY_DOWN, false),
    new NewsItem(37, 0, 0, NewsItem.LOYALTY_DOWN, false),
    new NewsItem(38, 0, 0, NewsItem.LOYALTY_DOWN, false),
    new NewsItem(39, 0, 0, NewsItem.LOYALTY_DOWN, false),
    new NewsItem(40, 0, 0, NewsItem.LOYALTY_DOWN, false),

    // weather (no loyalty, always interesting)
    new NewsItem(41, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(42, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(43, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(44, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(45, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(46, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(47, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(48, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(49, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(50, 0, 0, NewsItem.LOYALTY_NONE, true),

    // sports (always interesting)
    new NewsItem(51, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(52, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(53, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(54, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(55, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(56, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(57, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(58, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(59, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(60, 0, 0, NewsItem.LOYALTY_DOWN, true),

    // entertainment (always interesting)
    new NewsItem(61, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(62, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(63, 0, 0, NewsItem.LOYALTY_UP, true),
    new NewsItem(64, 2, -1, NewsItem.LOYALTY_UP, true),
    new NewsItem(65, 3, -1, NewsItem.LOYALTY_UP, true),
    new NewsItem(66, 0, 0, NewsItem.LOYALTY_NONE, true),
    new NewsItem(67, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(68, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(69, 0, 0, NewsItem.LOYALTY_DOWN, true),
    new NewsItem(70, 6, -1, NewsItem.LOYALTY_DOWN, true),
  ];
}
