import { Const } from '../constants/Const';
import { Util } from '../utils/Util';
import { NewsItem } from './NewsItem';

export class Day {
  public newsItems: NewsItem[] = [];

  public constructor(dayIndex: number) {
    const criticalNewsItems: NewsItem[] = [];
    let weatherNewsItem: NewsItem | null = null;
    const nonCriticalNewsItems: NewsItem[] = [];

    const shuffled = Util.shuffleArray(NewsItem.allNewsItems);
    let containsRebelMessage = false;

    for (const newsItem of shuffled) {
      if (newsItem.used) continue;

      if (newsItem.isWeather()) {
        if (!weatherNewsItem) weatherNewsItem = newsItem;
        continue;
      }

      if (newsItem.dayRangeStart || newsItem.dayRangeEnd) {
        const inRange =
          (dayIndex >= newsItem.dayRangeStart && dayIndex <= newsItem.dayRangeEnd)
          || (dayIndex === newsItem.dayRangeStart && newsItem.dayRangeEnd < 0);
        if (inRange) {
          if (newsItem.isRebelLeader()) containsRebelMessage = true;
          criticalNewsItems.push(newsItem);
        }
      } else {
        nonCriticalNewsItems.push(newsItem);
      }
    }

    this.newsItems = [
      ...criticalNewsItems,
      ...(weatherNewsItem ? [weatherNewsItem] : []),
      ...nonCriticalNewsItems,
    ];

    const maxNumItems = 10;
    const randomNumItems = containsRebelMessage ? 2 : 3;
    const count = (maxNumItems - randomNumItems) + Math.floor(Math.random() * randomNumItems);
    this.newsItems = this.newsItems.slice(0, count);

    this.newsItems = Util.shuffleArray(this.newsItems);

    let index = 0;
    for (const newsItem of this.newsItems) {
      let t = 0.75 * index / this.newsItems.length;
      if (dayIndex === 1) t *= 0.5;
      newsItem.appearTime = Math.random() * t * Const.dayDuration;
      index += 1;
    }
  }
}
