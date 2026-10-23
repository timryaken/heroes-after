import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CHECKLIST,
  NOTEBOOK_PAGES,
  PHOTO_STACK,
  PLACES,
  PROLOGUE_SLIDES,
  REPORTER_PHOTO,
  ROLES,
  VOICE_CLIPS,
} from '../js/data.js';

function assertPhotoContract(photo) {
  assert.match(photo.src, /^assets\/images\//);
  assert.ok(photo.alt?.trim(), 'photo alt text is required');
  assert.ok(photo.credit?.trim(), 'photo credit is required');
  assert.match(photo.sourceUrl, /^https:\/\//);
}

test('content defines the four places from the material sheet', () => {
  assert.deepEqual(PLACES.map(({ id }) => id), ['bangcha', 'bixin', 'xiaoguang', 'sugar-factory']);
  for (const place of PLACES) {
    assert.ok(place.name && place.era && place.summary);
    assert.ok(Math.abs(place.lat - 23.66) < 0.05 && Math.abs(place.lng - 121.42) < 0.05, `${place.id} 座標應在光復鄉`);
    assertPhotoContract(place.before);
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

test('story content follows the material sheet: seven notebook pages ending before departure', () => {
  assert.deepEqual(NOTEBOOK_PAGES.map(({ date }) => date), ['1/1', '1/17', '3/02', '4/21', '6/18', '9/24', '9/25']);
  assert.ok(NOTEBOOK_PAGES.at(-1).lines.includes('等他回來再給他看。先去光復。'));
  assert.ok(NOTEBOOK_PAGES.every(({ lines }) => lines.length && lines[0]));
});

test('roles, recordings, checklist, and desk photos are complete', () => {
  assert.equal(ROLES.length, 3);
  assert.ok(ROLES.every(({ headline, relation, wishPrompt }) => headline && relation && wishPrompt));
  assert.equal(VOICE_CLIPS.length, 2);
  assert.ok(VOICE_CLIPS.every(({ embedUrl, sourceUrl, title }) => /^https:\/\//.test(embedUrl) && /^https:\/\//.test(sourceUrl) && title));
  assert.deepEqual(CHECKLIST.map(({ id }) => id), ['speaker', 'map', 'notebook']);
  assertPhotoContract(REPORTER_PHOTO);
  assert.ok(PHOTO_STACK.length >= 2);
  assert.equal(PHOTO_STACK[0].src, REPORTER_PHOTO.src);
  for (const photo of PHOTO_STACK) {
    assert.ok(photo.date && photo.place);
    if (!photo.placeholder) assertPhotoContract(photo);
  }
});
