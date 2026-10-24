import assert from 'node:assert/strict';
import test from 'node:test';

import { createFeedbackApi, validateFeedback } from '../js/feedback.js';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

test('validateFeedback requires a vote, a valid email and consent', () => {
  assert.equal(validateFeedback({ email: 'a@b.tw', consent: true }).field, 'vote');
  assert.equal(validateFeedback({ vote: 'up', email: 'not-an-email', consent: true }).field, 'email');
  assert.equal(validateFeedback({ vote: 'down', email: 'a@b.tw', consent: false }).field, 'consent');
  assert.equal(validateFeedback({ vote: 'up', email: ' a@b.tw ', consent: true }).ok, true);
});

test('demo mode keeps one entry per email on this device', async () => {
  const storage = memoryStorage();
  const api = createFeedbackApi({}, { storage, fetchImpl: () => assert.fail('demo mode must not call the network') });
  assert.equal(api.mode, 'demo');
  await api.submit({ vote: 'up', email: 'A@B.tw', role: 'other' });
  await api.submit({ vote: 'down', email: 'a@b.tw ', role: 'other' });
  const saved = JSON.parse(storage.getItem('heroes-after-feedback-demo'));
  assert.deepEqual(Object.keys(saved), ['a@b.tw']);
  assert.equal(saved['a@b.tw'].satisfied, false);
});

test('live mode calls the submit_site_feedback RPC with a normalised email', async () => {
  const calls = [];
  const api = createFeedbackApi(
    { supabaseUrl: 'https://example.supabase.co/', publishableKey: 'pk' },
    { fetchImpl: async (url, options) => { calls.push({ url, options }); return { ok: true }; } },
  );
  await api.submit({ vote: 'up', email: ' Reader@Example.com ', role: 'volunteer' });
  assert.equal(calls[0].url, 'https://example.supabase.co/rest/v1/rpc/submit_site_feedback');
  assert.deepEqual(JSON.parse(calls[0].options.body), { p_email: 'reader@example.com', p_satisfied: true, p_role: 'volunteer' });
  assert.equal(calls[0].options.headers.apikey, 'pk');
});
