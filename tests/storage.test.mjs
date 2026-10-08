import test from 'node:test';
import assert from 'node:assert/strict';

import { createPrototypeStore } from '../js/storage.js';

const EMPTY_STATE = {
  role: '',
  completed: [],
  listened: [],
  memory: '',
  wish: '',
  signupEmail: '',
};

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test('store loads the complete empty state by default', () => {
  const store = createPrototypeStore(createMemoryStorage());
  assert.deepEqual(store.load(), EMPTY_STATE);
  assert.equal(store.persistent, true);
});

test('store merges updates and persists them', () => {
  const storage = createMemoryStorage();
  const first = createPrototypeStore(storage);

  first.save({ role: 'volunteer', completed: ['map'] });
  first.save({ wish: '願每個人都平安回家' });

  const second = createPrototypeStore(storage);
  assert.deepEqual(second.load(), {
    ...EMPTY_STATE,
    role: 'volunteer',
    completed: ['map'],
    wish: '願每個人都平安回家',
  });
});

test('store reset removes only the prototype state', () => {
  const storage = createMemoryStorage({ unrelated: 'keep-me' });
  const store = createPrototypeStore(storage);
  store.save({ memory: '記得大家一起清淤的聲音' });

  assert.deepEqual(store.reset(), EMPTY_STATE);
  assert.equal(storage.getItem('unrelated'), 'keep-me');
});

test('store ignores malformed JSON and restores defaults', () => {
  const storage = createMemoryStorage({ 'heroes-after-prototype': '{broken' });
  const store = createPrototypeStore(storage);
  assert.deepEqual(store.load(), EMPTY_STATE);
});

test('store falls back to memory when browser storage throws', () => {
  const brokenStorage = {
    getItem() { throw new Error('disabled'); },
    setItem() { throw new Error('disabled'); },
    removeItem() { throw new Error('disabled'); },
  };
  const store = createPrototypeStore(brokenStorage);

  assert.equal(store.persistent, false);
  store.save({ signupEmail: 'friend@example.com' });
  assert.equal(store.load().signupEmail, 'friend@example.com');
  assert.deepEqual(store.reset(), EMPTY_STATE);
});

