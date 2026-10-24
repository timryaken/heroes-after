import { validateImageFile } from './core.js';
import { escapeHtml, formatPaperDate, prepareUploadPhoto, splitHeadline, validateBoardDraft } from './board-api.js';
import { rolePrompt } from './forms.js';

function announce(target, message, kind = 'success') {
  target.textContent = message;
  target.dataset.kind = kind;
  target.hidden = false;
  if (kind === 'error') target.focus({ preventScroll: true });
}

export function postMarkup(post, { byline = '', photoUrl = '', liked = false } = {}) {
  const { headline, text } = splitHeadline(post.body);
  const photo = post.photo?.src ?? photoUrl;
  const alt = post.photo?.alt ?? '讀者提供的照片';
  return `
    <article class="paper-post${photo ? ' paper-post--photo' : ''}" data-post-id="${escapeHtml(post.id)}">
      <p class="paper-post__kicker">${escapeHtml(byline)}${post.sample ? '<span class="paper-post__sample">示意</span>' : ''}</p>
      <h4 class="paper-post__headline">${escapeHtml(headline)}</h4>
      ${photo ? `<figure class="paper-post__figure"><img src="${escapeHtml(photo)}" alt="${escapeHtml(alt)}" loading="lazy"><figcaption>${post.sample ? 'AI 生成示意圖' : '讀者提供'}</figcaption></figure>` : ''}
      ${text ? `<p class="paper-post__body">${escapeHtml(text)}</p>` : ''}
      <p class="paper-post__prompt">回應：${escapeHtml(post.prompt)}</p>
      <footer class="paper-post__footer">
        <span>— ${escapeHtml(post.name || '匿名讀者')}・${escapeHtml(formatPaperDate(post.publishedAt ?? post.published_at))}</span>
        <button class="paper-like" type="button" data-like aria-pressed="${liked}" aria-label="按讚，目前 ${Number(post.likes) || 0} 個讚">
          <span aria-hidden="true">${liked ? '♥' : '♡'}</span><span data-like-count>${Number(post.likes) || 0}</span>
        </button>
      </footer>
    </article>
  `;
}

export function createBoardController(root, api, { roles = [], samples = [], showSamples = true, getRole = () => '' } = {}) {
  const composeButton = root.querySelector('[data-board-compose]');
  const composePanel = root.querySelector('[data-board-compose-panel]');
  const composeClose = root.querySelector('[data-board-compose-close]');
  const form = root.querySelector('[data-board-form]');
  const prompt = root.querySelector('[data-board-prompt]');
  const fileInput = root.querySelector('[data-board-file]');
  const preview = root.querySelector('[data-board-preview]');
  const status = form.querySelector('[data-form-status]');
  const submit = root.querySelector('[data-board-submit]');
  const postsRoot = root.querySelector('[data-paper-posts]');
  const paperStatus = root.querySelector('[data-paper-status]');
  root.querySelector('[data-paper-date]').textContent = formatPaperDate(new Date());
  root.querySelector('[data-board-mode]').textContent = api.mode === 'live'
    ? '送出後由編輯部審核，通過才會上架。'
    : '示意模式：尚未連接後台，留言只存在這台裝置。';
  let previewUrl = '';
  let posts = [];
  let loaded = false;

  const bylineFor = (roleId) => roles.find(({ id }) => id === roleId)?.byline ?? '讀者';

  // 筆電螢幕先顯示讀者版；右下角「投稿」打開投稿視窗，蓋在讀者版上面。
  function setComposeOpen(open, { focus = true } = {}) {
    composePanel.hidden = !open;
    composeButton.hidden = open;
    composeButton.setAttribute('aria-expanded', String(open));
    if (!focus) return;
    if (open) form.elements.body.focus({ preventScroll: true });
    else composeButton.focus({ preventScroll: true });
  }

  composeButton.addEventListener('click', () => setComposeOpen(true));
  composeClose.addEventListener('click', () => setComposeOpen(false));
  composePanel.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    // 先關投稿視窗，不要連筆電一起放回桌上。
    event.preventDefault();
    event.stopPropagation();
    setComposeOpen(false);
  });

  function render() {
    const visible = [...posts, ...(showSamples ? samples : [])];
    postsRoot.innerHTML = visible.map((post) => postMarkup(post, {
      byline: bylineFor(post.role),
      photoUrl: api.photoUrl(post.photo_path),
      liked: api.hasLiked(post.id),
    })).join('');
    paperStatus.textContent = visible.length ? '' : '目前還沒有刊登的留言。';
  }

  async function load() {
    if (loaded) return;
    loaded = true;
    paperStatus.textContent = '讀者版載入中……';
    try {
      posts = await api.listPosts();
    } catch (error) {
      posts = [];
      loaded = false;
      paperStatus.textContent = `${error.message}。先顯示示意文。`;
    }
    render();
  }

  postsRoot.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-like]');
    if (!button) return;
    const article = button.closest('[data-post-id]');
    const id = article.dataset.postId;
    const post = [...posts, ...samples].find((item) => item.id === id);
    if (!post || api.hasLiked(id)) return;
    button.disabled = true;
    try {
      const count = await api.like(id, { sample: Boolean(post.sample) });
      post.likes = count ?? (Number(post.likes) || 0) + 1;
      render();
    } catch (error) {
      button.disabled = false;
      paperStatus.textContent = error.message;
    }
  });

  function revokePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    preview.removeAttribute('src');
    preview.hidden = true;
  }

  fileInput.addEventListener('change', () => {
    revokePreview();
    const file = fileInput.files?.[0];
    if (!file) return;
    const result = validateImageFile(file);
    if (!result.ok) {
      announce(status, result.message, 'error');
      fileInput.value = '';
      return;
    }
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.alt = `即將附上的照片預覽：${file.name}`;
    preview.hidden = false;
    status.hidden = true;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const draft = {
      body: form.elements.body.value,
      name: form.elements.name.value,
      website: form.elements.website.value,
    };
    const check = validateBoardDraft(draft);
    if (!check.ok) {
      announce(status, check.message, 'error');
      return;
    }
    submit.disabled = true;
    announce(status, '送出中……');
    try {
      const file = fileInput.files?.[0];
      const photo = file ? await prepareUploadPhoto(file) : null;
      const role = getRole();
      const result = await api.submitPost({ role: roles.some(({ id }) => id === role) ? role : 'other', prompt: prompt.textContent, name: draft.name, body: draft.body, photo });
      form.reset();
      revokePreview();
      announce(status, result.mode === 'live'
        ? '已送出！編輯部審核通過後，就會刊登在讀者版。'
        : '已記下（示意模式，只存在這台裝置）。接上後台後，留言會先送編輯部審核。');
      root.dispatchEvent(new CustomEvent('forms:posted', { bubbles: true }));
    } catch (error) {
      announce(status, `送出失敗：${error.message}`, 'error');
    } finally {
      submit.disabled = false;
    }
  });

  function hydrate() {
    prompt.textContent = rolePrompt(roles, getRole());
  }

  hydrate();
  return {
    hydrate,
    load,
    setComposeOpen,
    reset() {
      form.reset();
      revokePreview();
      status.hidden = true;
      setComposeOpen(false, { focus: false });
      hydrate();
    },
  };
}
