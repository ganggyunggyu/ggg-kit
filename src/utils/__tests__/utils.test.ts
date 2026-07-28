import { describe, expect, it } from 'vitest';
import {
  chunk,
  clamp,
  escapeCsvValue,
  formatDuration,
  getDisplayWidth,
  groupBy,
  normalizeText,
  padEndDisplay,
  pickWeighted,
  randomInt,
  sanitizeFileName,
  shuffle,
  sliceDisplay,
  stripMarkdown,
  truncate,
  unique,
  uniqueBy,
  waitForAllOrThrow,
} from '../index';

describe('array', () => {
  it('chunk splits into fixed-size groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('chunk clamps invalid size to at least 1', () => {
    expect(chunk([1, 2], 0)).toEqual([[1], [2]]);
  });

  it('unique removes duplicates preserving order', () => {
    expect(unique([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
  });

  it('uniqueBy dedups by key', () => {
    const items = [{ id: 1 }, { id: 1 }, { id: 2 }];
    expect(uniqueBy(items, (item) => item.id)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('groupBy buckets by key', () => {
    expect(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'))).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });
});

describe('string', () => {
  it('normalizeText collapses whitespace', () => {
    expect(normalizeText('  a   b\n c  ')).toBe('a b c');
  });

  it('truncate adds suffix when over length', () => {
    expect(truncate('abcdefgh', 5)).toBe('ab...');
    expect(truncate('abc', 5)).toBe('abc');
  });

  it('sanitizeFileName strips forbidden chars', () => {
    expect(sanitizeFileName('a/b:c*?.')).toBe('abc');
    expect(sanitizeFileName('   ', 'fallback')).toBe('fallback');
  });

  it('escapeCsvValue wraps values with special chars', () => {
    expect(escapeCsvValue('a,b')).toBe('"a,b"');
    expect(escapeCsvValue('he said "hi"')).toBe('"he said ""hi"""');
    expect(escapeCsvValue('plain')).toBe('plain');
  });

  it('stripMarkdown removes markdown syntax', () => {
    expect(stripMarkdown('# Title')).toBe('Title');
    expect(stripMarkdown('**bold** and _italic_')).toBe('bold and italic');
    expect(stripMarkdown('[link](https://x.com)')).toBe('link');
  });

  it('CJK display width helpers count wide chars as 2', () => {
    expect(getDisplayWidth('가a')).toBe(3);
    expect(padEndDisplay('가', 4)).toBe('가  ');
    expect(sliceDisplay('가나다', 4)).toBe('가나');
  });
});

describe('number', () => {
  it('clamp bounds value', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('format', () => {
  it('formatDuration renders minutes and seconds', () => {
    expect(formatDuration(5000)).toBe('5초');
    expect(formatDuration(65000)).toBe('1분 5초');
    expect(formatDuration(-1)).toBe('0초');
  });
});

describe('random', () => {
  it('randomInt stays within range', () => {
    for (let i = 0; i < 100; i += 1) {
      const value = randomInt(1, 3);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(3);
    }
  });

  it('shuffle keeps the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input).sort()).toEqual(input);
  });

  it('pickWeighted always returns an element', () => {
    const value = pickWeighted(['a', 'b'], [1, 0]);
    expect(value).toBe('a');
  });
});

describe('async', () => {
  it('waitForAllOrThrow returns values when all resolve', async () => {
    await expect(
      waitForAllOrThrow([Promise.resolve(1), Promise.resolve(2)]),
    ).resolves.toEqual([1, 2]);
  });

  it('waitForAllOrThrow throws the first rejection', async () => {
    await expect(
      waitForAllOrThrow([Promise.resolve(1), Promise.reject(new Error('boom'))]),
    ).rejects.toThrow('boom');
  });
});
