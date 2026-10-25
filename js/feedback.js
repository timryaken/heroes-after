import { isValidEmail } from './core.js';

// 出發後的滿意度投票＋抽獎登記。一定要留 Email 才能投票；同一個 Email 只算一次抽獎資格（重複送出會更新成最新的一票）。
const DEMO_KEY = 'heroes-after-feedback-demo';

export function validateFeedback({ vote, email, consent } = {}) {
  if (vote !== 'up' && vote !== 'down') return { ok: false, field: 'vote', message: '請先選擇滿意或不滿意。' };
  if (!isValidEmail(email)) return { ok: false, field: 'email', message: '請輸入有效的 Email，例如 name@example.com。' };
  if (String(email).trim().length > 254) return { ok: false, field: 'email', message: 'Email 太長了。' };
  if (!consent) return { ok: false, field: 'consent', message: '請勾選同意，才能參加抽獎並收到實境遊戲的通知。' };
  return { ok: true };
}

export function createFeedbackApi(config = {}, { fetchImpl = globalThis.fetch?.bind(globalThis), storage = globalThis.localStorage } = {}) {
  const url = (config.supabaseUrl ?? '').replace(/\/+$/, '');
  const key = config.publishableKey ?? '';
  const mode = url && key ? 'live' : 'demo';

  return {
    mode,
    async submit({ vote, email, role }) {
      const entry = { p_email: email.trim().toLowerCase(), p_satisfied: vote === 'up', p_role: role || null };
      if (mode === 'demo') {
        try {
          const saved = JSON.parse(storage.getItem(DEMO_KEY) ?? '{}');
          saved[entry.p_email] = { satisfied: entry.p_satisfied, role: entry.p_role, at: new Date().toISOString() };
          storage.setItem(DEMO_KEY, JSON.stringify(saved));
        } catch {
          // 示意模式存不了也沒關係，畫面照樣顯示完成。
        }
        return { mode };
      }
      const response = await fetchImpl(`${url}/rest/v1/rpc/submit_site_feedback`, {
        method: 'POST',
        headers: { apikey: key, 'content-type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error(`送出失敗（${response.status}）`);
      return { mode };
    },
  };
}

export function createFeedbackController(root, api, { getRole = () => '' } = {}) {
  const form = root.querySelector('[data-feedback-form]');
  const votes = [...form.querySelectorAll('[data-vote]')];
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-feedback-submit]');
  form.querySelector('[data-feedback-mode]').textContent = api.mode === 'live' ? '' : '示意模式：尚未連接後台，只存在這台裝置。';
  let vote = '';

  function announce(message, kind = 'success') {
    status.textContent = message;
    status.dataset.kind = kind;
    status.hidden = false;
  }

  function setVote(value) {
    vote = value;
    for (const button of votes) button.setAttribute('aria-pressed', String(button.dataset.vote === value));
  }

  for (const button of votes) button.addEventListener('click', () => setVote(button.dataset.vote));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const draft = { vote, email: form.elements.email.value, consent: form.elements.consent.checked };
    const check = validateFeedback(draft);
    if (!check.ok) {
      announce(check.message, 'error');
      (check.field === 'vote' ? votes[0] : form.elements[check.field]).focus();
      return;
    }
    submit.disabled = true;
    announce('送出中……');
    try {
      const result = await api.submit({ ...draft, role: getRole() });
      form.classList.add('is-sent');
      announce(result.mode === 'live'
        ? '謝謝你！已完成抽獎登記。得獎通知與 11/30 實境遊戲的消息，都會寄到這個 Email。'
        : '已記下（示意模式，只存在這台裝置）。');
    } catch (error) {
      announce(error.message, 'error');
    } finally {
      submit.disabled = false;
    }
  });

  return {
    reset() {
      form.reset();
      form.classList.remove('is-sent');
      setVote('');
      status.hidden = true;
    },
  };
}
