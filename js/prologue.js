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
    credit.hidden = true;
    source.hidden = true;
    card.hidden = false;
    dayCount.hidden = true;
    if (beat.type === 'count') {
      eyebrow.textContent = '在那之後，已經過了——';
      title.textContent = '天';
      dayCount.hidden = false;
      animateCount(beat.days);
    } else if (beat.type === 'question') {
      eyebrow.textContent = '一年之後';
      title.textContent = '你知道，現在變成什麼樣了嗎？';
    } else {
      eyebrow.textContent = '英雄之後';
      title.textContent = '現在，讓我們從記者子軒的視角，重返那個你曾經關注的地方——馬太鞍';
    }
  }

  function showSlide(beat) {
    const { slide } = beat;
    card.hidden = true;
    image.hidden = false;
    credit.hidden = false;
    source.hidden = false;
    image.src = slide.src;
    image.alt = slide.alt;
    image.dataset.phase = slide.phase;
    credit.textContent = slide.credit;
    source.href = slide.sourceUrl;
  }

  function render(beat) {
    root.dataset.beat = beat.type;
    progress.style.setProperty('--progress', `${((index + 1) / beats.length) * 100}%`);
    if (beat.type === 'slide') showSlide(beat);
    else showText(beat);
  }

  function complete() {
    cancelPending();
    root.hidden = true;
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
