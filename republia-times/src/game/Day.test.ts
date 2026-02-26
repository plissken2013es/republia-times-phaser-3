import { describe, expect, it, vi } from 'vitest';

import { Day } from './Day';
import { NewsItem } from './NewsItem';

describe('Day', () => {
  it('produces 7-10 items and includes a weather entry', () => {
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const day = new Day(1);
    expect(day.newsItems.length).toBeGreaterThanOrEqual(7);
    expect(day.newsItems.length).toBeLessThanOrEqual(10);
    expect(day.newsItems.some((item) => item.isWeather())).toBe(true);
    rand.mockRestore();
  });

  it('uses critical items when in range', () => {
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const day = new Day(3);
    const hasCritical = day.newsItems.some(
      (item) => item.dayRangeStart === 1 && item.dayRangeEnd === 3,
    );
    expect(hasCritical).toBe(true);
    rand.mockRestore();
  });

  it('skips used items', () => {
    const rand = vi.spyOn(Math, 'random').mockReturnValue(0.7);
    const usedItem = NewsItem.allNewsItems[0];
    usedItem.used = true;
    const day = new Day(1);
    expect(day.newsItems.includes(usedItem)).toBe(false);
    usedItem.used = false;
    rand.mockRestore();
  });
});
