export const DESK_OBJECT_IDS = Object.freeze([
  'computer',
  'notebook',
  'map',
  'speaker',
  'photo',
  'wish',
]);

export function mergeExplored(existing = [], nextId) {
  const selected = new Set([...existing, nextId]);
  return DESK_OBJECT_IDS.filter((id) => selected.has(id));
}

function dispatch(root, name, detail = {}) {
  root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export function createDeskController(root, store) {
  const buttons = [...root.querySelectorAll('[data-desk-object]')];
  const dialogs = [...document.querySelectorAll('[data-object-dialog]')];
  const statusItems = [...root.querySelectorAll('[data-object-status]')];
  let activeTrigger = null;

  function updateExploredUI(explored = store.load().explored) {
    for (const button of buttons) {
      const visited = explored.includes(button.dataset.deskObject);
      button.classList.toggle('is-explored', visited);
      button.dataset.explored = String(visited);
    }
    for (const item of statusItems) {
      const visited = explored.includes(item.dataset.objectStatus);
      item.classList.toggle('is-explored', visited);
      item.querySelector('[data-status-label]').textContent = visited ? '已查看' : '未查看';
    }
  }

  function markExplored(id) {
    const explored = mergeExplored(store.load().explored, id);
    store.save({ explored });
    updateExploredUI(explored);
    return explored;
  }

  function closeObject(id, { restoreFocus = true } = {}) {
    const dialog = dialogs.find((item) => item.dataset.objectDialog === id);
    if (dialog?.open) dialog.close();
    if (restoreFocus && activeTrigger?.isConnected) activeTrigger.focus({ preventScroll: true });
  }

  function openObject(id, trigger = null) {
    const dialog = dialogs.find((item) => item.dataset.objectDialog === id);
    if (!dialog) return false;
    activeTrigger = trigger ?? buttons.find((button) => button.dataset.deskObject === id);
    markExplored(id);
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => {
      const target = dialog.querySelector('[autofocus], button, a, input, textarea, select');
      target?.focus({ preventScroll: true });
    });
    dispatch(root, 'desk:object-opened', { id });
    return true;
  }

  function reset() {
    store.save({ explored: [] });
    updateExploredUI([]);
    dispatch(root, 'desk:reset');
  }

  for (const button of buttons) {
    button.addEventListener('click', () => openObject(button.dataset.deskObject, button));
  }

  for (const dialog of dialogs) {
    const id = dialog.dataset.objectDialog;
    dialog.addEventListener('close', () => {
      if (activeTrigger?.isConnected) activeTrigger.focus({ preventScroll: true });
      dispatch(root, 'desk:object-closed', { id });
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeObject(id);
    });
    for (const close of dialog.querySelectorAll('[data-close-dialog]')) {
      close.addEventListener('click', () => closeObject(id));
    }
  }

  updateExploredUI();
  return { openObject, closeObject, markExplored, reset };
}
