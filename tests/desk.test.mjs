import assert from 'node:assert/strict';
import test from 'node:test';

import { DESK_OBJECT_IDS, mergeCompleted } from '../js/desk.js';

test('desk exposes the five interactive investigation objects', () => {
  assert.deepEqual(DESK_OBJECT_IDS, [
    'computer',
    'notebook',
    'map',
    'speaker',
    'photo',
  ]);
});

test('mergeCompleted keeps valid unique object ids in desk order', () => {
  assert.deepEqual(
    mergeCompleted(['map', 'computer', 'map', 'unknown'], 'photo'),
    ['computer', 'map', 'photo'],
  );
});

test('mergeCompleted does not mutate the existing array', () => {
  const existing = ['speaker'];
  mergeCompleted(existing, 'photo');
  assert.deepEqual(existing, ['speaker']);
});
