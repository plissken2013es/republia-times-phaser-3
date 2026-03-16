import { Const } from '../constants/Const';
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

    this.comments = '';
    this.curLoyalty += Math.round(paperSummary.totalLoyaltyEffect
      * Readership.getReadershipBonus(this.preReaderCount));

    if (this.curLoyalty > Const.statMax) this.curLoyalty = Const.statMax;
    if (this.curLoyalty < -Const.statMax) this.curLoyalty = -Const.statMax;

    if (paperSummary.articleCoveragePercentage === 0) {
      this.comments += '* The paper is blank. Money was saved on ink, but you have lost many readers.\n';
      this.curReaderCount = Math.round(this.curReaderCount * 0.5);
    } else if (paperSummary.articleCoveragePercentage < 0.75) {
      this.comments += '* There are too few articles. You have lost readers.\n';
      this.curReaderCount = Math.round(this.curReaderCount * 0.75);
    }

    if (paperSummary.numInterestingArticles < 2) {
      this.comments += '* There are not enough interesting articles. You have lost readers.\n';
      this.curReaderCount = Math.round(this.curReaderCount * 0.9);
    } else if (paperSummary.numInterestingArticles > 2) {
      this.comments += '* There are many interesting articles. You have gained readers.\n';
      this.curReaderCount = Math.round(this.curReaderCount * 1.25);
    }

    if (this.curLoyalty > this.preLoyalty) {
      this.comments += '* The included articles have increased your readership\'s loyalty to the government.\n';
    }
    if (this.curLoyalty < this.preLoyalty) {
      this.comments += '* The included articles have decreased your readership\'s loyalty to the government.\n';
    }

    const preReadershipBonus = Readership.getReadershipBonus(this.preReaderCount);
    const curReadershipBonus = Readership.getReadershipBonus(this.curReaderCount);
    if (curReadershipBonus > preReadershipBonus) {
      this.comments += '* The paper\'s increasing readership has expanded its influence.\n';
    } else if (curReadershipBonus > preReadershipBonus) {
      this.comments += '* The paper\'s decreasing readership has reduced its influence.\n';
    }
  }
}
