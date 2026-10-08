import { daysSinceDisaster } from './core.js';
import { PROLOGUE_SLIDES, ROLES } from './data.js';
import { createDeskController } from './desk.js';
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
const roleWelcome = document.querySelector('[data-role-welcome]');
const sourcesDialog = document.querySelector('[data-sources-dialog]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const deskRoot = document.querySelector('[data-desk]');
const drawer = document.querySelector('.object-drawer');
const drawerToggle = document.querySelector('[data-drawer-toggle]');
const desk = createDeskController(deskRoot, store);

const prologue = createPrologueController(prologueRoot, {
  slides: PROLOGUE_SLIDES,
  days: daysSinceDisaster(new Date()),
  reducedMotion,
});

function enterDesk(roleId) {
  const role = ROLES.find(({ id }) => id === roleId) ?? ROLES[2];
  roleWelcome.textContent = role.invitation;
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
});

function updateDeskProgress() {
  const count = store.load().explored.length;
  drawerToggle.querySelector('span').textContent = `${count} / 6`;
}

drawerToggle.addEventListener('click', () => {
  const open = drawer.classList.toggle('is-open');
  drawerToggle.setAttribute('aria-expanded', String(open));
});

deskRoot.addEventListener('desk:object-opened', updateDeskProgress);
deskRoot.addEventListener('desk:reset', updateDeskProgress);
updateDeskProgress();

if (!store.persistent) document.querySelector('[data-save-notice]').hidden = false;
prologue.start();
