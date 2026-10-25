import { BOARD_CONFIG } from './board-config.js';
import { escapeHtml, formatPaperDate, PUBLIC_BUCKET, UPLOAD_BUCKET } from './board-api.js';
import { ROLES } from './data.js';

// 留言審核頁：用 Supabase 的 Email 登入連結登入，只有 board_admins 名單裡的 Email 讀得到留言。
const SESSION_KEY = 'heroes-after-admin-session';
const url = BOARD_CONFIG.supabaseUrl.replace(/\/+$/, '');
const key = BOARD_CONFIG.publishableKey;
const notice = document.querySelector('[data-admin-notice]');
const loginSection = document.querySelector('[data-admin-login]');
const review = document.querySelector('[data-admin-review]');
const list = document.querySelector('[data-admin-list]');
const logout = document.querySelector('[data-admin-logout]');
const tabs = document.querySelector('[data-admin-tabs]');
const report = document.querySelector('[data-admin-report]');
let filter = 'pending';
let posts = [];
let feedback = [];
let activeTab = 'review';

const byline = (roleId) => ROLES.find(({ id }) => id === roleId)?.byline ?? roleId;

function say(message, kind = 'info') {
  notice.textContent = message;
  notice.dataset.kind = kind;
}

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
  } catch {
    return null;
  }
}

function saveSession(session) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // 無法保存時，這次分頁關掉就要重新登入。
  }
}

// 登入連結回來時，token 在網址的 # 後面；讀完就從網址列清掉。
function sessionFromHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const accessToken = params.get('access_token');
  if (params.get('error_description')) say(`登入失敗：${params.get('error_description')}`, 'error');
  if (!accessToken) return null;
  history.replaceState(null, '', location.pathname + location.search);
  const session = { accessToken, expiresAt: Date.now() + Number(params.get('expires_in') ?? 3600) * 1000 };
  saveSession(session);
  return session;
}

async function api(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const session = readSession();
  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      authorization: `Bearer ${session?.accessToken}`,
      ...(body && !(body instanceof Blob) ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    body: body && !(body instanceof Blob) ? JSON.stringify(body) : body,
  });
  if (response.status === 401) {
    saveSession(null);
    showLogin('登入已過期，請重新登入。');
    throw new Error('登入已過期');
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`${response.status} ${detail.slice(0, 160)}`);
  }
  if (raw) return response;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function showLogin(message = '') {
  loginSection.hidden = false;
  review.hidden = true;
  report.hidden = true;
  tabs.hidden = true;
  logout.hidden = true;
  if (message) say(message);
}

async function signedPhoto(path) {
  if (!path) return '';
  try {
    const result = await api(`/storage/v1/object/sign/${UPLOAD_BUCKET}/${path}`, { method: 'POST', body: { expiresIn: 900 } });
    return `${url}/storage/v1${result.signedURL ?? result.signedUrl}`;
  } catch {
    return '';
  }
}

async function render() {
  for (const status of ['pending', 'approved', 'rejected']) {
    document.querySelector(`[data-count="${status}"]`).textContent = `（${posts.filter((post) => post.status === status).length}）`;
  }
  for (const button of document.querySelectorAll('[data-filter]')) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  }
  const visible = posts.filter((post) => post.status === filter);
  // 已上架：置頂的依順序排最前面，方便調整。
  const pinned = pinnedPosts();
  if (filter === 'approved') visible.sort((a, b) => (a.pin_order ?? Infinity) - (b.pin_order ?? Infinity));
  list.innerHTML = visible.length ? '' : '<li class="admin__empty">這裡目前沒有留言。</li>';
  for (const post of visible) {
    const item = document.createElement('li');
    item.className = 'admin-card';
    item.dataset.id = post.id;
    item.innerHTML = `
      <div class="admin-card__photo" data-photo>${post.photo_path ? '照片載入中……' : '（沒有照片）'}</div>
      <div class="admin-card__body">
        <p class="admin-card__meta">${escapeHtml(formatPaperDate(post.created_at))}｜${escapeHtml(byline(post.role))}｜署名：${escapeHtml(post.name || '匿名讀者')}｜♡ ${Number(post.likes) || 0}</p>
        <p class="admin-card__prompt">題目：${escapeHtml(post.prompt)}</p>
        <p class="admin-card__text">${escapeHtml(post.body)}</p>
        <div class="admin-card__actions">
          ${post.status !== 'approved' ? '<button class="primary-button" type="button" data-action="approve">通過並上架</button>' : ''}
          ${post.status === 'pending' ? '<button class="text-button" type="button" data-action="reject">退回</button>' : ''}
          ${post.status === 'approved' ? '<button class="text-button" type="button" data-action="reject">下架</button>' : ''}
          ${post.status === 'approved' && post.pin_order == null ? '<button class="text-button" type="button" data-action="pin">置頂</button>' : ''}
          ${post.status === 'approved' && post.pin_order != null ? `<span class="admin-card__pin">置頂第 ${pinned.indexOf(post) + 1} 則</span>
            <button class="text-button" type="button" data-action="up" aria-label="往前移"${pinned.indexOf(post) === 0 ? ' disabled' : ''}>↑</button>
            <button class="text-button" type="button" data-action="down" aria-label="往後移"${pinned.indexOf(post) === pinned.length - 1 ? ' disabled' : ''}>↓</button>
            <button class="text-button" type="button" data-action="unpin">取消置頂</button>` : ''}
        </div>
      </div>
    `;
    list.append(item);
    if (post.photo_path) {
      signedPhoto(post.photo_path).then((src) => {
        const slot = item.querySelector('[data-photo]');
        slot.innerHTML = src ? `<img src="${escapeHtml(src)}" alt="讀者上傳的照片">` : '照片無法載入';
      });
    }
  }
}

