import assert from 'node:assert/strict';
import test from 'node:test';

import { createBoardApi, escapeHtml, formatPaperDate, splitHeadline, validateBoardDraft } from '../js/board-api.js';
import { BOARD_SAMPLE_POSTS, ROLES } from '../js/data.js';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

test('escapeHtml neutralises markup from visitors', () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});

test('splitHeadline uses the first sentence as the headline', () => {
  assert.deepEqual(splitHeadline('明年春天，我想去光復。這次想自己去走走。'), { headline: '明年春天，我想去光復。', text: '這次想自己去走走。' });
  assert.deepEqual(splitHeadline('加油'), { headline: '加油', text: '' });
});

test('formatPaperDate formats as YYYY/MM/DD', () => {
  assert.equal(formatPaperDate('2026-10-05T08:00:00+08:00'), '2026/10/05');
  assert.equal(formatPaperDate('not a date', '—'), '—');
});

test('validateBoardDraft rejects empty, oversized and honeypot submissions', () => {
  assert.equal(validateBoardDraft({ body: '   ' }).ok, false);
  assert.equal(validateBoardDraft({ body: 'a'.repeat(501) }).ok, false);
  assert.equal(validateBoardDraft({ body: '平安', name: 'n'.repeat(21) }).ok, false);
  assert.equal(validateBoardDraft({ body: '平安', website: 'spam' }).ok, false);
  assert.equal(validateBoardDraft({ body: '平安', name: '小米' }).ok, true);
});

test('demo mode keeps submissions and likes on this device only', async () => {
  const storage = memoryStorage();
  const api = createBoardApi({}, { storage, fetchImpl: () => assert.fail('demo mode must not call the network') });
  assert.equal(api.mode, 'demo');
  assert.deepEqual(await api.listPosts(), []);
  assert.deepEqual(await api.submitPost({ role: 'other', prompt: '題目', body: '平安' }), { mode: 'demo' });
  assert.equal(JSON.parse(storage.getItem('heroes-after-board-pending')).length, 1);
  assert.equal(await api.like('sample-other', { sample: true }), null);
  assert.equal(api.hasLiked('sample-other'), true);
});

test('live mode uploads the photo first, then inserts a pending post', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => 7, text: async () => '' };
  };
  const api = createBoardApi(
    { supabaseUrl: 'https://example.supabase.co/', publishableKey: 'pk' },
    { storage: memoryStorage(), fetchImpl, uuid: () => '00000000-0000-4000-8000-000000000000' },
  );
  assert.equal(api.mode, 'live');
  await api.submitPost({ role: 'volunteer', prompt: '題目', name: ' 阿哲 ', body: ' 平安 ', photo: new Blob(['x']) });
  assert.equal(calls[0].url, 'https://example.supabase.co/storage/v1/object/board-uploads/00000000-0000-4000-8000-000000000000.jpg');
  assert.equal(calls[1].url, 'https://example.supabase.co/rest/v1/board_posts');
  assert.deepEqual(JSON.parse(calls[1].options.body), {
    role: 'volunteer', prompt: '題目', name: '阿哲', body: '平安', photo_path: '00000000-0000-4000-8000-000000000000.jpg',
  });
  assert.equal(calls[1].options.headers.apikey, 'pk');
  assert.equal(await api.like('post-1'), 7);
  assert.equal(await api.like('post-1'), null, 'the same device can only like once');
});

test('sample posts cover all three roles and stay marked as samples', () => {
  assert.equal(BOARD_SAMPLE_POSTS.length, 3);
  assert.deepEqual(new Set(BOARD_SAMPLE_POSTS.map(({ role }) => role)), new Set(ROLES.map(({ id }) => id)));
  assert.ok(BOARD_SAMPLE_POSTS.every((post) => post.sample && post.body && post.prompt === ROLES.find(({ id }) => id === post.role).wishPrompt));
});
