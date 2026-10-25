// 預覽密碼：內部預覽用的門檻，不是真正的保護（程式碼公開，懂程式的人看得到）。
// 只比對 SHA-256 雜湊，原始碼裡不直接寫密碼；同一個分頁輸入過就不用再輸入。
const PREVIEW_HASH = '78c0781a0697b8212d21711580c2c60616f80ab66ec717ecdbb8200be03407f8';
const STORAGE_KEY = 'heroes-after-preview';

export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function isPreviewCode(code) {
  return (await sha256Hex(String(code ?? '').trim())) === PREVIEW_HASH;
}

function remembered(storage) {
  try {
    return storage.getItem(STORAGE_KEY) === PREVIEW_HASH;
  } catch {
    return false;
  }
}

export function createPreviewGate(root, { storage = globalThis.sessionStorage, onUnlock } = {}) {
  const form = root.querySelector('[data-gate-form]');
  const input = form.elements.code;
  const status = root.querySelector('[data-gate-status]');

  function unlock() {
    root.hidden = true;
    document.body.dataset.preview = 'open';
    onUnlock?.();
  }

  if (remembered(storage)) {
    unlock();
    return;
  }

  document.body.dataset.preview = 'locked';
  root.hidden = false;
  input.focus();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (await isPreviewCode(input.value)) {
      try {
        storage.setItem(STORAGE_KEY, PREVIEW_HASH);
      } catch {
        // 無法記住時，下次重新整理再輸入一次。
      }
      unlock();
      return;
    }
    status.textContent = '密碼不對，再試一次。';
    form.classList.remove('is-wrong');
    void form.offsetWidth;
    form.classList.add('is-wrong');
    input.select();
  });
}
