import { isValidEmail } from './core.js';

const LOCAL_ONLY_NOTICE = '已暫存在這台裝置；資料不會送出。';

export function rolePrompt(roles, roleId) {
  return (roles.find((role) => role.id === roleId) ?? roles.at(-1))?.wishPrompt ?? '';
}

export function formDraftFromState(state = {}) {
  return {
    memory: typeof state.memory === 'string' ? state.memory : '',
    wish: typeof state.wish === 'string' ? state.wish : '',
    signupEmail: typeof state.signupEmail === 'string' ? state.signupEmail : '',
  };
}

function announce(target, message, kind = 'success') {
  if (!target) return;
  target.textContent = message;
  target.dataset.kind = kind;
  target.hidden = false;
  if (kind === 'error') target.focus({ preventScroll: true });
}

export function createFormsController(root, store) {
  const abortController = new AbortController();
  const { signal } = abortController;
  const signupForm = root.querySelector('[data-signup-form]');

  function hydrate() {
    const draft = formDraftFromState(store.load());
    if (signupForm) signupForm.elements.email.value = draft.signupEmail;
  }

  signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const signupEmail = signupForm.elements.email.value.trim();
    const status = signupForm.querySelector('[data-form-status]');
    if (!isValidEmail(signupEmail)) {
      announce(status, '請輸入有效的 Email，例如 name@example.com。', 'error');
      return;
    }
    store.save({ signupEmail });
    announce(status, `已記下，正式遊戲開放時通知你。${LOCAL_ONLY_NOTICE}`);
    root.dispatchEvent(new CustomEvent('forms:email-saved', { bubbles: true }));
  }, { signal });

  function reset() {
    store.reset();
    signupForm?.reset();
    const status = signupForm?.querySelector('[data-form-status]');
    if (status) status.hidden = true;
    hydrate();
    root.dispatchEvent(new CustomEvent('forms:reset', { bubbles: true }));
  }

  root.querySelector('[data-reset-prototype]')?.addEventListener('click', reset, { signal });

  hydrate();
  return {
    hydrate,
    reset,
    destroy() {
      abortController.abort();
    },
  };
}
