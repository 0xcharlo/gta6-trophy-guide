// Roadmap rendering: six stages to the platinum, built from the official trophy descriptions, plus the missable-trophy box.
export const STAGE_TITLES = {
  1: 'Play the story, keep manual saves',
  2: 'Strangers and side characters',
  3: 'Activities and challenges',
  4: 'Collectibles and exploration',
  5: 'Robberies and the wanted level',
  6: 'Money, cryptic trophies and 100%',
};

const STAGE_NOTES = {
  1: 'Chapters 1 to 4 and the final mission. Do Lucia’s balcony meditation in Chapter 1 — it may be required for the one possibly missable trophy. Keep a manual save at the start of every chapter; there is no mission replay.',
  2: 'Finish the stranger mission strands and the five side-character final missions. Start each strand as soon as it unlocks: one guide warns their windows may be tied to story progress.',
  3: 'Stunts, races, shooting range, fishing, arcade, challenges and Combat Focus feats. Most of these build on each other and on the 100% checklist.',
  4: 'Meditation spots, collectible cards, WAiNK locations, vehicles, map exploration, garages and Scooter Bros registrations. Pick things up as you travel instead of leaving them all to the end.',
  5: 'Shop, jewelry-store, bank-vault and armored-truck robberies, gang operations and wanted-level escapes — best done with your partner beside you.',
  6: 'Launder Marked Bills, spend across the shops, chase the five cryptic hidden trophies, then finish the 100% checklist for the gold — and the platinum follows.',
};

export function renderRoadmap(stagesEl, missableEl, trophies, earned) {
  stagesEl.replaceChildren();
  for (let stage = 1; stage <= 6; stage++) {
    const members = trophies.filter((t) => t.stage === stage);
    const section = document.createElement('section');
    section.className = 'stage';
    const heading = document.createElement('h3');
    heading.textContent = `Stage ${stage} — ${STAGE_TITLES[stage]} `;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `(${members.length} trophies)`;
    heading.append(count);
    const note = document.createElement('p');
    note.textContent = STAGE_NOTES[stage];
    const list = document.createElement('ul');
    for (const trophy of members) {
      const item = document.createElement('li');
      const tick = earned.has(trophy.name) ? '✓ ' : '○ ';
      item.textContent = `${tick}${trophy.name} — ${trophy.description} `;
      const grade = document.createElement('span');
      grade.className = 'stage-trophy-grade';
      grade.textContent = `(${trophy.grade}${trophy.missable ? ', possibly missable' : ''})`;
      item.append(grade);
      list.append(item);
    }
    section.append(heading, note, list);
    stagesEl.append(section);
  }

  missableEl.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = 'Missable trophies';
  const missables = trophies.filter((t) => t.missable);
  const intro = document.createElement('p');
  intro.textContent = missables.length === 1
    ? 'Only one trophy is reported as possibly missable. Every other trophy can be earned after the story, in free roam.'
    : `${missables.length} trophies are flagged as possibly missable.`;
  missableEl.append(heading, intro);
  for (const trophy of missables) {
    const para = document.createElement('p');
    para.textContent = `${trophy.name} — ${trophy.guide}`;
    missableEl.append(para);
  }
  const saveNote = document.createElement('p');
  saveNote.textContent = 'Safety net: keep a manual save at the start of every chapter and one before the final mission. GTABase and PowerPyx both flag the meditation trophy; TechWiser adds that stranger chains may have story-linked windows, so start those early.';
  missableEl.append(saveNote);
}
