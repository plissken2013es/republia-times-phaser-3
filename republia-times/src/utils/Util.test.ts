import { describe, expect, it } from 'vitest';

import { Util } from './Util';

describe('Util', () => {
  it('clamps values to bounds', () => {
    expect(Util.clamp(5, 0, 10)).toBe(5);
    expect(Util.clamp(-1, 0, 10)).toBe(0);
    expect(Util.clamp(11, 0, 10)).toBe(10);
  });

  it('shuffles without losing elements', () => {
    const input = [1, 2, 3, 4, 5];
    const output = Util.shuffleArray(input);
    expect(output).toHaveLength(input.length);
    expect([...output].sort()).toEqual([...input].sort());
  });
});
