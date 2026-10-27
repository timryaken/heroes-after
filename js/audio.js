import { trace } from './debug.js';
import { createScope } from './scope.js';

export function mergeListened(clips, listened = [], nextId) {
  const selected = new Set([...listened, nextId]);
  return clips.map(({ id }) => id).filter((id) => selected.has(id));
}

const pad = (value) => String(value).padStart(2, '0');

// 收音機：◀◀ ▶▶ 選台、▶ 播放、■ 停止；左旋鈕調台、右旋鈕切換靜音。
// 錄音嵌入原平台的播放器（YouTube／Facebook），按播放才載入；載入即視為聽過。播放器藏在畫面外，只聽聲音。
export function createAudioController(root, clips, options = {}) {
  const lcd = root.querySelector('[data-radio-lcd]');
  const channel = root.querySelector('[data-radio-channel]');
  const state = root.querySelector('[data-radio-state]');
  const ticker = root.querySelector('[data-radio-ticker]');
  const title = root.querySelector('[data-audio-title]');
  const speaker = root.querySelector('[data-audio-speaker]');
  const embed = root.querySelector('[data-audio-embed]');
  const idle = root.querySelector('[data-audio-idle]');
  const sourceLink = root.querySelector('[data-audio-source]');
  const status = root.querySelector('[data-audio-status]');
  const playButton = root.querySelector('[data-radio="play"]');
  const tuneKnob = root.querySelector('[data-radio="tune"]');
  const volumeKnob = root.querySelector('[data-radio="volume"]');
  const scope = createScope(root.querySelector('[data-radio-scope]'), { reducedMotion: options.reducedMotion });
  const onComplete = options.onComplete ?? (() => {});
  let listened = [...(options.listened ?? [])];
  let index = 0;
  let playing = false;
  let muted = false;
  let tuneTurns = 0;

  function setStatus(message) {
    status.textContent = message;
  }

  // 標題太長時，在螢幕上來回捲動。
  function fitTicker() {
    if (!ticker || !title) return;
    const overflow = title.scrollWidth - ticker.clientWidth;
    ticker.classList.toggle('is-scrolling', overflow > 2);
    ticker.style.setProperty('--ticker-shift', `${-Math.max(0, overflow)}px`);
  }

  function render() {
    const clip = clips[index];
    channel.textContent = `CH ${pad(index + 1)}/${pad(clips.length)}`;
    state.textContent = muted ? 'MUTE' : playing ? '▶ PLAY' : listened.includes(clip.id) ? '✓ HEARD' : 'READY';
    title.textContent = clip.title;
    speaker.textContent = clip.speaker;
    lcd.dataset.playing = String(playing);
    root.dataset.playing = String(playing);
    playButton?.setAttribute('aria-pressed', String(playing));
    scope.setPlaying(playing);
    requestAnimationFrame(fitTicker);
  }

  function stop({ quiet = false } = {}) {
    const wasPlaying = playing;
    trace(`收音機 stop（播放中=${wasPlaying}，播放器=${embed.childElementCount}）`);
    // 移除播放器才能確實停下嵌入的影音。
    embed.replaceChildren();
    embed.hidden = true;
    idle.hidden = false;
    playing = false;
    render();
    if (wasPlaying && !quiet) setStatus('已停止。');
  }

  function play(id = clips[index].id) {
    const nextIndex = clips.findIndex((item) => item.id === id);
    if (nextIndex < 0) return null;
    index = nextIndex;
    if (muted) {
      render();
      setStatus('目前為靜音。轉一下右邊的音量旋鈕，或從右上角開啟聲音。');
      return null;
    }
    stop({ quiet: true });
    const clip = clips[index];
    sourceLink.href = clip.sourceUrl;
    sourceLink.hidden = false;

    const frame = document.createElement('iframe');
    frame.src = clip.embedUrl;
    frame.title = clip.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    embed.append(frame);
    embed.classList.toggle('audio-embed--vertical', Boolean(clip.vertical));
    embed.hidden = false;
    idle.hidden = true;

    listened = mergeListened(clips, listened, clip.id);
    playing = true;
    render();
    setStatus('播放中。');
    onComplete(clip.id, listened);
    return clip;
  }

  // 選台：播放中就直接換到下一台，停止時只換螢幕上的節目。
  function tune(step) {
    const wasPlaying = playing;
    index = (index + step + clips.length) % clips.length;
    tuneTurns += step;
    tuneKnob?.style.setProperty('--turn', `${tuneTurns * 50}deg`);
    if (wasPlaying) play();
    else {
      stop({ quiet: true });
      setStatus(`第 ${index + 1} 台：${clips[index].title}`);
    }
  }

  root.querySelector('[data-radio="prev"]')?.addEventListener('click', () => tune(-1));
  root.querySelector('[data-radio="next"]')?.addEventListener('click', () => tune(1));
  tuneKnob?.addEventListener('click', () => tune(1));
  playButton?.addEventListener('click', () => {
    if (!playing) play();
  });
  root.querySelector('[data-radio="stop"]')?.addEventListener('click', () => stop());
  volumeKnob?.addEventListener('click', () => options.onVolume?.());
  window.addEventListener('resize', fitTicker);

  render();
  setStatus('按 ▶ 才會載入播放器。');
  return {
    play,
    stop,
    setActive(value) {
      scope.setActive(value);
      if (value) requestAnimationFrame(fitTicker);
    },
    setListened(value = []) {
      listened = [...value];
      render();
    },
    setMuted(value) {
      muted = Boolean(value);
      volumeKnob?.setAttribute('aria-pressed', String(muted));
      volumeKnob?.style.setProperty('--turn', muted ? '-120deg' : '0deg');
      if (muted) stop({ quiet: true });
      else render();
    },
    destroy: stop,
  };
}
