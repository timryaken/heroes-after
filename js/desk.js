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

function stackCardMarkup(photo) {
  const media = photo.placeholder
    ? `<span class="stack-card__placeholder">${photo.label}</span>`
    : `<img src="${photo.src}" alt="${photo.alt}">`;
  return `${media}<span class="stack-card__caption">${photo.date}｜${photo.place}</span>`;
}

export function createStoryContentController(root, { notebookPages = [], photos = [] } = {}) {
  const notebook = root.querySelector('[data-notebook-pages]');
  const noteCount = root.querySelector('[data-note-count]');
  const previousNote = root.querySelector('[data-note-prev]');
  const nextNote = root.querySelector('[data-note-next]');
  const signupForm = root.querySelector('[data-signup-form]');
  const stack = root.querySelector('[data-photo-stack]');
  const photoMeta = root.querySelector('[data-photo-meta]');
  const photoNote = root.querySelector('[data-photo-note]');
  const photoCount = root.querySelector('[data-photo-count]');
  let noteIndex = 0;
  let photoIndex = 0;

  function renderNote() {
    const page = notebookPages[noteIndex];
    if (!notebook || !page) return;
    notebook.innerHTML = renderNotePage(page);
    noteCount.textContent = `${noteIndex + 1} / ${notebookPages.length}`;
    previousNote.disabled = noteIndex === 0;
    nextNote.disabled = noteIndex === notebookPages.length - 1;
    // Email 直接寫在最後一頁（同行邀請）的橫線上。
    if (signupForm) signupForm.hidden = noteIndex !== notebookPages.length - 1;
  }

  previousNote?.addEventListener('click', () => {
    noteIndex = Math.max(0, noteIndex - 1);
    renderNote();
  });
  nextNote?.addEventListener('click', () => {
    noteIndex = Math.min(notebookPages.length - 1, noteIndex + 1);
    renderNote();
  });

  const cards = photos.map((photo, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'stack-card';
    card.dataset.index = String(index);
    card.innerHTML = stackCardMarkup(photo);
    card.addEventListener('click', () => showPhoto(photoIndex + 1));
    stack?.append(card);
    return card;
  });

  function renderStack() {
    const photo = photos[photoIndex];
    if (!photo) return;
    cards.forEach((card, index) => {
      const depth = (index - photoIndex + photos.length) % photos.length;
      card.dataset.depth = String(depth);
      card.style.zIndex = String(photos.length - depth);
      const isTop = depth === 0;
      card.tabIndex = isTop ? 0 : -1;
      card.setAttribute('aria-hidden', String(!isTop));
      card.setAttribute('aria-label', isTop ? `第 ${photoIndex + 1} 張，共 ${photos.length} 張。點一下換下一張` : '');
    });
    if (photoMeta) photoMeta.textContent = `${photo.date}｜${photo.place}`;
    if (photoNote) photoNote.textContent = photo.note;
    if (photoCount) photoCount.textContent = `${photoIndex + 1} / ${photos.length}`;
  }

  function showPhoto(nextIndex) {
    if (!photos.length) return;
    const leaving = cards[photoIndex];
    const forward = nextIndex > photoIndex;
    photoIndex = (nextIndex + photos.length) % photos.length;
    if (forward && leaving) {
      // 最上面那張先往旁邊滑出，再收到最底下。
      leaving.classList.add('is-leaving');
      window.setTimeout(() => {
        leaving.classList.remove('is-leaving');
        renderStack();
      }, 260);
    } else {
      renderStack();
    }
    dispatch(stack, 'story:photo-viewed');
  }

  root.querySelector('[data-photo-prev]')?.addEventListener('click', () => showPhoto(photoIndex - 1));
  root.querySelector('[data-photo-next]')?.addEventListener('click', () => showPhoto(photoIndex + 1));

  renderNote();
  renderStack();
  return { renderNote, showPhoto };
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
