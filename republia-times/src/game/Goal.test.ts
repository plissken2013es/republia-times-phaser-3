import { describe, expect, it } from 'vitest';

import { Goal } from './Goal';
import { Readership } from './Readership';

describe('Goal', () => {
  it('meets the state goals with required thresholds', () => {
    const rs = new Readership(20, 400);
    const first = Goal.allGoals[0];
    const second = Goal.allGoals[1];
    expect(first.isMet(rs)).toBe(true);
    expect(second.isMet(rs)).toBe(true);
  });

  it('meets the rebel goal with low loyalty and high readers', () => {
    const rs = new Readership(-30, 1000);
    const rebel = Goal.allGoals[2];
    expect(rebel.isMet(rs)).toBe(true);
  });

  it('returns the correct goal for a given day', () => {
    expect(Goal.getGoalForDay(1)?.id).toBe('first-state');
    expect(Goal.getGoalForDay(3)?.id).toBe('first-state');
    expect(Goal.getGoalForDay(4)?.id).toBe('second-state');
    expect(Goal.getGoalForDay(9)?.id).toBe('last-rebel');
  });

  it('returns a goal status based on readership deltas', () => {
    const rs = new Readership(10, 300);
    rs.preLoyalty = 5;
    rs.preReaderCount = 250;
    const status = Goal.getCurGoalStatus(rs, 4);
    expect(status).toBe(Goal.kStatusWorkingTowards);
  });
});
