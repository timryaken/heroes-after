import { daysSinceDisaster } from './core.js';
import { createAudioController } from './audio.js';
import { createBoardController } from './board.js';
import { createBoardApi } from './board-api.js';
import { BOARD_CONFIG } from './board-config.js';
import { createChecklistController } from './checklist.js';
import { BOARD_SAMPLE_POSTS, CHECKLIST, CLIPBOARD, DESK_TEXTURE, GUANGFU_MAP, INTERACTIVE_DESK, INTERACTIVE_DESK_MOBILE, LAPTOP_FRONT, NOTEBOOK_PAGES, PHOTO_STACK, PLACES, PROLOGUE_SLIDES, RADIO_FRONT, ROLES, SPEAKER_PHOTO, VOICE_CLIPS } from './data.js';
import { createDeskController, createStoryContentController } from './desk.js';
import { createDeskView } from './desk-view.js';
import { createFeedbackApi, createFeedbackController } from './feedback.js';
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
const desk = createDeskController(deskRoot, store, { reducedMotion });
const story = createStoryContentController(document, {
  notebookPages: NOTEBOOK_PAGES,
  photos: PHOTO_STACK,
  reducedMotion,
});
createFormsController(document, store);
const deskView = createDeskView(deskRoot);
const board = createBoardController(
  document.querySelector('[data-object-dialog="computer"]'),
  createBoardApi(BOARD_CONFIG, { storage: browserStorage() }),
  { roles: ROLES, samples: BOARD_SAMPLE_POSTS, showSamples: BOARD_CONFIG.showSamples, getRole: () => store.load().role },
);
const feedback = createFeedbackController(departDialog, createFeedbackApi(BOARD_CONFIG, { storage: browserStorage() }), {
  getRole: () => store.load().role,
});
const checklist = createChecklistController(document.querySelector('[data-checklist]'), CHECKLIST, {
  onOpenItem: (id, trigger) => desk.openObject(id, trigger),
  onDepart: () => openDialog(departDialog),
});

function complete(id) {
  checklist.update(desk.markDone(id));
}

const placeMap = createMapController(document.querySelector('[data-object-dialog="map"]'), PLACES, GUANGFU_MAP, {
  onSelect: () => complete('map'),
});
// CHECK LIST 只要求至少聽過一段錄音。
const audio = createAudioController(document.querySelector('[data-object-dialog="speaker"]'), VOICE_CLIPS, {
  listened: store.load().listened,
  reducedMotion,
  // 右邊的音量旋鈕和右上角的聲音開關是同一個。
  onVolume: () => document.querySelector('[data-mute]').click(),
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
    SPEAKER_PHOTO,
    RADIO_FRONT,
    LAPTOP_FRONT,
    CLIPBOARD,
    GUANGFU_MAP,
    ...BOARD_SAMPLE_POSTS.filter((post) => post.photo).map((post) => ({ ...post.photo, credit: 'AI 生成示意圖（讀者版示意留言）', sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/' })),
    DESK_TEXTURE,
    INTERACTIVE_DESK,
    INTERACTIVE_DESK_MOBILE,
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

function renderSpeakerPhoto() {
  const figure = document.querySelector('[data-speaker-photo]');
  const image = figure.querySelector('img');
  image.src = SPEAKER_PHOTO.src;
  image.alt = SPEAKER_PHOTO.alt;
  figure.querySelector('figcaption').innerHTML = `${SPEAKER_PHOTO.credit} · <a href="${SPEAKER_PHOTO.sourceUrl}" target="_blank" rel="noreferrer">原始圖片</a>`;
}

renderSpeakerPhoto();

const prologue = createPrologueController(prologueRoot, {
  slides: PROLOGUE_SLIDES,
  days: daysSinceDisaster(new Date()),
  reducedMotion,
});

function enterDesk(roleId) {
  const role = ROLES.find(({ id }) => id === roleId) ?? ROLES[2];
  roleHeadline.textContent = role.headline;
  board.hydrate();
  roleDialog.close();
  experience.hidden = false;
  experience.focus({ preventScroll: true });
  deskView.show();
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

// 身分每次進來都重新問，不沿用上次的選擇。
store.save({ role: '' });
prologueRoot.addEventListener('prologue:complete', () => openDialog(roleDialog));
// 一定要選一個身分才進得了桌面，按 Esc 不會把問題關掉。
roleDialog.addEventListener('cancel', (event) => event.preventDefault());

document.querySelector('[data-open-sources]').addEventListener('click', () => openDialog(sourcesDialog));

document.querySelector('[data-mute]').addEventListener('click', (event) => {
  const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true';
  event.currentTarget.setAttribute('aria-pressed', String(!pressed));
  event.currentTarget.setAttribute('aria-label', pressed ? '切換聲音' : '目前靜音，按一下開啟聲音');
  audio.setMuted(!pressed);
});

deskRoot.addEventListener('desk:object-opened', (event) => {
  if (event.detail.id === 'map') placeMap.reveal();
  if (event.detail.id === 'computer') board.load();
  if (event.detail.id === 'speaker') audio.setActive(true);
});
deskRoot.addEventListener('desk:object-closed', (event) => {
  if (event.detail.id !== 'speaker') return;
  audio.stop();
  audio.setActive(false);
});
document.addEventListener('forms:posted', () => complete('computer'));
document.addEventListener('story:notebook-finished', () => complete('notebook'));
document.addEventListener('story:photo-viewed', () => complete('photo'));
document.addEventListener('forms:reset', () => {
  desk.reset();
  board.reset();
  audio.setListened([]);
  story.setBookOpen(false);
  feedback.reset();
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
