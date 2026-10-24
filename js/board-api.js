// 留言板的資料存取：有 Supabase 設定時走後台，沒有時走示意模式（只存在這台裝置）。
const LOCAL_PENDING_KEY = 'heroes-after-board-pending';
const LOCAL_LIKES_KEY = 'heroes-after-board-likes';
export const UPLOAD_BUCKET = 'board-uploads';
export const PUBLIC_BUCKET = 'board-public';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

// 報紙排版用：第一句當標題，其餘當內文；太長的第一句不拆。
export function splitHeadline(body = '') {
  const text = body.trim();
  const match = text.match(/^(.{4,36}?[。！？!?])\s*([\s\S]+)$/);
  if (match) return { headline: match[1], text: match[2] };
  return { headline: text.length <= 36 ? text : `${text.slice(0, 30)}……`, text: text.length <= 36 ? '' : text };
}

export function formatPaperDate(value, fallback = '') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

export function validateBoardDraft({ body = '', name = '', website = '' } = {}) {
  if (website) return { ok: false, message: '送出失敗，請重新整理後再試。' };
  if (!body.trim()) return { ok: false, message: '先寫下一段想留給光復的話。' };
  if (body.trim().length > 500) return { ok: false, message: '留言最多 500 字。' };
  if (name.trim().length > 20) return { ok: false, message: '署名最多 20 字。' };
  return { ok: true };
}

function readJson(storage, key, fallback) {
  try {
    const value = JSON.parse(storage?.getItem(key) ?? 'null');
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try {
    storage?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function createBoardApi(config = {}, { fetchImpl = globalThis.fetch?.bind(globalThis), storage, uuid = () => crypto.randomUUID() } = {}) {
  const url = (config.supabaseUrl ?? '').replace(/\/+$/, '');
  const key = config.publishableKey ?? '';
  const live = Boolean(url && key);
  const headers = (extra = {}) => ({ apikey: key, ...extra });

  async function request(path, options = {}) {
    const response = await fetchImpl(`${url}${path}`, { ...options, headers: headers(options.headers) });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`留言板連線失敗（${response.status}）${detail ? `：${detail.slice(0, 120)}` : ''}`);
    }
    return response;
  }

  function likedIds() {
    return readJson(storage, LOCAL_LIKES_KEY, {});
  }

  return {
    mode: live ? 'live' : 'demo',

    photoUrl(path) {
      return live && path ? `${url}/storage/v1/object/public/${PUBLIC_BUCKET}/${path}` : '';
    },

    async listPosts() {
      if (!live) return [];
      const response = await request('/rest/v1/board_public?select=id,role,prompt,name,body,photo_path,likes,published_at&order=published_at.desc&limit=60');
      return response.json();
    },

    async submitPost({ role, prompt, name = '', body, photo = null }) {
      const post = { role, prompt, name: name.trim() || null, body: body.trim() };
      if (!live) {
        const pending = readJson(storage, LOCAL_PENDING_KEY, []);
        pending.push({ ...post, hasPhoto: Boolean(photo), createdAt: new Date().toISOString() });
        writeJson(storage, LOCAL_PENDING_KEY, pending.slice(-20));
        return { mode: 'demo' };
      }
      if (photo) {
        const photoPath = `${uuid()}.jpg`;
        await request(`/storage/v1/object/${UPLOAD_BUCKET}/${photoPath}`, {
          method: 'POST',
          headers: { 'content-type': 'image/jpeg', 'x-upsert': 'false' },
          body: photo,
        });
        post.photo_path = photoPath;
      }
      await request('/rest/v1/board_posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json', prefer: 'return=minimal' },
        body: JSON.stringify(post),
      });
      return { mode: 'live' };
    },

    hasLiked(id) {
      return Boolean(likedIds()[id]);
    },

    // 同一台裝置每篇只記一次讚；示意文與示意模式只在本機加一。
    async like(id, { sample = false } = {}) {
      if (this.hasLiked(id)) return null;
      let count = null;
      if (live && !sample) {
        const response = await request('/rest/v1/rpc/like_board_post', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ post_id: id }),
        });
        count = await response.json();
      }
      writeJson(storage, LOCAL_LIKES_KEY, { ...likedIds(), [id]: true });
      return count;
    },
  };
}

// 上傳前在瀏覽器重新繪製：縮到最長邊 1600px、轉成 JPEG，同時去掉 EXIF（含 GPS）。
export async function prepareUploadPhoto(file, maxSide = 1600) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('照片處理失敗'))), 'image/jpeg', 0.82);
  });
}
