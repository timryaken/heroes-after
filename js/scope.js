// 收音機螢幕上的各頻率音量條（像音響的等化器）。錄音是嵌入的外部播放器，網頁讀不到真正的聲音，
// 所以這是「播放中」的模擬：整體音量照說話的節奏忽大忽小、偶爾停頓，低頻比高頻跳得高，每一條的頂端留一格慢慢落下的峰值。
const BANDS = 16;
const SEGMENTS = 10;

export function createScope(canvas, { reducedMotion = false } = {}) {
  const ctx = canvas?.getContext('2d');
  const levels = new Array(BANDS).fill(0);
  const peaks = new Array(BANDS).fill(0);
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

  // 每一條頻帶的目標高度：低頻高、高頻低，再加上一點各自的抖動。
  function bandTarget(band, time) {
    const tilt = 1 - (band / (BANDS - 1)) * 0.55;
    const wobble = 0.55 + 0.45 * Math.sin(time / 170 + band * 1.7) * Math.sin(time / 410 + band * 0.6);
    return Math.max(0, Math.min(1, envelope * tilt * (0.6 + 0.4 * wobble) + (Math.random() - 0.5) * 0.12 * envelope));
  }

  function draw(time) {
    if (!ctx) return;
    resize();
    const { width, height } = canvas;
    // 收音機放回桌上、螢幕看不見時寬度是 0：不畫。
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    if (playing && time > nextBeat) {
      // 一個音節 90–260ms；約一成的機率停頓一下。
      target = Math.random() < 0.12 ? 0.08 : 0.45 + Math.random() * 0.55;
      nextBeat = time + 90 + Math.random() * 170;
    }
    if (!playing) target = 0;
    envelope += (target - envelope) * (reducedMotion ? 1 : 0.2);

    const gap = Math.max(1, Math.round(width / 160));
    const barWidth = (width - gap * (BANDS - 1)) / BANDS;
    const segmentHeight = height / SEGMENTS;

    for (let band = 0; band < BANDS; band += 1) {
      const next = reducedMotion ? bandTarget(band, 0) : bandTarget(band, time);
      // 上升快、下降慢，看起來比較像真的音量表。
      levels[band] = next > levels[band] ? next : levels[band] + (next - levels[band]) * 0.18;
      peaks[band] = Math.max(levels[band], peaks[band] - 0.012);

      const x = band * (barWidth + gap);
      const lit = Math.max(1, Math.round(levels[band] * SEGMENTS));
      for (let segment = 0; segment < SEGMENTS; segment += 1) {
        const on = segment < lit;
        // 最上面兩格是琥珀色，其他是綠色；沒亮的格子留淡淡的底。
        const hot = segment >= SEGMENTS - 2;
        ctx.fillStyle = on
          ? (hot ? 'rgba(255, 196, 92, 0.95)' : `rgba(200, 255, 138, ${playing ? 0.9 : 0.45})`)
          : 'rgba(200, 255, 138, 0.08)';
        ctx.fillRect(x, height - (segment + 1) * segmentHeight + gap, barWidth, segmentHeight - gap);
      }
      if (playing && peaks[band] > 0.05) {
        const peakSegment = Math.min(SEGMENTS - 1, Math.round(peaks[band] * SEGMENTS));
        ctx.fillStyle = 'rgba(255, 230, 170, 0.9)';
        ctx.fillRect(x, height - (peakSegment + 1) * segmentHeight + gap, barWidth, Math.max(1, (segmentHeight - gap) * 0.35));
      }
    }
  }

  function loop(time) {
    draw(time);
    frame = active && !reducedMotion ? requestAnimationFrame(loop) : 0;
  }

  return {
    setPlaying(value) {
      playing = Boolean(value);
      if (reducedMotion) {
        envelope = playing ? 0.7 : 0;
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
