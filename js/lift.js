// 物件從桌上的位置「拿起來」放到畫面中央，關閉時放回原位（FLIP 動畫）。
const EASE_OPEN = 'cubic-bezier(0.2, 0.85, 0.25, 1)';
const EASE_CLOSE = 'cubic-bezier(0.5, 0, 0.75, 0.4)';
// 觸控裝置（iPhone、LINE 內建瀏覽器）記憶體較緊，大圖層做 3D 翻轉容易讓瀏覽器整頁重新載入，改成平面的放大縮小。
const lightweight = () => globalThis.matchMedia?.('(hover: none), (max-width: 720px)').matches ?? false;

// 起點：物件在桌上的位置與大小；額外的立體角度（例如收音機斜放）寫在 data-lift-from。
export function liftTransform(from, to, extra = '') {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const scale = Math.max(0.05, Math.min(from.width / to.width, from.height / to.height));
  return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${scale.toFixed(3)}) ${extra}`.trim();
}

// 終點用同樣的函式清單、角度歸零，瀏覽器才會逐項補間，不會走矩陣插值而扭曲。
export function neutralTransform(extra = '') {
  return `translate(0px, 0px) scale(1) ${extra.replace(/(rotate[XYZ]?)\([^)]*\)/g, '$1(0deg)')}`.trim();
}

export function animateLift(dialog, source, { closing = false, reducedMotion = false } = {}) {
  const target = dialog.querySelector('[data-lift]');
  const duration = reducedMotion ? 160 : closing ? 380 : 640;
  const direction = closing ? 'reverse' : 'normal';
  const fade = { duration: Math.min(duration, 360), easing: 'ease', direction, fill: 'both' };
  // 只淡入背景和旁邊的說明；物件本身不透明，看起來才像真的被拿起來。
  const animations = [
    dialog.animate([{ opacity: 0 }, { opacity: 1 }], { ...fade, pseudoElement: '::before' }),
    ...[...dialog.querySelectorAll('.stage-close, .stage > :not([data-lift])')].map((element) => element.animate([{ opacity: 0 }, { opacity: 1 }], fade)),
  ];
  if (target) {
    const sourceRect = source?.getBoundingClientRect();
    if (reducedMotion || !sourceRect?.width) {
      animations.push(target.animate([{ opacity: 0, transform: 'scale(0.97)' }, { opacity: 1, transform: 'none' }], { duration, easing: 'ease', direction, fill: 'both' }));
    } else {
      const extra = lightweight() ? '' : target.dataset.liftFrom ?? '';
      const from = liftTransform(sourceRect, target.getBoundingClientRect(), extra);
      animations.push(target.animate(
        [{ transform: from }, { transform: neutralTransform(extra) }],
        { duration, easing: closing ? EASE_CLOSE : EASE_OPEN, direction, fill: 'both' },
      ));
    }
  }
  return Promise.all(animations.map((animation) => animation.finished.catch(() => {}))).then(() => {
    // 打開後就移除動畫，物件之後的 hover／翻頁等 transform 才不會被蓋掉；關閉的等對話框關掉再清。
    if (!closing) animations.forEach((animation) => animation.cancel());
    return animations;
  });
}
