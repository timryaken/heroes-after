// 桌上的小東西（檯燈、窗外、咖啡杯、書架）與前方的記者證：點了跳出一小段手寫文字，增加情境。
// 小東西的位置寫在 styles/desk.css 的 .desk-prop--*；文字在 js/data.js 的 DESK_PROPS、PRESS_BADGE。
const SHOW_MS = 4200;

export function createDeskProps(root, { props = [], badge } = {}) {
  const stage = root.querySelector('[data-desk-stage]');
  const bubble = root.querySelector('[data-prop-note]');
  const badgeButton = root.querySelector('[data-press-badge]');
  let timer = 0;
  let current = null;

  function hide() {
    window.clearTimeout(timer);
    bubble.hidden = true;
    current = null;
  }

  // 文字泡泡固定在畫面上，出現在被點的東西上方，並限制在畫面內。
  function show(trigger, text) {
    if (current === trigger && !bubble.hidden) {
      hide();
      return;
    }
    current = trigger;
    bubble.textContent = text;
    bubble.hidden = false;
    const rect = trigger.getBoundingClientRect();
    const half = bubble.offsetWidth / 2 + 12;
    const x = Math.min(window.innerWidth - half, Math.max(half, rect.left + rect.width / 2));
    const y = Math.max(bubble.offsetHeight + 16, rect.top + rect.height * 0.35);
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    window.clearTimeout(timer);
    timer = window.setTimeout(hide, SHOW_MS);
  }

  for (const prop of props) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `desk-object desk-prop desk-prop--${prop.id}`;
    button.dataset.deskProp = prop.id;
    button.setAttribute('aria-label', `${prop.label}：${prop.note}`);
    button.innerHTML = '<span class="desk-object__visual" aria-hidden="true"></span>';
    button.addEventListener('click', () => show(button, prop.note));
    stage.append(button);
  }

  if (badge && badgeButton) {
    const image = badgeButton.querySelector('img');
    image.src = badge.src;
    image.alt = badge.alt;
    badgeButton.querySelector('[data-badge-name]').textContent = badge.name;
    badgeButton.querySelector('[data-badge-role]').textContent = badge.role;
    badgeButton.querySelector('[data-badge-number]').textContent = badge.number;
    badgeButton.setAttribute('aria-label', `${badge.name}的記者證：${badge.note}`);
    badgeButton.addEventListener('click', () => show(badgeButton.querySelector('.press-badge__card'), badge.note));
  }

  // 拖曳桌面或點其他地方時，泡泡就收起來。
  root.querySelector('[data-desk-viewport]').addEventListener('scroll', hide, { passive: true });
  document.addEventListener('click', (event) => {
    if (!bubble.hidden && !event.target.closest('[data-desk-prop], [data-press-badge]')) hide();
  });

  return { hide };
}
