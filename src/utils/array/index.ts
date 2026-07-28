export const chunk = <T>(items: readonly T[], size: number): T[][] => {
  const safeSize = Math.max(1, Math.floor(size));
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += safeSize) {
    result.push(items.slice(i, i + safeSize));
  }
  return result;
};

export const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];

export const uniqueBy = <T, K>(
  items: readonly T[],
  keyFn: (item: T) => K,
): T[] => {
  const seen = new Set<K>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

export const groupBy = <T, K extends PropertyKey>(
  items: readonly T[],
  keyFn: (item: T) => K,
): Record<K, T[]> => {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
};
