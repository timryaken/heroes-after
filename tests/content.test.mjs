import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CHECKLIST,
  NOTEBOOK_PAGES,
  PHOTO_STACK,
  PLACES,
  PROLOGUE_SLIDES,
  ROLES,
  VOICE_CLIPS,
} from '../js/data.js';

function assertPhotoContract(photo) {
  assert.match(photo.src, /^assets\/images\//);
  assert.ok(photo.alt?.trim(), 'photo alt text is required');
  assert.ok(photo.credit?.trim(), 'photo credit is required');
  assert.match(photo.sourceUrl, /^https:\/\//);
}

test('content defines the four places on the map (wetland has only a present-day photo)', () => {
  assert.deepEqual(PLACES.map(({ id }) => id), ['bangcha', 'bixin', 'sugar-factory', 'wetland']);
  for (const place of PLACES) {
    assert.ok(place.name && place.era && place.summary);
    assert.ok(Math.abs(place.lat - 23.66) < 0.05 && Math.abs(place.lng - 121.42) < 0.05, `${place.id} 座標應在光復鄉`);
    if (place.before) assertPhotoContract(place.before);
    else assert.equal(place.id, 'wetland');
    if (place.after.placeholder) assert.ok(place.after.label);
    else assertPhotoContract(place.after);
  }
});

test('prologue includes sourced disaster, volunteer, and current-day images', () => {
  assert.ok(PROLOGUE_SLIDES.length >= 6);
  assert.deepEqual(
    [...new Set(PROLOGUE_SLIDES.map(({ phase }) => phase))].sort(),
    ['disaster', 'now', 'volunteers'],
  );
  for (const slide of PROLOGUE_SLIDES) assertPhotoContract(slide);
});

test('story content follows the material sheet: four notebook pages from the disaster to the anniversary', () => {
  assert.deepEqual(NOTEBOOK_PAGES.map(({ date }) => date), ['2025／風災發生後', '2025／光復採訪期間', '2025／採訪結束後', '2026／風災周年前']);
  assert.ok(NOTEBOOK_PAGES.at(-1).lines.includes('這次接下任務的人，是林知行。'));
  assert.ok(NOTEBOOK_PAGES.every(({ lines }) => lines.length && lines[0]));
});

test('roles, recordings, checklist, and desk photos are complete', () => {
  assert.equal(ROLES.length, 3);
  assert.ok(ROLES.every(({ headline, relation, wishPrompt }) => headline && relation && wishPrompt));
  assert.equal(VOICE_CLIPS.length, 2);
  assert.ok(VOICE_CLIPS.every(({ embedUrl, sourceUrl, title }) => /^https:\/\//.test(embedUrl) && /^https:\/\//.test(sourceUrl) && title));
  assert.deepEqual(CHECKLIST.map(({ id }) => id), ['speaker', 'map', 'notebook']);
  assert.ok(PHOTO_STACK.length >= 2);
  assert.ok(PHOTO_STACK.every(({ src }) => !src.includes('reporters-photo')), '照片堆不放 AI 生成的合照');
  for (const photo of PHOTO_STACK) {
    assert.ok(photo.date && photo.place);
    if (!photo.placeholder) assertPhotoContract(photo);
  }
});
