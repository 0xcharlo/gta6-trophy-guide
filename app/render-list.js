// Checklist rendering: one card per trophy, with its official name, description, grade, kind tags and checkbox.
import { countLabel, gradeLabel, isSpoilerHidden, spoilerDescription, spoilerName, visibleTrophies } from './filters.js';

const GRADE_MARKS = { platinum: '◆', gold: '●', silver: '●', bronze: '●' };

export function renderChecklist(listEl, summaryEl, emptyEl, trophies, filters, earned, selectedName, onToggle, onSelect) {
  const shown = visibleTrophies(trophies, filters, earned);
  const earnedShown = shown.filter((t) => earned.has(t.name)).length;
  summaryEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies — ${earnedShown} earned in this view.`;
  emptyEl.hidden = shown.length !== 0;
  listEl.replaceChildren();
  for (const trophy of shown) {
    const hidden = isSpoilerHidden(trophy, filters.spoilerOn, earned);
    const item = document.createElement('li');
    item.className = 'trophy-card' + (earned.has(trophy.name) ? ' is-earned' : '') + (trophy.name === selectedName ? ' is-selected' : '');
    item.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT') return;
      onSelect(trophy.name);
    });

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Earned: ${trophy.name}`);
    box.addEventListener('change', () => onToggle(trophy.name));
    box.addEventListener('click', (event) => event.stopPropagation());
    item.append(box);

    const body = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'trophy-name' + (hidden ? ' spoiler-hidden' : '');
    name.textContent = hidden ? spoilerName(trophy) : trophy.name;
    const desc = document.createElement('p');
    desc.className = 'trophy-desc' + (hidden ? ' spoiler-hidden' : '');
    desc.textContent = hidden ? spoilerDescription() : trophy.description;
    body.append(name, desc);

    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    const gradeTag = document.createElement('span');
    gradeTag.className = `tag grade-${trophy.grade}`;
    gradeTag.textContent = gradeLabel(trophy.grade);
    tags.append(gradeTag);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = trophy.kind;
    tags.append(kindTag);
    if (trophy.hidden) {
      const hiddenTag = document.createElement('span');
      hiddenTag.className = 'tag hidden-trophy';
      hiddenTag.textContent = 'Hidden on PS5';
      tags.append(hiddenTag);
    }
    if (trophy.missable) {
      const missTag = document.createElement('span');
      missTag.className = 'tag missable';
      missTag.textContent = 'Possibly missable';
      tags.append(missTag);
    }
    const count = countLabel(trophy);
    if (count) {
      const countTag = document.createElement('span');
      countTag.className = 'tag count';
      countTag.textContent = count;
      tags.append(countTag);
    }
    body.append(tags);
    item.append(body);

    const mark = document.createElement('span');
    mark.className = `trophy-grade-mark ${trophy.grade}`;
    mark.textContent = GRADE_MARKS[trophy.grade];
    mark.setAttribute('aria-hidden', 'true');
    item.append(mark);

    listEl.append(item);
  }
}
