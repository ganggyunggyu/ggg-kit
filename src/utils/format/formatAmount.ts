export const formatAmount = (amount: number): string => {
  if (!Number.isFinite(amount)) return '0';
  return amount.toLocaleString('ko-KR');
};

export const formatAmountWithUnit = (amount: number, unit = '원'): string => {
  return `${formatAmount(amount)}${unit}`;
};

export const formatCompactAmount = (amount: number): string => {
  if (!Number.isFinite(amount)) return '0';

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 100_000_000) {
    return `${sign}${(absAmount / 100_000_000).toFixed(1)}억`;
  }
  if (absAmount >= 10_000) {
    return `${sign}${(absAmount / 10_000).toFixed(1)}만`;
  }
  return formatAmount(amount);
};