async function load() {
  say('載入中……');
  posts = await api('/rest/v1/board_posts?select=*&order=created_at.desc&limit=200');
  say(posts.length ? '' : '目前讀不到任何留言。如果確定有人送出過，請確認這個 Email 已加入 board_admins 審核者名單。');
  loginSection.hidden = true;
  tabs.hidden = false;
  logout.hidden = false;
  showTab(activeTab);
  await render();
}

// ── 滿意度與抽獎 ──
const taipeiDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' });
const taipeiTime = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
const dateOf = (value) => taipeiDate.format(new Date(value)).replaceAll('-', '/');
const timeOf = (value) => taipeiTime.format(new Date(value)).replaceAll('-', '/');
const rate = (up, down) => (up + down ? `${Math.round((up / (up + down)) * 100)}%` : '—');

function showTab(name) {
  activeTab = name;
  for (const tab of tabs.querySelectorAll('[data-admin-tab]')) {
    const selected = tab.dataset.adminTab === name;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  review.hidden = name !== 'review';
  report.hidden = name !== 'report';
  if (name === 'report') loadFeedback().catch((error) => say(`讀取滿意度失敗：${error.message}`, 'error'));
}

async function loadFeedback() {
  say('載入中……');
  try {
    feedback = await api('/rest/v1/site_feedback?select=*&order=created_at.desc&limit=10000');
  } catch (error) {
    if (/404|42P01|PGRST205/.test(error.message)) {
      say('還沒建立滿意度資料表：請先在 Supabase 的 SQL Editor 執行 supabase/feedback.sql。', 'error');
      return;
    }
    throw error;
  }
  say(feedback.length ? '' : '目前還沒有人送出滿意度。');
  renderReport();
}

function renderReport() {
  const up = feedback.filter((row) => row.satisfied).length;
  const down = feedback.length - up;
  report.querySelector('[data-stat="total"]').textContent = feedback.length;
  report.querySelector('[data-stat="up"]').textContent = up;
  report.querySelector('[data-stat="down"]').textContent = down;
  report.querySelector('[data-stat="rate"]').textContent = rate(up, down);
  report.querySelector('[data-stat-bar]').style.width = feedback.length ? `${(up / feedback.length) * 100}%` : '0%';

  report.querySelector('[data-report-roles]').innerHTML = [...ROLES.map(({ id }) => id), null].map((roleId) => {
    const rows = feedback.filter((row) => (row.role ?? null) === roleId);
    const roleUp = rows.filter((row) => row.satisfied).length;
    if (!rows.length && roleId === null) return '';
    return `<tr><td>${escapeHtml(roleId ? byline(roleId) : '未選身分')}</td><td class="num">${roleUp}</td><td class="num">${rows.length - roleUp}</td><td class="num">${rate(roleUp, rows.length - roleUp)}</td></tr>`;
  }).join('');

  const days = new Map();
  for (const row of feedback) {
    const day = dateOf(row.created_at);
    const entry = days.get(day) ?? { up: 0, down: 0 };
    entry[row.satisfied ? 'up' : 'down'] += 1;
    days.set(day, entry);
  }
  report.querySelector('[data-report-days]').innerHTML = [...days].sort(([a], [b]) => b.localeCompare(a))
    .map(([day, { up: dayUp, down: dayDown }]) => `<tr><td>${day}</td><td class="num">${dayUp + dayDown}</td><td class="num">${dayUp}</td><td class="num">${dayDown}</td></tr>`).join('')
    || '<tr><td colspan="4">—</td></tr>';

  report.querySelector('[data-report-emails]').innerHTML = feedback.map((row) => `
    <tr><td>${escapeHtml(row.email)}</td><td>${row.satisfied ? '👍 滿意' : '👎 不滿意'}</td><td>${escapeHtml(row.role ? byline(row.role) : '—')}</td><td>${timeOf(row.created_at)}</td><td>${timeOf(row.updated_at)}</td></tr>
  `).join('') || '<tr><td colspan="5">—</td></tr>';
}

// CSV 開頭加 BOM，Excel 打開中文才不會變亂碼；欄位內容先加引號，避免被當成公式。
function csvCell(value) {
  const text = String(value ?? '');
  return `"${(/^[=+\-@]/.test(text) ? `'${text}` : text).replaceAll('"', '""')}"`;
}

function downloadCsv() {
  const rows = [['Email', '評價', '身分', '第一次送出', '最後更新'], ...feedback.map((row) => [
    row.email, row.satisfied ? '滿意' : '不滿意', row.role ? byline(row.role) : '', timeOf(row.created_at), timeOf(row.updated_at),
  ])];
  const blob = new Blob([`\ufeff${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `重返馬太鞍-抽獎名單-${dateOf(new Date()).replaceAll('/', '')}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

for (const tab of tabs.querySelectorAll('[data-admin-tab]')) tab.addEventListener('click', () => showTab(tab.dataset.adminTab));
report.querySelector('[data-report-csv]').addEventListener('click', downloadCsv);

async function approve(post) {
  if (post.photo_path) {
    try {
      await api('/storage/v1/object/copy', {
        method: 'POST',
        body: { bucketId: UPLOAD_BUCKET, sourceKey: post.photo_path, destinationBucket: PUBLIC_BUCKET, destinationKey: post.photo_path },
      });
    } catch (error) {
      // 重新上架時公開照片可能已經存在，其他錯誤才中止。
      if (!/exists|Duplicate|409/i.test(error.message)) throw error;
    }
  }
  await api(`/rest/v1/board_posts?id=eq.${post.id}`, { method: 'PATCH', body: { status: 'approved' }, headers: { prefer: 'return=minimal' } });
}

// 置頂：pin_order 越小越前面；只排已上架的留言。
function pinnedPosts() {
  return posts.filter((post) => post.status === 'approved' && post.pin_order != null).sort((a, b) => a.pin_order - b.pin_order);
}

function setPin(post, pinOrder) {
  return api(`/rest/v1/board_posts?id=eq.${post.id}`, { method: 'PATCH', body: { pin_order: pinOrder }, headers: { prefer: 'return=minimal' } });
}

async function pin(post, action) {
  const pinned = pinnedPosts();
  if (action === 'pin') return setPin(post, (pinned.at(-1)?.pin_order ?? 0) + 1);
  if (action === 'unpin') return setPin(post, null);
  // 往前／往後：和相鄰那則交換順序。
  const index = pinned.indexOf(post);
  const other = pinned[index + (action === 'up' ? -1 : 1)];
  if (!other) return null;
  await setPin(post, other.pin_order);
  return setPin(other, post.pin_order);
}

async function reject(post) {
  await api(`/rest/v1/board_posts?id=eq.${post.id}`, { method: 'PATCH', body: { status: 'rejected', ...(post.pin_order != null ? { pin_order: null } : {}) }, headers: { prefer: 'return=minimal' } });
  if (post.photo_path) {
    await api(`/storage/v1/object/${PUBLIC_BUCKET}`, { method: 'DELETE', body: { prefixes: [post.photo_path] } }).catch(() => {});
  }
}

list.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const post = posts.find((item) => item.id === button.closest('[data-id]').dataset.id);
  button.disabled = true;
  try {
    const { action } = button.dataset;
    if (action === 'approve') await approve(post);
    else if (action === 'reject') await reject(post);
    else await pin(post, action);
    say({ approve: '已上架。', reject: '已退回／下架。', pin: '已置頂。', unpin: '已取消置頂。' }[action] ?? '已調整置頂順序。', 'success');
    await load();
  } catch (error) {
    button.disabled = false;
    say(/pin_order/.test(error.message)
      ? '還沒開啟置頂功能：請先在 Supabase 的 SQL Editor 執行 supabase/pin.sql。'
      : `操作失敗：${error.message}`, 'error');
  }
});

for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    render();
  });
}
document.querySelector('[data-admin-refresh]').addEventListener('click', () => load().catch((error) => say(error.message, 'error')));
logout.addEventListener('click', () => {
  saveSession(null);
  showLogin('已登出。');
});

document.querySelector('[data-admin-login-form]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = event.currentTarget.elements.email.value.trim();
  const redirect = encodeURIComponent(location.origin + location.pathname);
  try {
    const response = await fetch(`${url}/auth/v1/otp?redirect_to=${redirect}`, {
      method: 'POST',
      headers: { apikey: key, 'content-type': 'application/json' },
      body: JSON.stringify({ email, create_user: false }),
    });
    if (!response.ok) throw new Error(await response.text());
    say('登入連結已寄出，請到信箱收信並打開連結。', 'success');
  } catch (error) {
    say(`寄信失敗：${error.message.slice(0, 160)}`, 'error');
  }
});

if (!url || !key) {
  say('還沒設定 Supabase：請先在 js/board-config.js 填入 supabaseUrl 與 publishableKey。', 'error');
} else {
  const session = sessionFromHash() ?? readSession();
  if (session && session.expiresAt > Date.now()) load().catch((error) => say(`讀取失敗：${error.message}`, 'error'));
  else showLogin();
}
