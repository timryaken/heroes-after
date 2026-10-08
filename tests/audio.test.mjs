import assert from 'node:assert/strict';
import test from 'node:test';

import { pickDifferentClip } from '../js/audio.js';

const clips = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

test('pickDifferentClip avoids the current clip when another exists', () => {
  assert.equal(pickDifferentClip(clips, 'a', () => 0).id, 'b');
  assert.equal(pickDifferentClip(clips, 'b', () => 0.99).id, 'c');
});

test('pickDifferentClip supports one or zero clips', () => {
  assert.deepEqual(pickDifferentClip([{ id: 'only' }], 'only'), { id: 'only' });
  assert.equal(pickDifferentClip([], ''), null);
});
