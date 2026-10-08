import assert from 'node:assert/strict';
import test from 'node:test';

import { mergeListened, splitSentences } from '../js/audio.js';

const clips = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

test('splitSentences keeps Chinese sentence punctuation', () => {
  assert.deepEqual(splitSentences('店又開了。你什麼時候回來？好'), ['店又開了。', '你什麼時候回來？', '好']);
  assert.deepEqual(splitSentences(''), []);
});

test('mergeListened keeps clip order and ignores unknown ids', () => {
  assert.deepEqual(mergeListened(clips, ['c', 'x'], 'a'), ['a', 'c']);
  assert.deepEqual(mergeListened(clips, ['a', 'b'], 'c'), ['a', 'b', 'c']);
});
