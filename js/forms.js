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

// 只剩「重設原型資料」：清掉這台裝置上的進度。
export function createFormsController(root, store) {
  const abortController = new AbortController();
  const { signal } = abortController;

  function reset() {
    store.reset();
    root.dispatchEvent(new CustomEvent('forms:reset', { bubbles: true }));
  }

  root.querySelector('[data-reset-prototype]')?.addEventListener('click', reset, { signal });

  return {
    reset,
    destroy() {
      abortController.abort();
    },
  };
}
