// 收音機螢幕上的示波器。錄音是嵌入的外部播放器，網頁讀不到真正的聲音，所以這是「播放中」的模擬波形：
// 用幾個正弦波疊加，振幅照說話的節奏忽大忽小、偶爾停頓。
export function createScope(canvas, { reducedMotion = false } = {}) {
  const ctx = canvas?.getContext('2d');
  let frame = 0;
  let active = false;
  let playing = false;
  let envelope = 0;
  let target = 0;
  let nextBeat = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(canvas.clientWidth * ratio);
    const height = Math.round(canvas.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function draw(time) {
    if (!ctx) return;
    resize();
    const { width, height } = canvas;
    const mid = height / 2;
    ctx.clearRect(0, 0, width, height);

    // 刻度格線
    ctx.strokeStyle = 'rgba(190, 240, 120, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += width / 12) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.moveTo(0, mid);
    ctx.lineTo(width, mid);
    ctx.stroke();

    if (playing && time > nextBeat) {
      // 一個音節 90–260ms；約一成的機率停頓一下。
      target = Math.random() < 0.12 ? 0.06 : 0.3 + Math.random() * 0.7;
      nextBeat = time + 90 + Math.random() * 170;
    }
    if (!playing) target = 0.035;
    envelope += (target - envelope) * (reducedMotion ? 1 : 0.18);

    const t = reducedMotion ? 0 : time / 1000;
    ctx.strokeStyle = playing ? '#c8ff8a' : 'rgba(200, 255, 138, 0.55)';
    ctx.shadowColor = 'rgba(180, 255, 110, 0.9)';
    ctx.shadowBlur = playing ? 8 * (window.devicePixelRatio || 1) : 0;
    ctx.lineWidth = Math.max(1.2, height / 26);
    ctx.beginPath();
    for (let x = 0; x <= width; x += 2) {
      const p = x / width;
      const wave = Math.sin(p * 31 + t * 19) * 0.55
        + Math.sin(p * 83 - t * 37) * 0.28
        + Math.sin(p * 9 + t * 5) * 0.17;
      // 兩端收窄，看起來像掃描線中央的訊號。
      const taper = Math.sin(Math.PI * p) ** 0.6;
      const y = mid + wave * envelope * taper * mid * 0.9;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function loop(time) {
    draw(time);
    frame = active && !reducedMotion ? requestAnimationFrame(loop) : 0;
  }

  return {
    setPlaying(value) {
      playing = Boolean(value);
      if (reducedMotion) {
        envelope = playing ? 0.7 : 0.035;
        draw(performance.now());
      }
    },
    // 收音機拿起來才跑動畫，放回桌上就停，避免背景一直耗電。
    setActive(value) {
      active = Boolean(value);
      cancelAnimationFrame(frame);
      frame = 0;
      if (active) frame = requestAnimationFrame(loop);
    },
  };
}
