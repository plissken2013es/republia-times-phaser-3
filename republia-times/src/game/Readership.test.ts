import { describe, expect, it } from 'vitest';

import { Const } from '../constants/Const';
import { PaperSummary } from './PaperSummary';
import { Readership } from './Readership';

const makeSummary = (coverage: number, interesting: number, loyalty: number): PaperSummary => {
  const summary = new PaperSummary();
  summary.articleCoveragePercentage = coverage;
  summary.numInterestingArticles = interesting;
  summary.totalLoyaltyEffect = loyalty;
  return summary;
};

describe('Readership', () => {
  it('clamps loyalty to stat limits', () => {
    const rs = new Readership(Const.statMax - 1);
    const summary = makeSummary(1, 3, 10);
    rs.applyPaperSummary(summary);
    expect(rs.curLoyalty).toBe(Const.statMax);
  });

  it('applies reader count penalties for low coverage', () => {
    const rs = new Readership(0, 200);
    const summary = makeSummary(0.5, 2, 0);
    rs.applyPaperSummary(summary);
    expect(rs.curReaderCount).toBe(150);
  });

  it('applies blank paper penalty and low interest penalty', () => {
    const rs = new Readership(0, 200);
    const summary = makeSummary(0, 0, 0);
    rs.applyPaperSummary(summary);
    expect(rs.curReaderCount).toBe(90);
    expect(rs.comments).toContain('paper is blank');
    expect(rs.comments).toContain('not enough interesting');
  });

  it('applies interest bonus when more than two interesting articles', () => {
    const rs = new Readership(0, 200);
    const summary = makeSummary(1, 3, 0);
    rs.applyPaperSummary(summary);
    expect(rs.curReaderCount).toBe(250);
    expect(rs.comments).toContain('many interesting');
  });

  it('preserves the decreasing influence bug', () => {
    const rs = new Readership(0, 500);
    const summary = makeSummary(0, 0, 0);
    rs.applyPaperSummary(summary);
    expect(rs.comments).not.toContain('decreasing readership');
  });
});
