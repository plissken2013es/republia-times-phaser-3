import { describe, expect, it } from 'vitest';

import { NewsItem } from './NewsItem';

describe('NewsItem', () => {
  it('contains the full content list', () => {
    expect(NewsItem.allNewsItems.length).toBe(71);
  });

  it('detects weather items', () => {
    const weatherItems = NewsItem.allNewsItems.filter((item) =>
      item.getBlurbText().startsWith('Weather:'),
    );
    expect(weatherItems.length).toBeGreaterThan(0);
    for (const item of weatherItems) {
      expect(item.isWeather()).toBe(true);
    }
  });

  it('detects rebel leader messages', () => {
    const rebelItems = NewsItem.allNewsItems.filter((item) =>
      item.getBlurbText().includes('***'),
    );
    expect(rebelItems.length).toBeGreaterThan(0);
    for (const item of rebelItems) {
      expect(item.isRebelLeader()).toBe(true);
    }
  });

  it('handles missing article text', () => {
    const noArticle = NewsItem.allNewsItems.find((item) => !item.hasArticleText());
    expect(noArticle).toBeDefined();
    if (noArticle) {
      expect(noArticle.getArticleText()).toBe('');
    }
  });

  it('resets used state', () => {
    NewsItem.allNewsItems[0].used = true;
    NewsItem.resetAllNewsItems();
    expect(NewsItem.allNewsItems.every((item) => item.used === false)).toBe(true);
  });

  it('includes the rebellion crushed plot item', () => {
    const plotItem = NewsItem.allNewsItems.find(
      (item) => item.dayRangeStart === 1 && item.dayRangeEnd === 3,
    );
    expect(plotItem).toBeDefined();
  });
});
