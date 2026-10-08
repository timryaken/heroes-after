export function splitSentences(text) {
  return String(text ?? '').match(/[^。！？]+[。！？]?/g)?.map((part) => part.trim()).filter(Boolean) ?? [];
}

export function mergeListened(clips, listened = [], nextId) {
  const selected = new Set([...listened, nextId]);
  return clips.map(({ id }) => id).filter((id) => selected.has(id));
}

export function createAudioController(root, clips, options = {}) {
  const trackList = root.querySelector('[data-track-list]');
  const stopButton = root.querySelector('[data-audio-stop]');
  const speaker = root.querySelector('[data-audio-speaker]');
  const title = root.querySelector('[data-audio-title]');
  const transcript = root.querySelector('[data-audio-transcript]');
  const status = root.querySelector('[data-audio-status]');
  const synth = options.synth ?? window.speechSynthesis;
  const Utterance = options.Utterance ?? window.SpeechSynthesisUtterance;
  const onComplete = options.onComplete ?? (() => {});
  let listened = [...(options.listened ?? [])];
  let currentId = '';
  let playToken = 0;
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
      button.querySelector('[data-track-done]').textContent = done ? '（已聽完）' : '';
    }
  }

  function setPlaying(value) {
    root.dataset.playing = String(value);
    renderTracks();
  }

  function finish(clip) {
    listened = mergeListened(clips, listened, clip.id);
    setPlaying(false);
    onComplete(clip.id, listened);
  }

  function stop() {
    playToken += 1;
    synth?.cancel?.();
    const wasPlaying = root.dataset.playing === 'true';
    setPlaying(false);
    if (wasPlaying) setStatus('已停止。逐字稿仍可閱讀。');
  }

  function play(id) {
    const clip = clips.find((item) => item.id === id);
    if (!clip) return null;
    if (muted) {
      setStatus('目前為靜音。請先從右上角開啟聲音；逐字稿仍可閱讀。');
      return null;
    }
    stop();
    const token = playToken;
    currentId = clip.id;
    speaker.textContent = clip.speaker;
    title.textContent = clip.title;
    transcript.textContent = clip.transcript;
    root.dataset.activeClip = clip.id;

    if (!synth || !Utterance) {
      setStatus('此瀏覽器無法播放語音，已顯示完整逐字稿。');
      finish(clip);
      return clip;
    }

    // 逐句排入佇列，避免部分瀏覽器朗讀長句時中途停住。
    const sentences = splitSentences(clip.transcript);
    try {
      sentences.forEach((sentence, index) => {
        const utterance = new Utterance(sentence);
        utterance.lang = 'zh-TW';
        utterance.rate = 0.86;
        utterance.pitch = 0.92;
        if (index === sentences.length - 1) {
          utterance.onend = () => {
            if (token !== playToken) return;
            setStatus('播放完畢。');
            finish(clip);
          };
        }
        utterance.onerror = (event) => {
          if (token !== playToken || ['interrupted', 'canceled'].includes(event?.error)) return;
          setPlaying(false);
          setStatus('語音播放失敗，已保留完整逐字稿。');
        };
        synth.speak(utterance);
      });
      setPlaying(true);
      setStatus('正在播放原型示意旁白。');
    } catch {
      setPlaying(false);
      setStatus('語音播放失敗，已保留完整逐字稿。');
    }
    return clip;
  }

  stopButton?.addEventListener('click', stop);

  setPlaying(false);
  setStatus('按下任一段才會發出聲音。');
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
