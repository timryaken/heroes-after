// 除錯紀錄（黑盒子）：網址帶 ?debug 才會啟動，同一個分頁之後都會持續記錄。
// 每一步寫進 sessionStorage，就算頁面當掉重新載入，下一次載入時也看得到最後做到哪一步。
const FLAG_KEY = 'heroes-after-debug';
const LOG_KEY = 'heroes-after-debug-log';
const MAX_LINES = 80;

function storage() {
  try {
    return globalThis.sessionStorage;
  } catch {
    return null;
  }
}

function enabled() {
  const store = storage();
  if (!store) return false;
  if (globalThis.location?.search.includes('debug')) store.setItem(FLAG_KEY, '1');
  return store.getItem(FLAG_KEY) === '1';
}

const active = typeof window !== 'undefined' && enabled();

function readLog() {
  try {
    return JSON.parse(storage().getItem(LOG_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function trace(message) {
  if (!active) return;
  const stamp = new Date().toISOString().slice(11, 23);
  const log = readLog();
  log.push(`${stamp} ${message}`);
  try {
    storage().setItem(LOG_KEY, JSON.stringify(log.slice(-MAX_LINES)));
  } catch {
    // 存不下就算了，除錯紀錄不能影響網站本身。
  }
}

function render(previous) {
  const box = document.createElement('section');
  box.setAttribute('style', 'position:fixed;z-index:2147483647;left:6px;right:6px;bottom:6px;max-height:42vh;overflow:auto;padding:8px 10px;background:rgba(0,0,0,.88);color:#b9ff8a;font:11px/1.45 ui-monospace,Menlo,monospace;border:1px solid #b9ff8a;white-space:pre-wrap;');
  const nav = performance.getEntriesByType?.('navigation')[0];
  box.textContent = [
    `【除錯紀錄】這次載入方式：${nav?.type ?? '不明'}　網址：${location.pathname}${location.search}`,
    `瀏覽器：${navigator.userAgent}`,
    '── 上一次載入前的最後紀錄 ──',
    ...(previous.length ? previous.slice(-30) : ['（沒有紀錄）']),
  ].join('\n');
  const clear = document.createElement('button');
  clear.textContent = '清除紀錄';
  clear.setAttribute('style', 'display:block;margin-top:6px;padding:4px 10px;');
  clear.addEventListener('click', () => {
    storage().setItem(LOG_KEY, '[]');
    box.remove();
  });
  box.append(clear);
  document.body.append(box);
}

if (active) {
  const previous = readLog();
  storage().setItem(LOG_KEY, '[]');
  window.addEventListener('DOMContentLoaded', () => render(previous));
  const nav = performance.getEntriesByType?.('navigation')[0];
  trace(`載入 type=${nav?.type ?? '?'} url=${location.pathname}${location.search}`);
  window.addEventListener('error', (event) => trace(`錯誤：${event.message} @${event.filename?.split('/').pop()}:${event.lineno}`));
  window.addEventListener('unhandledrejection', (event) => trace(`未處理的錯誤：${event.reason?.message ?? event.reason}`));
  window.addEventListener('beforeunload', () => trace('beforeunload（頁面要離開）'));
  window.addEventListener('pagehide', (event) => trace(`pagehide persisted=${event.persisted}`));
  document.addEventListener('visibilitychange', () => trace(`visibility=${document.visibilityState}`));
  document.addEventListener('submit', (event) => trace(`表單送出：${event.target.className || event.target.tagName}`), true);
  document.addEventListener('click', (event) => {
    const target = event.target.closest?.('button, a') ?? event.target;
    trace(`點擊：${target.tagName}.${String(target.className).split(' ')[0]}${target.getAttribute?.('href') ? ` href=${target.getAttribute('href')}` : ''}`);
  }, true);
}
