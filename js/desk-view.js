// 滿版桌面：總編的便條（可收合）與拖曳平移桌景。觸控用瀏覽器原生捲動，滑鼠與觸控筆用拖曳。
const DRAG_THRESHOLD = 6;

export function createDeskView(root) {
  const note = root.querySelector('[data-editor-note]');
  const openNote = root.querySelector('[data-editor-note-open]');
  const closeNote = root.querySelector('[data-editor-note-close]');
  const viewport = root.querySelector('[data-desk-viewport]');
  const hint = root.querySelector('[data-drag-hint]');
  let drag = null;
  let suppressClick = false;
  let ignoreScrollUntil = 0;

  function setNoteOpen(open, { focus = false } = {}) {
    note.classList.toggle('is-collapsed', !open);
    openNote.setAttribute('aria-expanded', String(open));
    if (focus) (open ? closeNote : openNote).focus({ preventScroll: true });
  }

  openNote.addEventListener('click', () => setNoteOpen(openNote.getAttribute('aria-expanded') !== 'true', { focus: true }));
  closeNote.addEventListener('click', () => setNoteOpen(false, { focus: true }));

  function canPan() {
    return viewport.scrollWidth > viewport.clientWidth + 8 || viewport.scrollHeight > viewport.clientHeight + 8;
  }

  function center() {
    ignoreScrollUntil = performance.now() + 400;
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
    viewport.scrollTop = (viewport.scrollHeight - viewport.clientHeight) / 2;
    hint.hidden = !canPan();
  }

  viewport.addEventListener('scroll', () => {
    // 玩家第一次自己移動桌面後，就收起拖曳提示；程式置中造成的捲動不算。
    if (performance.now() > ignoreScrollUntil) hint.hidden = true;
  }, { passive: true });

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || event.button !== 0 || !canPan()) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop, moved: false };
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
    viewport.scrollLeft = drag.left - dx;
    viewport.scrollTop = drag.top - dy;
  });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    suppressClick = drag.moved;
    viewport.classList.remove('is-dragging');
    drag = null;
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // 拖曳結束時不要順便打開放開位置的物件。
  viewport.addEventListener('click', (event) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  window.addEventListener('resize', () => {
    hint.hidden = hint.hidden || !canPan();
  });

  return {
    show() {
      setNoteOpen(true);
      requestAnimationFrame(center);
    },
    setNoteOpen,
  };
}
