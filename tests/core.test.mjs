import test from 'node:test';
import assert from 'node:assert/strict';

import {
  daysSinceDisaster,
  isValidEmail,
  validateImageFile,
} from '../js/core.js';

test('daysSinceDisaster counts local calendar days from 2025-09-23', () => {
  assert.equal(daysSinceDisaster(new Date(2025, 8, 23, 23, 59)), 0);
  assert.equal(daysSinceDisaster(new Date(2025, 8, 24, 0, 1)), 1);
  assert.equal(daysSinceDisaster(new Date(2026, 9, 18, 12, 0)), 390);
});

test('daysSinceDisaster never returns a negative value', () => {
  assert.equal(daysSinceDisaster(new Date(2025, 8, 22, 12, 0)), 0);
});

test('isValidEmail accepts a practical address and trims surrounding spaces', () => {
  assert.equal(isValidEmail(' reporter+guangfu@example.org '), true);
});

test('isValidEmail rejects blank, incomplete, and whitespace-containing addresses', () => {
  for (const value of ['', 'hello', 'hello@', '@example.com', 'a b@example.com']) {
    assert.equal(isValidEmail(value), false, value);
  }
});

test('validateImageFile accepts images no larger than five megabytes', () => {
  assert.deepEqual(
    validateImageFile({ type: 'image/jpeg', size: 5 * 1024 * 1024 }),
    { ok: true, message: '' },
  );
});

test('validateImageFile rejects non-images and oversized images', () => {
  assert.deepEqual(
    validateImageFile({ type: 'application/pdf', size: 1024 }),
    { ok: false, message: '請選擇 JPG、PNG 或 WebP 圖片。' },
  );
  assert.deepEqual(
    validateImageFile({ type: 'image/png', size: 5 * 1024 * 1024 + 1 }),
    { ok: false, message: '圖片請小於 5 MB。' },
  );
});

