// Progress state: the earned set lives in localStorage and can be exported to a file and imported back.
const STORAGE_KEY = 'leonida-trophy-atlas-progress-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function toggleEarned(earned, name) {
  if (earned.has(name)) earned.delete(name);
  else earned.add(name);
  saveEarned(earned);
  return earned;
}

export function exportEarned(earned) {
  const payload = {
    app: 'Leonida Trophy Atlas',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
  return payload.earned.length;
}

export async function importEarned(file, knownNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  const known = new Set(knownNames);
  const kept = names.filter((name) => typeof name === 'string' && known.has(name));
  const earned = new Set(kept);
  saveEarned(earned);
  return { imported: kept.length, skipped: names.length - kept.length };
}
