export function checklistProgress(items, completed = []) {
  const done = items.filter(({ id }) => completed.includes(id)).map(({ id }) => id);
  return { done, ready: done.length === items.length };
}

// 總編 CHECK LIST：項目依桌上物件的完成狀態打勾，全部完成才解鎖「出發」。
export function createChecklistController(root, items, { onOpenItem, onDepart } = {}) {
  const list = root.querySelector('[data-checklist-items]');
  const progress = root.querySelector('[data-checklist-progress]');
  const toggle = root.querySelector('[data-checklist-toggle]');
  const depart = root.querySelector('[data-depart]');
  const departHint = root.querySelector('[data-depart-hint]');

  const buttons = items.map((item) => {
    const entry = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'checklist__item';
    button.dataset.checklistId = item.id;
    button.innerHTML = `
      <span class="checklist__box" aria-hidden="true"><svg class="checklist__tick" viewBox="0 0 24 24"><path d="M3 13.5c2.2 1.6 4 3.6 5.6 6.2C11.4 12.4 16 6.6 22 2.5"/></svg></span>
      <span><strong>${item.label}</strong><small>${item.hint}</small></span>
      <span class="visually-hidden" data-check-label></span>
    `;
    button.addEventListener('click', () => onOpenItem?.(item.id, button));
    entry.append(button);
    list?.append(entry);
    return button;
  });

  let shown = null;
  let latest = [];
  let waiting = false;
  let revealed = false;

  // 板夾一開始收在畫面外；第一次看完桌上的物件後才滑上來提醒。
  root.classList.add('is-away');
  root.inert = true;

  function reveal() {
    if (revealed) return;
    revealed = true;
    root.classList.remove('is-away');
    root.inert = false;
    setExpanded(true);
  }

  function render(done) {
    const ready = done.length === items.length;
    for (const button of buttons) {
      const checked = done.includes(button.dataset.checklistId);
      button.classList.toggle('is-checked', checked);
      button.querySelector('[data-check-label]').textContent = checked ? '（已確認）' : '（尚未確認）';
    }
    if (progress) progress.textContent = `${done.length} / ${items.length}`;
    if (depart) depart.disabled = !ready;
    if (departHint) departHint.textContent = ready ? '資料都確認好了，按下出發' : '前三項確認後才能出發';
    root.classList.toggle('is-ready', ready);
    shown = done;
  }

  // 新完成一項時，等物件放回桌上（對話框關掉）再把板夾拉上來，玩家才看得到紅筆打勾。
  function pop() {
    waiting = false;
    reveal();
    setExpanded(true);
    requestAnimationFrame(() => render(latest));
  }

  function update(completed = []) {
    const { done, ready } = checklistProgress(items, completed);
    latest = done;
    const fresh = shown ? done.filter((id) => !shown.includes(id)) : [];
    if (!fresh.length) {
      if (!waiting) render(done);
      return { done, ready };
    }
    if (waiting) return { done, ready };
    const openDialog = document.querySelector('dialog[open]');
    if (!openDialog) {
      pop();
      return { done, ready };
    }
    waiting = true;
    openDialog.addEventListener('close', () => window.setTimeout(pop, 180), { once: true });
    return { done, ready };
  }

  function setExpanded(value) {
    toggle?.setAttribute('aria-expanded', String(value));
    root.classList.toggle('is-collapsed', !value);
  }

  toggle?.addEventListener('click', () => setExpanded(toggle.getAttribute('aria-expanded') !== 'true'));
  depart?.addEventListener('click', () => onDepart?.(depart));
  // 點桌面（桌上的物件或空白處）時，板夾就自己收下去；前導、對話框、便條和控制列的點擊不算。
  document.addEventListener('click', (event) => {
    if (toggle?.getAttribute('aria-expanded') === 'true' && event.target.closest?.('[data-desk-viewport]')) setExpanded(false);
  });

  // 手機版預設收合，只露出進度列，避免擋住桌上的物件。
  if (window.matchMedia?.('(max-width: 720px)').matches) setExpanded(false);

  return { update, setExpanded, reveal };
}
