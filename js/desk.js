export const DESK_OBJECT_IDS = Object.freeze([
  'computer',
  'notebook',
  'map',
  'speaker',
  'photo',
]);

export function mergeCompleted(existing = [], nextId) {
  const selected = new Set([...existing, nextId]);
  return DESK_OBJECT_IDS.filter((id) => selected.has(id));
}

function renderNotePage(page) {
  return `
    <article class="note-page">
      <span class="note-tape" aria-hidden="true"></span>
      <p class="note-date">${page.date}</p>
      <h3>${page.title}</h3>
      ${page.lines.map((line) => `<p>${line}</p>`).join('')}
      <p class="note-margin">${page.margin}</p>
    </article>
  `;
}

export function createStoryContentController(root, { notebookPages = [], reporterPhoto } = {}) {
  const notebook = root.querySelector('[data-notebook-pages]');
  const noteCount = root.querySelector('[data-note-count]');
  const previousNote = root.querySelector('[data-note-prev]');
  const nextNote = root.querySelector('[data-note-next]');
  const photoFlip = root.querySelector('[data-photo-flip]');
  let noteIndex = 0;

  function renderNote() {
    const page = notebookPages[noteIndex];
    if (!notebook || !page) return;
    notebook.innerHTML = renderNotePage(page);
    noteCount.textContent = `${noteIndex + 1} / ${notebookPages.length}`;
    previousNote.disabled = noteIndex === 0;
    nextNote.disabled = noteIndex === notebookPages.length - 1;
  }

  previousNote?.addEventListener('click', () => {
    noteIndex = Math.max(0, noteIndex - 1);
    renderNote();
  });
  nextNote?.addEventListener('click', () => {
    noteIndex = Math.min(notebookPages.length - 1, noteIndex + 1);
    renderNote();
  });

  if (reporterPhoto) {
    const note = root.querySelector('[data-photo-note]');
    if (note) note.textContent = reporterPhoto.backNote;
  }
  photoFlip?.addEventListener('click', () => {
    const flipped = photoFlip.classList.toggle('is-flipped');
    photoFlip.setAttribute('aria-pressed', String(flipped));
    photoFlip.setAttribute('aria-label', flipped ? '翻回照片正面' : '翻到照片背面');
    dispatch(photoFlip, 'story:photo-flipped');
  });

  renderNote();
  return { renderNote };
}

function dispatch(root, name, detail = {}) {
  root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export function createDeskController(root, store) {
  const buttons = [...root.querySelectorAll('[data-desk-object]')];
  const dialogs = [...document.querySelectorAll('[data-object-dialog]')];
  let activeTrigger = null;

  function updateDoneUI(completed = store.load().completed) {
    for (const button of buttons) {
      const done = completed.includes(button.dataset.deskObject);
      button.classList.toggle('is-done', done);
      const label = button.querySelector('[data-done-label]');
      if (label) label.textContent = done ? '（已完成）' : '';
    }
  }

  function markDone(id) {
    const completed = mergeCompleted(store.load().completed, id);
    store.save({ completed });
    updateDoneUI(completed);
    return completed;
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
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => {
      const target = dialog.querySelector('[autofocus], button, a, input, textarea, select');
      target?.focus({ preventScroll: true });
    });
    dispatch(root, 'desk:object-opened', { id });
    return true;
  }

  function reset() {
    store.save({ completed: [], listened: [] });
    updateDoneUI([]);
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

  updateDoneUI();
  return { openObject, closeObject, markDone, reset };
}
