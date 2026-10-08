import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DESK_TEXTURE, PLACES, PROLOGUE_SLIDES, REPORTER_PHOTO } from '../js/data.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(projectRoot, 'index.html'), 'utf8');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const entry of ['styles/base.css', 'styles/prologue.css', 'styles/desk.css', 'js/app.js']) {
  check(html.includes(entry), `index.html 缺少入口：${entry}`);
  check(existsSync(resolve(projectRoot, entry)), `入口檔案不存在：${entry}`);
}

const photos = [
  ...PROLOGUE_SLIDES,
  ...PLACES.flatMap((place) => [place.before, place.after]),
  REPORTER_PHOTO,
  DESK_TEXTURE,
];
for (const photo of photos) {
  check(photo.src.startsWith('assets/images/'), `圖片必須使用本機路徑：${photo.src}`);
  check(!/^https?:/i.test(photo.src), `圖片 src 不得外連：${photo.src}`);
  check(existsSync(resolve(projectRoot, photo.src)), `圖片檔案不存在：${photo.src}`);
  check(Boolean(photo.alt?.trim()), `圖片缺少替代文字：${photo.src}`);
  check(Boolean(photo.credit?.trim()), `圖片缺少來源署名：${photo.src}`);
  check(/^https:\/\//.test(photo.sourceUrl), `來源網址必須是 HTTPS：${photo.src}`);
}

for (const id of ['computer', 'notebook', 'map', 'speaker', 'photo', 'wish']) {
  check(html.includes(`data-desk-object="${id}"`), `缺少桌面物件：${id}`);
  check(html.includes(`data-object-dialog="${id}"`), `缺少物件對話框：${id}`);
}

check(!/<img[^>]+src=["']https?:/i.test(html), 'index.html 不得直接載入外部圖片');
check(existsSync(resolve(projectRoot, 'README.md')), '缺少 README.md 操作說明');

if (failures.length) {
  console.error('Static prototype check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Static prototype check passed');
}
