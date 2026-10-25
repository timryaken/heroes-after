function phaseSlides(slides, phase) {
  return slides.filter((slide) => slide.phase === phase).map((slide) => ({
    type: 'slide',
    slide,
  }));
}

export function createPrologueBeats(slides, days, reducedMotion = false) {
  const slideDuration = reducedMotion ? 650 : 3100;
  const cardDuration = reducedMotion ? 800 : 2400;
  return [
    ...phaseSlides(slides, 'disaster'),
    ...phaseSlides(slides, 'volunteers'),
    { type: 'count', days, duration: reducedMotion ? 700 : 2800, animateCount: !reducedMotion },
    { type: 'question', duration: cardDuration },
    ...phaseSlides(slides, 'now'),
    { type: 'invitation', duration: reducedMotion ? 900 : 4200 },
  ].map((beat) => ({ duration: slideDuration, ...beat }));
}

export function createPrologueController(root, options) {
  const {
    slides,
    days,
    reducedMotion = false,
  } = options;
  const beats = createPrologueBeats(slides, days, reducedMotion);
  const image = root.querySelector('[data-prologue-image]');
  const credit = root.querySelector('[data-prologue-credit]');
  const source = root.querySelector('[data-prologue-source]');
  const card = root.querySelector('[data-prologue-card]');
  const eyebrow = root.querySelector('[data-prologue-eyebrow]');
  const title = root.querySelector('[data-prologue-title]');
  const dayCount = root.querySelector('[data-day-count]');
  const progress = root.querySelector('[data-prologue-progress]');
  const info = root.querySelector('[data-prologue-info]');
  const infoToggle = root.querySelector('[data-prologue-info-toggle]');
  let timer = 0;
  let frame = 0;
  let index = -1;

  function cancelPending() {
    window.clearTimeout(timer);
    window.cancelAnimationFrame(frame);
  }

  function animateCount(target) {
    if (reducedMotion) {
      dayCount.textContent = String(target);
      return;
    }
    const startedAt = performance.now();
    const duration = 1300;
    const tick = (now) => {
      const ratio = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - ((1 - ratio) ** 4);
      dayCount.textContent = String(Math.round(target * eased));
      if (ratio < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
  }

  function showText(beat) {
    image.hidden = true;
    infoToggle.hidden = true;
    setInfoOpen(false);
    card.hidden = false;
    dayCount.hidden = true;
    if (beat.type === 'count') {
      eyebrow.textContent = '在那之後，已經過了——';
      title.textContent = '天';
      dayCount.hidden = false;
      animateCount(beat.days);
    } else if (beat.type === 'question') {
      eyebrow.textContent = '一年之後';
      title.textContent = '那些被鏟子超人清出來的街道，現在怎麼樣了？';
    } else {
      eyebrow.textContent = '與光赴會';
      title.textContent = '因為有你們，光復正在回來。\n記者周思遠，也出發去了光復。';
    }
  }

  function showSlide(beat) {
    const { slide } = beat;
    card.hidden = true;
    image.hidden = false;
    infoToggle.hidden = false;
    image.src = slide.src;
    image.alt = slide.alt;
    image.dataset.phase = slide.phase;
    credit.textContent = slide.credit;
    source.href = slide.sourceUrl;
  }

  // 照片來源收在左下角的 i 圖示裡，點了才展開。
  function setInfoOpen(open) {
    info.hidden = !open;
    infoToggle.setAttribute('aria-expanded', String(open));
  }

  infoToggle.addEventListener('click', () => setInfoOpen(info.hidden));

  function render(beat) {
    root.dataset.beat = beat.type;
    progress.style.setProperty('--progress', `${((index + 1) / beats.length) * 100}%`);
    if (beat.type === 'slide') showSlide(beat);
    else showText(beat);
  }

  function complete() {
    cancelPending();
    root.hidden = true;
    document.body.dataset.stage = 'desk';
    root.dispatchEvent(new CustomEvent('prologue:complete', { bubbles: true }));
  }

  function next() {
    cancelPending();
    index += 1;
    if (index >= beats.length) {
      complete();
      return;
    }
    const beat = beats[index];
    render(beat);
    timer = window.setTimeout(next, beat.duration);
  }

  function start() {
    cancelPending();
    index = -1;
    dayCount.textContent = '0';
    root.hidden = false;
    // 前導播放時，上方只留標題，其他控制縮成圖示（見 prologue.css）。
    document.body.dataset.stage = 'prologue';
    next();
  }

  function skip() {
    complete();
  }

  function replay() {
    start();
  }

  function destroy() {
    cancelPending();
  }

  root.querySelector('[data-prologue-next]').addEventListener('click', next);
  root.querySelector('[data-prologue-skip]').addEventListener('click', skip);
  return { start, skip, replay, destroy };
}
