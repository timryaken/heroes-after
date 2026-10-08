import assert from 'node:assert/strict';
import test from 'node:test';

import { DESK_OBJECT_IDS, mergeExplored } from '../js/desk.js';

test('desk exposes the six interactive investigation objects', () => {
  assert.deepEqual(DESK_OBJECT_IDS, [
    'computer',
    'notebook',
    'map',
    'speaker',
    'photo',
    'wish',
  ]);
});

test('mergeExplored keeps valid unique object ids in desk order', () => {
  assert.deepEqual(
    mergeExplored(['map', 'computer', 'map', 'unknown'], 'wish'),
    ['computer', 'map', 'wish'],
  );
});

test('mergeExplored does not mutate the existing array', () => {
  const existing = ['speaker'];
  mergeExplored(existing, 'photo');
  assert.deepEqual(existing, ['speaker']);
});
