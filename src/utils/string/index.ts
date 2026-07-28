export const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

export const truncate = (
  value: string,
  maxLength: number,
  suffix = '...',
): string => {
  if (value.length <= maxLength) return value;
  return value.slice(0, Math.max(0, maxLength - suffix.length)) + suffix;
};

export const sanitizeFileName = (value: string, fallback = 'untitled'): string => {
  const cleaned = value
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/, '')
    .trim();
  return cleaned || fallback;
};

export const escapeCsvValue = (value: string | number | null | undefined): string => {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const stripMarkdown = (text: string): string =>
  text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*([-*_])\1{2,}\s*$/gm, '')
    .replace(/\|/g, ' ')
    .trim();

const isWideChar = (codePoint: number): boolean =>
  (codePoint >= 0x1100 && codePoint <= 0x115f) ||
  (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
  (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
  (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
  (codePoint >= 0xfe30 && codePoint <= 0xfe4f) ||
  (codePoint >= 0xff00 && codePoint <= 0xff60) ||
  (codePoint >= 0xffe0 && codePoint <= 0xffe6);

export const getDisplayWidth = (value: string): number => {
  let width = 0;
  for (const char of value) {
    width += isWideChar(char.codePointAt(0) ?? 0) ? 2 : 1;
  }
  return width;
};

export const padEndDisplay = (
  value: string,
  targetWidth: number,
  pad = ' ',
): string => {
  const current = getDisplayWidth(value);
  if (current >= targetWidth) return value;
  return value + pad.repeat(targetWidth - current);
};

export const sliceDisplay = (value: string, maxWidth: number): string => {
  let width = 0;
  let result = '';
  for (const char of value) {
    const charWidth = isWideChar(char.codePointAt(0) ?? 0) ? 2 : 1;
    if (width + charWidth > maxWidth) break;
    result += char;
    width += charWidth;
  }
  return result;
};
