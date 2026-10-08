export function pickDifferentClip(clips, currentId = '', random = Math.random) {
  if (!clips.length) return null;
  if (clips.length === 1) return clips[0];
  const candidates = clips.filter((clip) => clip.id !== currentId);
  return candidates[Math.floor(random() * candidates.length)] ?? candidates[0];
}

export function createAudioController(root, clips, options = {}) {
  const playButton = root.querySelector('[data-audio-play]');
  const stopButton = root.querySelector('[data-audio-stop]');
  const speaker = root.querySelector('[data-audio-speaker]');
  const title = root.querySelector('[data-audio-title]');
  const transcript = root.querySelector('[data-audio-transcript]');
  const status = root.querySelector('[data-audio-status]');
  const synth = options.synth ?? window.speechSynthesis;
  const Utterance = options.Utterance ?? window.SpeechSynthesisUtterance;
  let currentId = '';
  let speaking = false;
  let muted = false;

  function setStatus(message) {
    status.textContent = message;
  }

  function renderClip(clip) {
    speaker.textContent = clip.speaker;
    title.textContent = clip.title;
    transcript.textContent = clip.transcript;
    root.dataset.activeClip = clip.id;
  }

  function stop() {
    synth?.cancel?.();
    speaking = false;
    playButton.setAttribute('aria-pressed', 'false');
    playButton.querySelector('[data-play-label]').textContent = '隨機播放一段';
    setStatus(currentId ? '已停止。逐字稿仍可閱讀。' : '尚未播放。');
  }

  function playRandom() {
    if (muted) {
      setStatus('目前為靜音。請先從右上角開啟聲音；逐字稿仍可閱讀。');
      return null;
    }
    const clip = pickDifferentClip(clips, currentId);
    if (!clip) {
      setStatus('目前沒有可播放的原型旁白。');
      return null;
    }
    stop();
    currentId = clip.id;
    renderClip(clip);

    if (!synth || !Utterance) {
      setStatus('此瀏覽器無法播放語音，已顯示完整逐字稿。');
      return clip;
    }

    try {
      const utterance = new Utterance(clip.transcript);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.86;
      utterance.pitch = 0.92;
      utterance.onend = () => {
        speaking = false;
        playButton.setAttribute('aria-pressed', 'false');
        playButton.querySelector('[data-play-label]').textContent = '再聽一段';
        setStatus('播放完畢。你也可以繼續閱讀逐字稿。');
      };
      utterance.onerror = () => {
        speaking = false;
        playButton.setAttribute('aria-pressed', 'false');
        setStatus('語音播放失敗，已保留完整逐字稿。');
      };
      speaking = true;
      playButton.setAttribute('aria-pressed', 'true');
      playButton.querySelector('[data-play-label]').textContent = '播放中…';
      setStatus('正在播放原型示意旁白。');
      synth.speak(utterance);
    } catch {
      speaking = false;
      setStatus('語音播放失敗，已保留完整逐字稿。');
    }
    return clip;
  }

  playButton?.addEventListener('click', () => {
    if (speaking) stop();
    else playRandom();
  });
  stopButton?.addEventListener('click', stop);

  setStatus('尚未播放。按下按鈕後才會發出聲音。');
  return {
    playRandom,
    stop,
    setMuted(value) {
      muted = Boolean(value);
      if (muted) stop();
    },
    destroy: stop,
  };
}
