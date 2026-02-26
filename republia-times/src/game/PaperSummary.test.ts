import { describe, expect, it } from 'vitest';

import { ArticleSize, NewsItem } from './NewsItem';
import { PaperSummary } from './PaperSummary';

const makeItem = (loyalty: number, interesting: boolean): NewsItem =>
  new NewsItem(0, 0, loyalty, interesting, 'Test blurb', 'Test article');

describe('PaperSummary', () => {
  it('applies loyalty and interest for a big article', () => {
    const summary = new PaperSummary();
    summary.applyNewsItem(makeItem(NewsItem.LOYALTY_UP, true), ArticleSize.B);

    expect(summary.totalLoyaltyEffect).toBe(6);
    expect(summary.numInterestingArticles).toBe(1);
    expect(summary.articleCoveragePercentage).toBeCloseTo(9 / 19, 3);
  });

  it('applies loyalty and coverage for a small article', () => {
    const summary = new PaperSummary();
    summary.applyNewsItem(makeItem(NewsItem.LOYALTY_DOWN, false), ArticleSize.S);

    expect(summary.totalLoyaltyEffect).toBe(-1);
    expect(summary.numInterestingArticles).toBe(0);
    expect(summary.articleCoveragePercentage).toBeCloseTo(2 / 19, 3);
  });

  it('accumulates multiple articles', () => {
    const summary = new PaperSummary();
    summary.applyNewsItem(makeItem(NewsItem.LOYALTY_UP, true), ArticleSize.M);
    summary.applyNewsItem(makeItem(NewsItem.LOYALTY_NONE, true), ArticleSize.S);

    expect(summary.totalLoyaltyEffect).toBe(3);
    expect(summary.numInterestingArticles).toBe(2);
    expect(summary.numArticles).toBe(2);
    expect(summary.articleCoveragePercentage).toBeCloseTo(6 / 19, 3);
  });

  it('uses the correct coverage for big articles', () => {
    const summary = new PaperSummary();
    summary.applyNewsItem(makeItem(NewsItem.LOYALTY_NONE, false), ArticleSize.B);
    expect(summary.articleCoveragePercentage).toBeCloseTo(9 / 19, 3);
  });
});
