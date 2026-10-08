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

function photoMarkup(photo, label) {
  return `
    <figure class="comparison-card">
      <span>${label}</span>
      <img src="${photo.src}" alt="${photo.alt}">
      <figcaption>${photo.credit} · <a href="${photo.sourceUrl}" target="_blank" rel="noreferrer">原始報導</a></figcaption>
    </figure>
  `;
}

export function createStoryContentController(root, { notebookPages = [], places = [], reporterPhoto } = {}) {
  const notebook = root.querySelector('[data-notebook-pages]');
  const noteCount = root.querySelector('[data-note-count]');
  const previousNote = root.querySelector('[data-note-prev]');
  const nextNote = root.querySelector('[data-note-next]');
  const placeList = root.querySelector('[data-place-list]');
  const placePanel = root.querySelector('[data-place-panel]');
  const photoFlip = root.querySelector('[data-photo-flip]');
  let noteIndex = 0;
  let placeId = places[0]?.id;

  function renderNote() {
    const page = notebookPages[noteIndex];
    if (!notebook || !page) return;
    notebook.innerHTML = `<article><p class="eyebrow">${page.eyebrow}</p><h3>${page.title}</h3><p>${page.body}</p></article>`;
    noteCount.textContent = `${noteIndex + 1} / ${notebookPages.length}`;
    previousNote.disabled = noteIndex === 0;
    nextNote.disabled = noteIndex === notebookPages.length - 1;
  }

  function renderPlace() {
    const place = places.find((item) => item.id === placeId) ?? places[0];
    if (!placePanel || !place) return;
    for (const button of placeList.querySelectorAll('button')) {
      const selected = button.dataset.placeId === place.id;
      button.setAttribute('aria-selected', String(selected));
      button.classList.toggle('is-selected', selected);
    }
    placePanel.innerHTML = `
      <header><p class="eyebrow">${place.era}</p><h3>${place.name}</h3><p>${place.summary}</p></header>
      <div class="comparison-grid">${photoMarkup(place.before, '那時')}${photoMarkup(place.after, '現在')}</div>
      <blockquote>${place.note}</blockquote>
    `;
  }

  for (const place of places) {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.dataset.placeId = place.id;
    button.textContent = place.name;
    button.addEventListener('click', () => {
      placeId = place.id;
      renderPlace();
    });
    placeList?.append(button);
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
    photoFlip.setAttribute('aria-label', flipped ? '翻回照片正面' : '翻到照片背面查看筆記');
  });

  renderNote();
  renderPlace();
  return { renderNote, renderPlace };
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
