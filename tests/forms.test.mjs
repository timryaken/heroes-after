import assert from 'node:assert/strict';
import test from 'node:test';

import { formDraftFromState, rolePrompt } from '../js/forms.js';
import { ROLES } from '../js/data.js';

test('rolePrompt returns the selected role question and falls back safely', () => {
  assert.equal(rolePrompt(ROLES, 'volunteer'), '如果再次回到光復，你最想確認什麼？');
  assert.equal(rolePrompt(ROLES, 'missing'), ROLES.at(-1).wishPrompt);
});

test('formDraftFromState returns only persisted form values', () => {
  assert.deepEqual(formDraftFromState({
    role: 'volunteer',
    explored: ['map'],
    memory: '那天的記憶',
    wish: '平安',
    signupEmail: 'demo@example.com',
  }), {
    memory: '那天的記憶',
    wish: '平安',
    signupEmail: 'demo@example.com',
  });
});
