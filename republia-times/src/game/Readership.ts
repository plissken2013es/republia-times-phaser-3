import { Const } from '../constants/Const';
import { S } from '../locale/locale';
import { PaperSummary } from './PaperSummary';

export class Readership {
  public curReaderCount: number;
  public preReaderCount: number;
  public curLoyalty: number;
  public preLoyalty: number;
  public comments = '';

  public constructor(loyalty = 0, readers: number = Const.readershipStartCount) {
    this.curLoyalty = loyalty;
    this.preLoyalty = loyalty;
    this.curReaderCount = readers;
    this.preReaderCount = readers;
  }

  private static getReadershipBonus(readerCount: number): number {
    return 1 + 0.1 * Math.floor((readerCount - Const.readershipStartCount) / Const.readershipBonusThresh);
  }

  public getReaderCountDelta(): number {
    return this.curReaderCount - this.preReaderCount;
  }

  public getLoyaltyDelta(): number {
    return this.curLoyalty - this.preLoyalty;
  }

  public applyPaperSummary(paperSummary: PaperSummary): void {
    this.preLoyalty = this.curLoyalty;
    this.preReaderCount = this.curReaderCount;

    const L = S();
    this.comments = '';
    this.curLoyalty += Math.round(paperSummary.totalLoyaltyEffect
      * Readership.getReadershipBonus(this.preReaderCount));

    if (this.curLoyalty > Const.statMax) this.curLoyalty = Const.statMax;
    if (this.curLoyalty < -Const.statMax) this.curLoyalty = -Const.statMax;

    if (paperSummary.articleCoveragePercentage === 0) {
      this.comments += `* ${L.comment_blankPaper}\n`;
      this.curReaderCount = Math.round(this.curReaderCount * 0.5);
    } else if (paperSummary.articleCoveragePercentage < 0.75) {
      this.comments += `* ${L.comment_tooFewArticles}\n`;
      this.curReaderCount = Math.round(this.curReaderCount * 0.75);
    }

    if (paperSummary.numInterestingArticles < 2) {
      this.comments += `* ${L.comment_notEnoughInteresting}\n`;
      this.curReaderCount = Math.round(this.curReaderCount * 0.9);
    } else if (paperSummary.numInterestingArticles > 2) {
      this.comments += `* ${L.comment_manyInteresting}\n`;
      this.curReaderCount = Math.round(this.curReaderCount * 1.25);
    }

    if (this.curLoyalty > this.preLoyalty) {
      this.comments += `* ${L.comment_loyaltyIncreased}\n`;
    }
    if (this.curLoyalty < this.preLoyalty) {
      this.comments += `* ${L.comment_loyaltyDecreased}\n`;
    }

    const preReadershipBonus = Readership.getReadershipBonus(this.preReaderCount);
    const curReadershipBonus = Readership.getReadershipBonus(this.curReaderCount);
    if (curReadershipBonus > preReadershipBonus) {
      this.comments += `* ${L.comment_influenceExpanded}\n`;
    } else if (curReadershipBonus > preReadershipBonus) {
      this.comments += `* ${L.comment_influenceReduced}\n`;
    }
  }
}
