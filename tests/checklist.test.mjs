import assert from 'node:assert/strict';
import test from 'node:test';

import { checklistProgress } from '../js/checklist.js';
import { CHECKLIST } from '../js/data.js';

test('checklistProgress only unlocks departure after every required item', () => {
  assert.deepEqual(checklistProgress(CHECKLIST, []), { done: [], ready: false });
  assert.deepEqual(checklistProgress(CHECKLIST, ['computer', 'map', 'photo']), { done: ['map'], ready: false });
  assert.deepEqual(checklistProgress(CHECKLIST, ['notebook', 'speaker', 'map']), { done: ['speaker', 'map', 'notebook'], ready: true });
});
