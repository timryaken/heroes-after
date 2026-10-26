// 桌上的小東西（檯燈、窗外、咖啡杯、書架）與掛在軟木板下的記者證：點了跳出一小段手寫文字，增加情境。
// 小東西的位置寫在 styles/desk.css 的 .desk-prop--*；文字在 js/data.js 的 DESK_PROPS、PRESS_BADGE。
// 每個小東西有一顆較小、較暗的光點，閃爍節奏和主要物件錯開；點過一次光點就熄掉。
const SHOW_MS = 4200;

export function createDeskProps(root, { props = [], badge } = {}) {
  const stage = root.querySelector('[data-desk-stage]');
  const bubble = root.querySelector('[data-prop-note]');
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

  // 記者證已經畫在桌景裡，當成一個小東西處理
  const items = badge ? [...props, { id: 'badge', label: `${badge.name}的記者證`, note: badge.note }] : props;
  items.forEach((prop, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `desk-object desk-prop desk-prop--${prop.id}`;
    button.dataset.deskProp = prop.id;
    button.setAttribute('aria-label', `${prop.label}：${prop.note}`);
    button.style.setProperty('--glow-delay', `${-0.9 - index * 0.7}s`);
    button.innerHTML = '<span class="object-glow object-glow--minor" aria-hidden="true"></span><span class="desk-object__visual" aria-hidden="true"></span>';
    button.addEventListener('click', () => {
      button.classList.add('is-seen');
      show(button, prop.note);
    });
    stage.append(button);
  });

  // 拖曳桌面或點其他地方時，泡泡就收起來。
  root.querySelector('[data-desk-viewport]').addEventListener('scroll', hide, { passive: true });
  document.addEventListener('click', (event) => {
    if (!bubble.hidden && !event.target.closest('[data-desk-prop]')) hide();
  });

  return { hide };
}
