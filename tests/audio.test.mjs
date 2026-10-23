import assert from 'node:assert/strict';
import test from 'node:test';

import { mergeListened } from '../js/audio.js';

const clips = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

test('mergeListened keeps clip order and ignores unknown ids', () => {
  assert.deepEqual(mergeListened(clips, ['c', 'x'], 'a'), ['a', 'c']);
  assert.deepEqual(mergeListened(clips, ['a', 'b'], 'c'), ['a', 'b', 'c']);
});
