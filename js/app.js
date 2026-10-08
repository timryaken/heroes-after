import { daysSinceDisaster } from './core.js';
import { createAudioController } from './audio.js';
import { DESK_TEXTURE, INTERACTIVE_DESK, NOTEBOOK_PAGES, PLACES, PROLOGUE_SLIDES, REPORTER_PHOTO, ROLES, VOICE_CLIPS } from './data.js';
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
const roleWelcome = document.querySelector('[data-role-welcome]');
const sourcesDialog = document.querySelector('[data-sources-dialog]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const deskRoot = document.querySelector('[data-desk]');
const desk = createDeskController(deskRoot, store);
createStoryContentController(document, {
  notebookPages: NOTEBOOK_PAGES,
  reporterPhoto: REPORTER_PHOTO,
});
const forms = createFormsController(document, store, { roles: ROLES });
const placeMap = createMapController(document.querySelector('[data-object-dialog="map"]'), PLACES, {
  onSelect: () => desk.markDone('map'),
});
const audio = createAudioController(document.querySelector('[data-object-dialog="speaker"]'), VOICE_CLIPS, {
  listened: store.load().listened,
  onComplete: (id, listened) => {
    store.save({ listened });
    if (listened.length === VOICE_CLIPS.length) desk.markDone('speaker');
  },
});

function renderSources() {
  const sourceList = document.querySelector('[data-source-list]');
  const photos = [
    ...PROLOGUE_SLIDES,
    ...PLACES.flatMap((place) => [place.before, place.after]),
    REPORTER_PHOTO,
    DESK_TEXTURE,
    INTERACTIVE_DESK,
  ];
  const unique = [...new Map(photos.map((photo) => [`${photo.src}|${photo.credit}`, photo])).values()];
  for (const photo of unique) {
    const item = document.createElement('li');
    item.innerHTML = `<span>${photo.alt}</span><small>${photo.credit}</small><a href="${photo.sourceUrl}" target="_blank" rel="noreferrer">查看來源 ↗</a>`;
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
  roleWelcome.textContent = role.invitation;
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
    <span class="role-choice__label">${role.label}</span>
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
document.addEventListener('forms:posted', () => desk.markDone('computer'));
document.addEventListener('forms:email-saved', () => desk.markDone('notebook'));
document.addEventListener('story:photo-flipped', () => desk.markDone('photo'));
document.addEventListener('forms:reset', () => {
  desk.reset();
  audio.setListened([]);
  if (sourcesDialog.open) sourcesDialog.close();
  openDialog(roleDialog);
});

if (!store.persistent) document.querySelector('[data-save-notice]').hidden = false;
prologue.start();
