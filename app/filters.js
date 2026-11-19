// Filter logic: which trophies a view shows, and how the spoiler setting masks story trophies.
export const KINDS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export function trophyMatches(trophy, filters, earned) {
  if (filters.kind === 'missable' && !trophy.missable) return false;
  if (filters.kind === 'online') return false;
  if (filters.kind !== 'all' && filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.earnedOnly && !earned.has(trophy.name)) return false;
  if (filters.search) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

export function visibleTrophies(trophies, filters, earned) {
  return trophies.filter((trophy) => trophyMatches(trophy, filters, earned));
}

// A story trophy the reader has not earned yet stays hidden while spoilers are on.
export function isSpoilerHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function spoilerName(trophy) {
  return 'Hidden story trophy';
}

export function spoilerDescription() {
  return 'Earn this trophy to reveal its name and description — or turn spoilers off.';
}

export function gradeLabel(grade) {
  return grade[0].toUpperCase() + grade.slice(1);
}

export function countLabel(trophy) {
  if (trophy.count == null) return null;
  if (typeof trophy.count === 'number' && trophy.count >= 1000) return `× ${trophy.count.toLocaleString('en-US')}`;
  return `× ${trophy.count}`;
}
