// Leonida Trophy Atlas — bootstrap: loads the trophy data, wires the controls, and keeps the checklist, detail panel, roadmap and progress bar in sync.
import { exportEarned, importEarned, loadEarned, saveEarned, toggleEarned } from './state.js';
import { renderChecklist } from './render-list.js';
import { renderDetail } from './render-detail.js';
import { renderRoadmap } from './render-roadmap.js';

const listEl = document.getElementById('trophyList');
const summaryEl = document.getElementById('listSummary');
const emptyEl = document.getElementById('emptyNote');
const detailPanel = document.getElementById('detailPanel');
const searchInput = document.getElementById('search');
const gradeSelect = document.getElementById('grade');
const spoilerToggle = document.getElementById('spoiler');
const earnedOnlyToggle = document.getElementById('earnedOnly');
const kindFilters = document.getElementById('kindFilters');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const importNote = document.getElementById('importNote');
const resetBtn = document.getElementById('resetBtn');
const earnedCountEl = document.getElementById('earnedCount');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const progressDetail = document.getElementById('progressDetail');
const checklistView = document.getElementById('checklistView');
const roadmapView = document.getElementById('roadmapView');
const roadmapStages = document.getElementById('roadmapStages');
const missableBox = document.getElementById('missableBox');
const tabChecklist = document.getElementById('tabChecklist');
const tabRoadmap = document.getElementById('tabRoadmap');

const params = new URLSearchParams(location.search);
const filters = {
  kind: params.get('filter') ?? 'all',
  grade: params.get('grade') ?? 'all',
  search: '',
  spoilerOn: params.get('spoiler') !== 'off',
  earnedOnly: false,
};
if (!['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(filters.kind)) filters.kind = 'all';
if (!['all', 'platinum', 'gold', 'silver', 'bronze'].includes(filters.grade)) filters.grade = 'all';

let earned = loadEarned();
let trophies = [];
let selectedName = null;

const response = await fetch('data/trophies.json');
const doc = await response.json();
trophies = doc.trophies;

const preselectId = Number(params.get('select') ?? 28);
const preselect = trophies.find((t) => t.id === preselectId) ?? trophies[27];
selectedName = preselect.name;

function renderProgress() {
  const total = trophies.length;
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) if (earned.has(trophy.name)) byGrade[trophy.grade]++;
  earnedCountEl.textContent = String(earned.size);
  progressFill.style.width = `${total ? (earned.size / total) * 100 : 0}%`;
  progressBar.setAttribute('aria-valuenow', String(earned.size));
  progressDetail.textContent = `${byGrade.platinum} platinum · ${byGrade.gold} gold · ${byGrade.silver} silver · ${byGrade.bronze} bronze`;
}

function renderAll() {
  renderProgress();
  renderChecklist(listEl, summaryEl, emptyEl, trophies, filters, earned, selectedName,
    (name) => { earned = toggleEarned(earned, name); renderAll(); },
    (name) => { selectedName = name; renderAll(); });
  const selected = trophies.find((t) => t.name === selectedName) ?? null;
  renderDetail(detailPanel, selected, filters, earned);
  renderRoadmap(roadmapStages, missableBox, trophies, earned);
}

function setView(view) {
  const roadmap = view === 'roadmap';
  checklistView.hidden = roadmap;
  roadmapView.hidden = !roadmap;
  tabChecklist.classList.toggle('is-active', !roadmap);
  tabRoadmap.classList.toggle('is-active', roadmap);
}

function syncFilterChips() {
  for (const chip of kindFilters.querySelectorAll('.chip')) {
    chip.classList.toggle('is-active', chip.dataset.kind === filters.kind);
  }
}

kindFilters.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  filters.kind = chip.dataset.kind;
  syncFilterChips();
  renderAll();
});
gradeSelect.addEventListener('change', () => { filters.grade = gradeSelect.value; renderAll(); });
searchInput.addEventListener('input', () => { filters.search = searchInput.value.trim(); renderAll(); });
spoilerToggle.addEventListener('change', () => { filters.spoilerOn = spoilerToggle.checked; renderAll(); });
earnedOnlyToggle.addEventListener('change', () => { filters.earnedOnly = earnedOnlyToggle.checked; renderAll(); });
tabChecklist.addEventListener('click', () => setView('checklist'));
tabRoadmap.addEventListener('click', () => setView('roadmap'));

exportBtn.addEventListener('click', () => {
  const count = exportEarned(earned);
  importNote.textContent = `Exported ${count} earned ${count === 1 ? 'trophy' : 'trophies'} to gta6-trophy-progress.json.`;
});
importFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const result = await importEarned(file, trophies.map((t) => t.name));
    earned = loadEarned();
    importNote.textContent = `Imported ${result.imported} earned ${result.imported === 1 ? 'trophy' : 'trophies'}${result.skipped ? ` (${result.skipped} entries skipped — not in the official list)` : ''}.`;
  } catch {
    importNote.textContent = 'That file is not a trophy progress export. Nothing was changed.';
  }
  event.target.value = '';
  renderAll();
});
resetBtn.addEventListener('click', () => {
  earned = new Set();
  saveEarned(earned);
  importNote.textContent = 'Progress cleared.';
  renderAll();
});

// Deep links used by the guide itself: ?view=roadmap, ?filter=missable, ?spoiler=off, ?select=<id>.
gradeSelect.value = filters.grade;
spoilerToggle.checked = filters.spoilerOn;
syncFilterChips();
if (params.get('view') === 'roadmap') setView('roadmap');
renderAll();
