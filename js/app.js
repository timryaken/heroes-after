import { daysSinceDisaster } from './core.js';
import { createAudioController } from './audio.js';
import { createChecklistController } from './checklist.js';
import { CHECKLIST, DESK_TEXTURE, INTERACTIVE_DESK, NOTEBOOK_PAGES, PHOTO_STACK, PLACES, PROLOGUE_SLIDES, ROLES, VOICE_CLIPS } from './data.js';
import { createDeskController, createStoryContentController } from './desk.js';
import { createFormsController } from './forms.js';
import { createMapController } from './map.js';
import { createPrologueController } from './prologue.js';
import { createPrototypeStore } from './storage.js';

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return {
      getItem() { throw new Error('storage unavailable'); },
      setItem() { throw new Error('storage unavailable'); },
      removeItem() { throw new Error('storage unavailable'); },
    };
  }
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

const store = createPrototypeStore(browserStorage());
const prologueRoot = document.querySelector('[data-prologue]');
const experience = document.querySelector('#experience');
const roleDialog = document.querySelector('[data-role-dialog]');
const roleOptions = document.querySelector('[data-role-options]');
const roleHeadline = document.querySelector('[data-role-headline]');
const sourcesDialog = document.querySelector('[data-sources-dialog]');
const departDialog = document.querySelector('[data-depart-dialog]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const deskRoot = document.querySelector('[data-desk]');
const desk = createDeskController(deskRoot, store);
createStoryContentController(document, {
  notebookPages: NOTEBOOK_PAGES,
  photos: PHOTO_STACK,
});
const forms = createFormsController(document, store, { roles: ROLES });
const checklist = createChecklistController(document.querySelector('[data-checklist]'), CHECKLIST, {
  onOpenItem: (id, trigger) => desk.openObject(id, trigger),
  onDepart: () => openDialog(departDialog),
});

function complete(id) {
  checklist.update(desk.markDone(id));
}

const placeMap = createMapController(document.querySelector('[data-object-dialog="map"]'), PLACES, {
  onSelect: () => complete('map'),
});
// CHECK LIST 只要求至少聽過一段錄音。
const audio = createAudioController(document.querySelector('[data-object-dialog="speaker"]'), VOICE_CLIPS, {
  listened: store.load().listened,
  onComplete: (id, listened) => {
    store.save({ listened });
    complete('speaker');
  },
});

function renderSources() {
  const sourceList = document.querySelector('[data-source-list]');
  const photos = [
    ...PROLOGUE_SLIDES,
    ...PLACES.flatMap((place) => [place.before, place.after]),
    ...PHOTO_STACK,
    DESK_TEXTURE,
    INTERACTIVE_DESK,
  ].filter((photo) => !photo.placeholder);
  const unique = [...new Map(photos.map((photo) => [`${photo.src}|${photo.credit}`, photo])).values()];
  const entries = [
    ...unique.map((photo) => ({ label: photo.alt, credit: photo.credit, url: photo.sourceUrl })),
    ...VOICE_CLIPS.map((clip) => ({ label: `錄音：${clip.title}`, credit: `${clip.speaker}（嵌入原平台播放器，授權確認中）`, url: clip.sourceUrl })),
  ];
  for (const entry of entries) {
    const item = document.createElement('li');
    item.innerHTML = `<span>${entry.label}</span><small>${entry.credit}</small><a href="${entry.url}" target="_blank" rel="noreferrer">查看來源 ↗</a>`;
    sourceList.append(item);
  }
}

renderSources();

const prologue = createPrologueController(prologueRoot, {
  slides: PROLOGUE_SLIDES,
  days: daysSinceDisaster(new Date()),
  reducedMotion,
});

function enterDesk(roleId) {
  const role = ROLES.find(({ id }) => id === roleId) ?? ROLES[2];
  roleHeadline.textContent = role.headline;
  forms.hydrate();
  roleDialog.close();
  experience.hidden = false;
  experience.focus({ preventScroll: true });
  document.dispatchEvent(new CustomEvent('role:selected', {
    detail: { role: role.id },
  }));
}

for (const [index, role] of ROLES.entries()) {
  const button = document.createElement('button');
  button.className = 'role-choice';
  button.type = 'button';
  button.innerHTML = `
    <span class="role-choice__index">0${index + 1}</span>
    <span class="role-choice__label">${role.label}<small>${role.relation}</small></span>
    <span aria-hidden="true">→</span>
  `;
  button.addEventListener('click', () => {
    store.save({ role: role.id });
    enterDesk(role.id);
  });
  roleOptions.append(button);
}

prologueRoot.addEventListener('prologue:complete', () => {
  const { role } = store.load();
  if (role) enterDesk(role);
  else openDialog(roleDialog);
});

document.querySelector('[data-replay]').addEventListener('click', () => {
  experience.hidden = true;
  if (roleDialog.open) roleDialog.close();
  prologue.replay();
});

document.querySelector('[data-open-sources]').addEventListener('click', () => openDialog(sourcesDialog));

document.querySelector('[data-mute]').addEventListener('click', (event) => {
  const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true';
  event.currentTarget.setAttribute('aria-pressed', String(!pressed));
  event.currentTarget.querySelector('.control-label').textContent = pressed ? '聲音' : '已靜音';
  audio.setMuted(!pressed);
});

deskRoot.addEventListener('desk:object-opened', (event) => {
  if (event.detail.id === 'map') placeMap.ensureMap();
});
deskRoot.addEventListener('desk:object-closed', (event) => {
  if (event.detail.id === 'speaker') audio.stop();
});
document.addEventListener('forms:posted', () => complete('computer'));
document.addEventListener('story:notebook-finished', () => complete('notebook'));
document.addEventListener('story:photo-viewed', () => complete('photo'));
document.addEventListener('forms:reset', () => {
  desk.reset();
  audio.setListened([]);
  checklist.update([]);
  if (sourcesDialog.open) sourcesDialog.close();
  if (departDialog.open) departDialog.close();
  openDialog(roleDialog);
});

departDialog.querySelector('[data-close-depart]').addEventListener('click', () => departDialog.close());
departDialog.addEventListener('click', (event) => {
  if (event.target === departDialog) departDialog.close();
});
checklist.update(store.load().completed);

if (!store.persistent) document.querySelector('[data-save-notice]').hidden = false;
prologue.start();
