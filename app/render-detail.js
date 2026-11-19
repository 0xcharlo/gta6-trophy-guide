// Guide detail panel: the selected trophy's official text, its guide in our own words, and its cited sources.
import { countLabel, gradeLabel, isSpoilerHidden, spoilerDescription } from './filters.js';
import { STAGE_TITLES } from './render-roadmap.js';

export function renderDetail(panel, trophy, filters, earned) {
  panel.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Pick a trophy from the checklist to read its guide and sources.';
    panel.append(empty);
    return;
  }
  const hidden = isSpoilerHidden(trophy, filters.spoilerOn, earned);

  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  panel.append(title);

  const official = document.createElement('p');
  official.className = 'detail-official';
  official.textContent = hidden ? spoilerDescription() : trophy.description;
  panel.append(official);

  const meta = document.createElement('div');
  meta.className = 'detail-meta';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade-${trophy.grade}`;
  gradeTag.textContent = gradeLabel(trophy.grade);
  meta.append(gradeTag);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = trophy.kind;
  meta.append(kindTag);
  if (trophy.hidden) {
    const hiddenTag = document.createElement('span');
    hiddenTag.className = 'tag hidden-trophy';
    hiddenTag.textContent = 'Hidden on PS5 until earned';
    meta.append(hiddenTag);
  }
  if (trophy.missable) {
    const missTag = document.createElement('span');
    missTag.className = 'tag missable';
    missTag.textContent = 'Possibly missable';
    meta.append(missTag);
  }
  const count = countLabel(trophy);
  if (count) {
    const countTag = document.createElement('span');
    countTag.className = 'tag count';
    countTag.textContent = `Target ${count}`;
    meta.append(countTag);
  }
  const earnedTag = document.createElement('span');
  earnedTag.className = 'tag';
  earnedTag.textContent = earned.has(trophy.name) ? 'Earned ✓' : 'Not earned yet';
  meta.append(earnedTag);
  panel.append(meta);

  if (hidden) {
    const note = document.createElement('p');
    note.className = 'detail-guide';
    note.textContent = 'Spoilers are on, so this story trophy stays hidden until you earn it — or turn the spoiler setting off. Its guide and sources appear here once revealed.';
    panel.append(note);
    return;
  }

  const guideLabel = document.createElement('p');
  guideLabel.className = 'detail-guide-label';
  guideLabel.textContent = 'How to earn it';
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = trophy.guide;
  panel.append(guideLabel, guide);

  const sourcesLabel = document.createElement('p');
  sourcesLabel.className = 'detail-sources-label';
  sourcesLabel.textContent = 'Sources';
  const sources = document.createElement('ul');
  sources.className = 'detail-sources';
  for (const source of trophy.sources) {
    const item = document.createElement('li');
    item.textContent = source;
    sources.append(item);
  }
  panel.append(sourcesLabel, sources);

  const stage = document.createElement('p');
  stage.className = 'detail-stage';
  stage.textContent = `Roadmap: Stage ${trophy.stage} — ${STAGE_TITLES[trophy.stage]}`;
  panel.append(stage);
}
