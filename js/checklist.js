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
      <span class="checklist__box" aria-hidden="true"></span>
      <span><strong>${item.label}</strong><small>${item.hint}</small></span>
      <span class="visually-hidden" data-check-label></span>
    `;
    button.addEventListener('click', () => onOpenItem?.(item.id, button));
    entry.append(button);
    list?.append(entry);
    return button;
  });

  function update(completed = []) {
    const { done, ready } = checklistProgress(items, completed);
    for (const button of buttons) {
      const checked = done.includes(button.dataset.checklistId);
      button.classList.toggle('is-checked', checked);
      button.querySelector('[data-check-label]').textContent = checked ? '（已確認）' : '（尚未確認）';
    }
    if (progress) progress.textContent = `${done.length} / ${items.length}`;
    if (depart) depart.disabled = !ready;
    if (departHint) departHint.textContent = ready ? '資料都確認好了，按下出發' : '前三項確認後才能出發';
    root.classList.toggle('is-ready', ready);
    return { done, ready };
  }

  function setExpanded(value) {
    toggle?.setAttribute('aria-expanded', String(value));
    root.classList.toggle('is-collapsed', !value);
  }

  toggle?.addEventListener('click', () => setExpanded(toggle.getAttribute('aria-expanded') !== 'true'));
  depart?.addEventListener('click', () => onDepart?.(depart));

  // 手機版預設收合，只露出進度列，避免擋住桌上的物件。
  if (window.matchMedia?.('(max-width: 720px)').matches) setExpanded(false);

  return { update, setExpanded };
}
