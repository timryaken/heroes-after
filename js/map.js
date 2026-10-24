// 紙本地圖：底圖是依 OpenStreetMap 資料由 AI 重新繪製的一張圖，四個地點用經緯度換算成圖上的百分比位置釘上去。
export function mapPosition({ lat, lng }, bounds) {
  return {
    x: ((lng - bounds.west) / (bounds.east - bounds.west)) * 100,
    y: ((bounds.north - lat) / (bounds.north - bounds.south)) * 100,
  };
}

// 對照照片做成釘在地圖上的拍立得。
function photoMarkup(photo, label) {
  const media = photo.placeholder
    ? `<div class="polaroid__placeholder">${photo.label}</div>`
    : `<img src="${photo.src}" alt="${photo.alt}">`;
  const credit = photo.placeholder
    ? '待補照片'
    : `${photo.credit} · <a href="${photo.sourceUrl}" target="_blank" rel="noreferrer">原始圖片</a>`;
  return `
    <figure class="polaroid">
      ${media}
      <span class="polaroid__label">${label}</span>
      <figcaption>${credit}</figcaption>
    </figure>
  `;
}

export function placePanelMarkup(place) {
  const reading = place.reading
    ? `<p class="place-reading"><a href="${place.reading}" target="_blank" rel="noreferrer">相關報導 ↗</a></p>`
    : '';
  return `
    <button class="place-panel__close" type="button" data-place-close aria-label="收起${place.name}的照片">×</button>
    <header class="place-card"><p class="eyebrow">${place.era}</p><h3>${place.name}</h3><p>${place.summary}</p>${reading}</header>
    <div class="polaroids">${photoMarkup(place.before, '災害當下')}${photoMarkup(place.after, '災害後')}</div>
  `;
}

export function createMapController(root, places, base, { onSelect } = {}) {
  const canvas = root.querySelector('[data-map-canvas]');
  const panel = root.querySelector('[data-place-panel]');
  const legend = root.querySelector('[data-place-list]');
  const overlayPanel = window.matchMedia('(min-width: 900px)');
  let selectedId = '';

  const paper = canvas.querySelector('img');
  paper.src = base.src;
  paper.alt = base.alt;

  const pins = places.map((place, index) => {
    const { x, y } = mapPosition(place, base.bounds);
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = place.labelSide === 'left' ? 'place-pin place-pin--left' : 'place-pin';
    pin.dataset.placeId = place.id;
    pin.style.left = `${x.toFixed(2)}%`;
    pin.style.top = `${y.toFixed(2)}%`;
    pin.setAttribute('aria-pressed', 'false');
    pin.innerHTML = `<span class="place-pin__dot" aria-hidden="true">${index + 1}</span><span class="place-pin__name">${place.name}</span>`;
    pin.addEventListener('click', () => select(place.id));
    canvas.append(pin);
    return pin;
  });

  const chips = places.map((place, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.placeId = place.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<b>${index + 1}</b>${place.name}`;
    button.addEventListener('click', () => select(place.id));
    legend.append(button);
    return button;
  });

  function markSelected(id) {
    for (const button of [...pins, ...chips]) {
      button.setAttribute('aria-pressed', String(button.dataset.placeId === id));
      button.classList.toggle('is-selected', button.dataset.placeId === id);
    }
  }

  function select(id) {
    const place = places.find((item) => item.id === id);
    if (!place) return;
    selectedId = id;
    panel.innerHTML = placePanelMarkup(place);
    panel.hidden = false;
    markSelected(id);
    if (!overlayPanel.matches) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    onSelect?.(place);
  }

  panel.addEventListener('click', (event) => {
    if (!event.target.closest('[data-place-close]')) return;
    const id = selectedId;
    selectedId = '';
    panel.hidden = true;
    panel.replaceChildren();
    markSelected('');
    chips.find((button) => button.dataset.placeId === id)?.focus({ preventScroll: true });
  });

  // 手機上地圖比畫面寬：打開時先捲到市區（四個地點大約在中間偏左）。
  function reveal() {
    const scroller = root.querySelector('[data-map-scroll]');
    if (scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) * 0.4;
  }

  return { select, reveal };
}
