const DEFAULT_KEY = 'heroes-after-prototype';

export const EMPTY_PROTOTYPE_STATE = Object.freeze({
  role: '',
  explored: [],
  memory: '',
  wish: '',
  signupEmail: '',
});

function freshState() {
  return { ...EMPTY_PROTOTYPE_STATE, explored: [] };
}

function normalizeState(value) {
  const state = freshState();
  if (!value || typeof value !== 'object') return state;

  for (const key of ['role', 'memory', 'wish', 'signupEmail']) {
    if (typeof value[key] === 'string') state[key] = value[key];
  }
  if (Array.isArray(value.explored)) {
    state.explored = [...new Set(value.explored.filter((item) => typeof item === 'string'))];
  }
  return state;
}

export function createPrototypeStore(storage, key = DEFAULT_KEY) {
  let memory = freshState();
  let canPersist = true;

  try {
    storage.getItem(key);
  } catch {
    canPersist = false;
  }

  function load() {
    if (!canPersist) return normalizeState(memory);
    try {
      const raw = storage.getItem(key);
      memory = raw ? normalizeState(JSON.parse(raw)) : freshState();
    } catch {
      memory = freshState();
    }
    return normalizeState(memory);
  }

  function save(update) {
    memory = normalizeState({ ...load(), ...update });
    if (canPersist) {
      try {
        storage.setItem(key, JSON.stringify(memory));
      } catch {
        canPersist = false;
      }
    }
    return normalizeState(memory);
  }

  function reset() {
    memory = freshState();
    if (canPersist) {
      try {
        storage.removeItem(key);
      } catch {
        canPersist = false;
      }
    }
    return normalizeState(memory);
  }

  return {
    load,
    save,
    reset,
    get persistent() {
      return canPersist;
    },
  };
}

