const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function atLocalMidnight(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function daysSinceDisaster(now, start = '2025-09-23') {
  const elapsed = atLocalMidnight(now).getTime() - parseLocalDate(start).getTime();
  return Math.max(0, Math.round(elapsed / DAY_MS));
}

export function isValidEmail(value) {
  const normalized = String(value ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function validateImageFile(file) {
  if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, message: '請選擇 JPG、PNG 或 WebP 圖片。' };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: '圖片請小於 5 MB。' };
  }

  return { ok: true, message: '' };
}

