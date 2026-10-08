import test from 'node:test';
import assert from 'node:assert/strict';

import { createPrologueBeats } from '../js/prologue.js';

const slides = [
  { id: 'd1', phase: 'disaster' },
  { id: 'v1', phase: 'volunteers' },
  { id: 'n1', phase: 'now' },
];

test('prologue places count and question between volunteer and current-day images', () => {
  assert.deepEqual(
    createPrologueBeats(slides, 390, false).map(({ type, slide }) => slide?.id ?? type),
    ['d1', 'v1', 'count', 'question', 'n1', 'invitation'],
  );
});

test('reduced-motion beats preserve order and make the count immediate', () => {
  const beats = createPrologueBeats(slides, 390, true);
  assert.deepEqual(beats.map(({ type, slide }) => slide?.id ?? type), [
    'd1', 'v1', 'count', 'question', 'n1', 'invitation',
  ]);
  assert.equal(beats.find(({ type }) => type === 'count').animateCount, false);
  assert.ok(beats.every(({ duration }) => duration <= 900));
});

