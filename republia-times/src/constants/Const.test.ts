import { describe, expect, it } from 'vitest';

import { Const } from './Const';

describe('Const', () => {
  it('derives grid values from s and p', () => {
    expect(Const.p).toBe(Const.s * 5);
    expect(Const.paperX).toBe(Const.s * 33);
    expect(Const.paperW).toBe(Const.p * 4);
    expect(Const.paperH).toBe(Const.p * 5);
    expect(Const.feedW).toBe(Const.s * 26);
  });

  it('keeps core limits stable', () => {
    expect(Const.statMax).toBe(30);
    expect(Const.dayDuration).toBe(60);
  });
});
