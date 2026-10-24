const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> 貢獻者';

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

function pinIcon(L, place, index) {
  return L.divIcon({
    className: place.labelSide === 'left' ? 'place-pin place-pin--left' : 'place-pin',
    html: `<span class="place-pin__dot">${index + 1}</span><span class="place-pin__name">${place.name}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function createMapController(root, places, { onSelect } = {}) {
  const canvas = root.querySelector('[data-map-canvas]');
  const panel = root.querySelector('[data-place-panel]');
  const legend = root.querySelector('[data-place-list]');
  const markers = new Map();
  const overlayPanel = window.matchMedia('(min-width: 900px)');
  let map = null;
  let selectedId = '';

  function select(id) {
    const place = places.find((item) => item.id === id);
    if (!place) return;
    selectedId = id;
    panel.innerHTML = placePanelMarkup(place);
    panel.hidden = false;
    for (const button of legend.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.placeId === id));
    }
    for (const [placeId, marker] of markers) {
      marker.getElement()?.classList.toggle('is-selected', placeId === id);
    }
    centerOn(place);
    if (!overlayPanel.matches) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    onSelect?.(place);
  }

  // 寬螢幕上照片釘在地圖右側，點位要移到左邊沒被擋住的地方；窄螢幕照片排在地圖下面。
  function centerOn(place) {
    if (!map) return;
    map.invalidateSize({ pan: false });
    const shift = overlayPanel.matches && !panel.hidden ? panel.offsetWidth / 2 : 0;
    const zoom = map.getZoom();
    const point = map.project([place.lat, place.lng], zoom).add([shift, 0]);
    map.panTo(map.unproject(point, zoom), { animate: true });
  }

  function clearSelection() {
    selectedId = '';
    panel.hidden = true;
    panel.replaceChildren();
    for (const button of legend.querySelectorAll('button')) button.setAttribute('aria-pressed', 'false');
    for (const marker of markers.values()) marker.getElement()?.classList.remove('is-selected');
  }

  panel.addEventListener('click', (event) => {
    if (!event.target.closest('[data-place-close]')) return;
    const id = selectedId;
    clearSelection();
    legend.querySelector(`[data-place-id="${id}"]`)?.focus({ preventScroll: true });
  });

  function ensureMap() {
    if (map) {
      map.invalidateSize();
      return;
    }
    const L = window.L;
    if (!L || !canvas) {
      root.dataset.mapUnavailable = 'true';
      return;
    }
    map = L.map(canvas, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer(TILE_URL, { maxZoom: 18, attribution: TILE_ATTRIBUTION }).addTo(map);
    places.forEach((place, index) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: pinIcon(L, place, index),
        title: place.name,
        alt: place.name,
        keyboard: true,
      }).addTo(map);
      marker.on('click', () => select(place.id));
      markers.set(place.id, marker);
    });
    // 左右多留空間，讓點位旁的地名不會被地圖邊緣切掉。
    map.fitBounds(places.map(({ lat, lng }) => [lat, lng]), { paddingTopLeft: [80, 48], paddingBottomRight: [80, 48] });
    if (selectedId) select(selectedId);
  }

  places.forEach((place, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.placeId = place.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<b>${index + 1}</b>${place.name}`;
    button.addEventListener('click', () => select(place.id));
    legend?.append(button);
  });

  return { ensureMap, select };
}
