import { animateLift } from './lift.js';

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

const DOODLES = {
  crown: '<span class="note-doodle note-doodle--crown" aria-hidden="true">♛<i>✓</i><i>✗</i></span>',
  ticket: '<span class="note-doodle note-doodle--ticket" aria-hidden="true">BOARDING PASS<i>✈</i></span>',
};

function renderNotePage(page) {
  return `
    <article class="note-page${page.sparse ? ' note-page--sparse' : ''}">
      <span class="note-tape" aria-hidden="true"></span>
      ${DOODLES[page.doodle] ?? ''}
      <p class="note-date">${page.date}</p>
      ${page.title ? `<h3>${page.title}</h3>` : ''}
      ${page.lines.map((line) => (line ? `<p>${line}</p>` : '<p class="note-gap" aria-hidden="true"></p>')).join('')}
      ${page.margin ? `<p class="note-margin">${page.margin}</p>` : ''}
    </article>
  `;
}

function stackCardMarkup(photo) {
  const media = photo.placeholder
    ? `<span class="stack-card__placeholder">${photo.label}</span>`
    : `<img src="${photo.src}" alt="${photo.alt}">`;
  return `
    <span class="stack-card__inner">
      <span class="stack-card__face stack-card__face--front">${media}<span class="stack-card__caption">${photo.date}｜${photo.place}</span></span>
      <span class="stack-card__face stack-card__face--back">
        <span class="stack-card__date">${photo.date}</span>
        <span class="stack-card__note">${photo.note || '（背面沒有寫字）'}</span>
        <span class="stack-card__place">${photo.place}</span>
      </span>
    </span>
  `;
}

export function createStoryContentController(root, { notebookPages = [], photos = [], reducedMotion = false } = {}) {
  const book = root.querySelector('[data-journal]');
  const cover = root.querySelector('[data-journal-cover]');
  const leaf = root.querySelector('[data-journal-leaf]');
  const notebook = root.querySelector('[data-notebook-pages]');
  const noteCount = root.querySelector('[data-note-count]');
  const previousNote = root.querySelector('[data-note-prev]');
  const nextNote = root.querySelector('[data-note-next]');
  const stack = root.querySelector('[data-photo-stack]');
  const photoMeta = root.querySelector('[data-photo-meta]');
  const photoCount = root.querySelector('[data-photo-count]');
  let noteIndex = 0;
  let photoIndex = 0;
  let turning = false;

  function setBookOpen(open) {
    if (!book) return;
    book.dataset.open = String(open);
    cover.setAttribute('aria-expanded', String(open));
    cover.setAttribute('aria-label', open ? '闔上筆記本' : '翻開筆記本');
    for (const button of [previousNote, nextNote]) button.tabIndex = open ? 0 : -1;
  }

  cover?.addEventListener('click', () => {
    const open = book.dataset.open !== 'true';
    setBookOpen(open);
    if (open) nextNote.focus({ preventScroll: true });
  });

  function renderNote() {
    const page = notebookPages[noteIndex];
    if (!notebook || !page) return;
    notebook.innerHTML = renderNotePage(page);
    noteCount.textContent = `${noteIndex + 1} / ${notebookPages.length}`;
    previousNote.disabled = noteIndex === 0;
    nextNote.disabled = noteIndex === notebookPages.length - 1;
    // 翻過第一頁後，左邊露出前一頁的背面。
    if (book) book.dataset.turned = String(noteIndex > 0);
    // 讀到思遠出發前的最後一頁，才算翻閱完筆記。
    if (noteIndex === notebookPages.length - 1) dispatch(notebook, 'story:notebook-finished');
  }

  // 翻頁：往後翻時，舊的一頁沿著書背翻到左邊；往前翻時，前一頁從左邊翻回來。
  function turnPage(step) {
    const next = Math.min(notebookPages.length - 1, Math.max(0, noteIndex + step));
    if (next === noteIndex || turning) return;
    if (reducedMotion || !leaf?.animate) {
      noteIndex = next;
      renderNote();
      return;
    }
    const forward = step > 0;
    const leaving = notebook.innerHTML;
    noteIndex = next;
    leaf.querySelector('[data-leaf-front]').innerHTML = forward ? leaving : renderNotePage(notebookPages[noteIndex]);
    leaf.hidden = false;
    turning = true;
    if (forward) renderNote();
    const frames = [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }];
    leaf.animate(forward ? frames : frames.reverse(), { duration: 720, easing: 'cubic-bezier(0.45, 0.05, 0.3, 1)' })
      .finished.catch(() => {}).then(() => {
        leaf.hidden = true;
        turning = false;
        if (!forward) renderNote();
      });
  }

  previousNote?.addEventListener('click', () => turnPage(-1));
  nextNote?.addEventListener('click', () => turnPage(1));

  // 點右頁翻下一頁、點左頁翻上一頁；手機只看得到一頁，點左邊三分之一往前翻。
  const page = root.querySelector('.journal__page');
  const verso = root.querySelector('.journal__verso');
  page?.addEventListener('click', (event) => {
    if (book.dataset.open !== 'true') return;
    const rect = page.getBoundingClientRect();
    const singlePage = getComputedStyle(verso).visibility !== 'visible' && noteIndex > 0 && window.matchMedia('(max-width: 720px)').matches;
    turnPage(singlePage && event.clientX - rect.left < rect.width / 3 ? -1 : 1);
  });
  verso?.addEventListener('click', () => {
    if (book.dataset.open === 'true') turnPage(-1);
  });

  const cards = photos.map((photo, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'stack-card';
    card.dataset.index = String(index);
    card.innerHTML = stackCardMarkup(photo);
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-label', cardLabel(flipped));
      dispatch(stack, 'story:photo-viewed');
    });
    stack?.append(card);
    return card;
  });

  function cardLabel(flipped) {
    return `第 ${photoIndex + 1} 張，共 ${photos.length} 張。點一下${flipped ? '翻回正面' : '翻到背面'}`;
  }

  function renderStack() {
    const photo = photos[photoIndex];
    if (!photo) return;
    cards.forEach((card, index) => {
      const depth = (index - photoIndex + photos.length) % photos.length;
      card.dataset.depth = String(depth);
      card.style.zIndex = String(photos.length - depth);
      card.classList.remove('is-flipped');
      const isTop = depth === 0;
      card.tabIndex = isTop ? 0 : -1;
      card.setAttribute('aria-hidden', String(!isTop));
      card.setAttribute('aria-label', isTop ? cardLabel(false) : '');
    });
    if (photoMeta) photoMeta.textContent = `${photo.date}｜${photo.place}`;
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

  setBookOpen(false);
  renderNote();
  renderStack();
  return { renderNote, showPhoto, setBookOpen };
}

