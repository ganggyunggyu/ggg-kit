export const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) return '0초';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}초`;
  return `${minutes}분 ${seconds}초`;
};
