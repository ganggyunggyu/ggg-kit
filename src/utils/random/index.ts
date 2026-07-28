export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const pickRandom = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const randomPick = pickRandom;

export const pickRandomN = <T>(items: readonly T[], n: number): T[] => {
  const count = Math.max(0, Math.min(n, items.length));
  return shuffle(items).slice(0, count);
};

export const pickWeighted = <T>(
  items: readonly T[],
  weights: readonly number[],
): T => {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let threshold = Math.random() * total;

  for (let i = 0; i < items.length; i += 1) {
    threshold -= weights[i];
    if (threshold <= 0) return items[i];
  }

  return items[items.length - 1];
};

const DEFAULT_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomString = (
  length: number,
  chars: string = DEFAULT_CHARS,
): string => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};
