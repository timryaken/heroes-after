import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NOTEBOOK_PAGES,
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

test('content defines the three approved representative places', () => {
  assert.deepEqual(PLACES.map(({ id }) => id), ['wetland', 'sugar-factory', 'datong']);
  assert.equal(new Set(PLACES.map(({ id }) => id)).size, 3);
  for (const place of PLACES) {
    assert.ok(place.name && place.era && place.summary && place.note);
    assertPhotoContract(place.before);
    assertPhotoContract(place.after);
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

test('story content includes three roles, 11/15 departure, three prototype voices, and photo hook', () => {
  assert.equal(ROLES.length, 3);
  assert.ok(NOTEBOOK_PAGES.some(({ title, body }) => `${title} ${body}`.includes('11/15')));
  assert.equal(VOICE_CLIPS.length, 3);
  assert.ok(VOICE_CLIPS.every(({ transcript, prototype }) => transcript && prototype === true));
  assertPhotoContract(REPORTER_PHOTO);
  assert.ok(REPORTER_PHOTO.backNote.endsWith('……'));
});