function dispatch(root, name, detail = {}) {
  root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export function createDeskController(root, store, { reducedMotion = false } = {}) {
  const buttons = [...root.querySelectorAll('[data-desk-object]')];
  const dialogs = [...document.querySelectorAll('[data-object-dialog]')];
  const closing = new Set();
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

  // 動畫的起點／終點永遠是桌上的那個物件，即使是從 CHECK LIST 打開的。
  function sourceFor(id) {
    const button = buttons.find((item) => item.dataset.deskObject === id);
    return button?.querySelector('.desk-object__visual') ?? button;
  }

  async function closeObject(id) {
    const dialog = dialogs.find((item) => item.dataset.objectDialog === id);
    if (!dialog?.open || closing.has(id)) return;
    closing.add(id);
    const animations = await animateLift(dialog, sourceFor(id), { closing: true, reducedMotion });
    dialog.close();
    animations.forEach((animation) => animation.cancel());
    closing.delete(id);
  }

  function openObject(id, trigger = null) {
    const dialog = dialogs.find((item) => item.dataset.objectDialog === id);
    if (!dialog) return false;
    activeTrigger = trigger ?? buttons.find((button) => button.dataset.deskObject === id);
    if (!dialog.open) {
      dialog.showModal();
      animateLift(dialog, sourceFor(id), { reducedMotion });
    }
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
    // 按 Esc 也要播放「放回桌上」的動畫。
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeObject(id);
    });
    dialog.addEventListener('click', (event) => {
      // 點黑色底版或物件旁的空白（版面容器）就放回桌上；點到物件本身不算。
      if (event.target === dialog || event.target.hasAttribute?.('data-stage-backdrop')) closeObject(id);
    });
    for (const close of dialog.querySelectorAll('[data-close-dialog]')) {
      close.addEventListener('click', () => closeObject(id));
    }
  }

  updateDoneUI();
  return { openObject, closeObject, markDone, reset };
}
