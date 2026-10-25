import assert from 'node:assert/strict';
import test from 'node:test';

import { isPreviewCode } from '../js/gate.js';

test('preview gate accepts only the preview code', async () => {
  assert.equal(await isPreviewCode('1130'), true);
  assert.equal(await isPreviewCode(' 1130 '), true);
  assert.equal(await isPreviewCode('0000'), false);
  assert.equal(await isPreviewCode(''), false);
});
