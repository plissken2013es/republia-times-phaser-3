import { ArticleSize, NewsItem } from './NewsItem';

export class PaperSummary {
  public numInterestingArticles = 0;
  public numArticles = 0;
  public articleCoveragePercentage = 0;
  public totalLoyaltyEffect = 0;

  public applyNewsItem(newsItem: NewsItem, articleSize: ArticleSize): void {
    this.numArticles += 1;
    if (newsItem.interesting) {
      this.numInterestingArticles += 1;
    }

    let multiplier = 1;
    let coverage = 2 / 19;
    if (articleSize === ArticleSize.M) {
      multiplier = 3;
      coverage = 4 / 19;
    } else if (articleSize === ArticleSize.B) {
      multiplier = 6;
      coverage = 9 / 19;
    }

    this.totalLoyaltyEffect += newsItem.loyaltyEffect * multiplier;
    this.articleCoveragePercentage += coverage;
  }

  public toString(): string {
    const coverage = this.articleCoveragePercentage.toFixed(3);
    return `articles=${this.numArticles}, interesting=${this.numInterestingArticles}, coverage=${coverage}, loyalty=${this.totalLoyaltyEffect}`;
  }
}
