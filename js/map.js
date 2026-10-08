const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> 貢獻者';

function photoMarkup(photo, label) {
  return `
    <figure class="comparison-card">
      <span>${label}</span>
      <img src="${photo.src}" alt="${photo.alt}">
      <figcaption>${photo.credit} · <a href="${photo.sourceUrl}" target="_blank" rel="noreferrer">原始報導</a></figcaption>
    </figure>
  `;
}

export function placePanelMarkup(place) {
  return `
    <header><p class="eyebrow">${place.era}</p><h3>${place.name}</h3><p>${place.summary}</p></header>
    <div class="comparison-grid">${photoMarkup(place.before, '那時')}${photoMarkup(place.after, '現在')}</div>
    <blockquote>${place.note}</blockquote>
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
    // 面板出現後地圖會變窄，等版面更新再重算尺寸並移到該點位。
    requestAnimationFrame(() => {
      map?.invalidateSize();
      map?.panTo([place.lat, place.lng], { animate: true });
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    onSelect?.(place);
  }

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
