import { isValidEmail, validateImageFile } from './core.js';

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

export function createFormsController(root, store, { roles = [] } = {}) {
  const abortController = new AbortController();
  const { signal } = abortController;
  const memoryForm = root.querySelector('[data-memory-form]');
  const wishForm = root.querySelector('[data-wish-form]');
  const signupForm = root.querySelector('[data-signup-form]');
  const fileInput = root.querySelector('[data-memory-file]');
  const preview = root.querySelector('[data-memory-preview]');
  const wishPrompt = root.querySelector('[data-wish-prompt]');
  let previewUrl = '';

  function revokePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    if (preview) {
      preview.removeAttribute('src');
      preview.hidden = true;
    }
  }

  function hydrate() {
    const state = store.load();
    const draft = formDraftFromState(state);
    if (memoryForm) memoryForm.elements.memory.value = draft.memory;
    if (wishForm) wishForm.elements.wish.value = draft.wish;
    if (signupForm) signupForm.elements.email.value = draft.signupEmail;
    if (wishPrompt) wishPrompt.textContent = rolePrompt(roles, state.role);
  }

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    const status = memoryForm.querySelector('[data-form-status]');
    revokePreview();
    if (!file) return;
    const result = validateImageFile(file);
    if (!result.ok) {
      announce(status, result.message, 'error');
      fileInput.value = '';
      return;
    }
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.alt = `即將暫存的照片預覽：${file.name}`;
    preview.hidden = false;
    announce(status, `已選取 ${file.name}，照片只供這次預覽，不會上傳。`);
  }, { signal });

  memoryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const memory = memoryForm.elements.memory.value.trim();
    const status = memoryForm.querySelector('[data-form-status]');
    if (!memory && !fileInput.files?.length) {
      announce(status, '請留下一段文字，或選擇一張照片。', 'error');
      return;
    }
    store.save({ memory });
    announce(status, LOCAL_ONLY_NOTICE);
    root.dispatchEvent(new CustomEvent('forms:posted', { bubbles: true }));
  }, { signal });

  signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const signupEmail = signupForm.elements.email.value.trim();
    const status = signupForm.querySelector('[data-form-status]');
    if (!isValidEmail(signupEmail)) {
      announce(status, '請輸入有效的 Email，例如 name@example.com。', 'error');
      return;
    }
    store.save({ signupEmail });
    announce(status, `已記下同行意願。${LOCAL_ONLY_NOTICE}`);
    root.dispatchEvent(new CustomEvent('forms:email-saved', { bubbles: true }));
  }, { signal });

  wishForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const wish = wishForm.elements.wish.value.trim();
    const status = wishForm.querySelector('[data-form-status]');
    if (!wish) {
      announce(status, '先寫下一句想留給光復的話。', 'error');
      return;
    }
    store.save({ wish });
    announce(status, LOCAL_ONLY_NOTICE);
    root.dispatchEvent(new CustomEvent('forms:posted', { bubbles: true }));
  }, { signal });

  function reset() {
    revokePreview();
    store.reset();
    for (const form of [memoryForm, wishForm, signupForm]) {
      form?.reset();
      const status = form?.querySelector('[data-form-status]');
      if (status) status.hidden = true;
    }
    hydrate();
    root.dispatchEvent(new CustomEvent('forms:reset', { bubbles: true }));
  }

  root.querySelector('[data-reset-prototype]')?.addEventListener('click', reset, { signal });

  hydrate();
  return {
    hydrate,
    reset,
    destroy() {
      revokePreview();
      abortController.abort();
    },
  };
}
