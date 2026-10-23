export function mergeListened(clips, listened = [], nextId) {
  const selected = new Set([...listened, nextId]);
  return clips.map(({ id }) => id).filter((id) => selected.has(id));
}

// 錄音嵌入原平台的播放器（YouTube／Facebook），按下某一段才載入；載入即視為聽過。
export function createAudioController(root, clips, options = {}) {
  const trackList = root.querySelector('[data-track-list]');
  const stopButton = root.querySelector('[data-audio-stop]');
  const speaker = root.querySelector('[data-audio-speaker]');
  const title = root.querySelector('[data-audio-title]');
  const embed = root.querySelector('[data-audio-embed]');
  const sourceLink = root.querySelector('[data-audio-source]');
  const status = root.querySelector('[data-audio-status]');
  const onComplete = options.onComplete ?? (() => {});
  let listened = [...(options.listened ?? [])];
  let currentId = '';
  let muted = false;

  const trackButtons = clips.map((clip, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'track';
    button.dataset.clipId = clip.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `
      <span class="track__index" aria-hidden="true">0${index + 1}</span>
      <span class="track__copy"><strong>${clip.title}</strong><small>${clip.speaker}</small></span>
      <span class="track__state" aria-hidden="true"></span>
      <span class="visually-hidden" data-track-done></span>
    `;
    button.addEventListener('click', () => {
      if (currentId === clip.id && root.dataset.playing === 'true') stop();
      else play(clip.id);
    });
    item.append(button);
    trackList?.append(item);
    return button;
  });

  function setStatus(message) {
    status.textContent = message;
  }

  function renderTracks() {
    for (const button of trackButtons) {
      const done = listened.includes(button.dataset.clipId);
      const playing = root.dataset.playing === 'true' && button.dataset.clipId === currentId;
      button.classList.toggle('is-done', done);
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-pressed', String(playing));
      button.querySelector('[data-track-done]').textContent = done ? '（已聽過）' : '';
    }
  }

  function setPlaying(value) {
    root.dataset.playing = String(value);
    renderTracks();
  }

  function stop() {
    const wasPlaying = root.dataset.playing === 'true';
    // 移除播放器才能確實停下嵌入的影音。
    if (embed) {
      embed.replaceChildren();
      embed.hidden = true;
    }
    setPlaying(false);
    if (wasPlaying) setStatus('已停止。');
  }

  function play(id) {
    const clip = clips.find((item) => item.id === id);
    if (!clip) return null;
    if (muted) {
      setStatus('目前為靜音。請先從右上角開啟聲音。');
      return null;
    }
    stop();
    currentId = clip.id;
    speaker.textContent = clip.speaker;
    title.textContent = clip.title;
    root.dataset.activeClip = clip.id;
    if (sourceLink) {
      sourceLink.href = clip.sourceUrl;
      sourceLink.hidden = false;
    }

    const frame = document.createElement('iframe');
    frame.src = clip.embedUrl;
    frame.title = clip.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    embed?.append(frame);
    if (embed) {
      embed.classList.toggle('audio-embed--vertical', Boolean(clip.vertical));
      embed.hidden = false;
    }

    listened = mergeListened(clips, listened, clip.id);
    setPlaying(true);
    setStatus('播放器載入中；如果沒有自動播放，請按播放器上的播放鍵。');
    onComplete(clip.id, listened);
    return clip;
  }

  stopButton?.addEventListener('click', stop);

  setPlaying(false);
  setStatus('按下任一段才會載入播放器。');
  return {
    play,
    stop,
    setListened(value = []) {
      listened = [...value];
      renderTracks();
    },
    setMuted(value) {
      muted = Boolean(value);
      if (muted) stop();
    },
    destroy: stop,
  };
}
