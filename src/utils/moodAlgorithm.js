import moods from '../data/moods.json';

export const MOODS = moods;

export const MOOD_BY_ID = Object.fromEntries(moods.map((m) => [m.id, m]));

export const MOOD_VALENCE = Object.fromEntries(moods.map((m) => [m.id, m.valence]));

export function moodColor(id) {
  return MOOD_BY_ID[id]?.color ?? '#4a7c8a';
}

export function moodLabel(id) {
  return MOOD_BY_ID[id]?.label ?? 'Unknown';
}

const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export function computeDirection(entries) {
  if (entries.length < 6) return 'still';
  const first3 = avg(entries.slice(0, 3).map((e) => MOOD_VALENCE[e.mood] ?? 0));
  const last3 = avg(entries.slice(-3).map((e) => MOOD_VALENCE[e.mood] ?? 0));
  const delta = last3 - first3;
  if (delta > 0.15) return 'ascending';
  if (delta < -0.15) return 'descending';
  return 'still';
}

export function dominantMood(entries) {
  if (!entries.length) return null;
  const counts = {};
  for (const e of entries) counts[e.mood] = (counts[e.mood] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function consecutiveSameMood(entries) {
  if (!entries.length) return { mood: null, count: 0 };
  const reversed = [...entries].reverse();
  const target = reversed[0].mood;
  let count = 0;
  for (const e of reversed) {
    if (e.mood === target) count++;
    else break;
  }
  return { mood: target, count };
}

export function hexToRgbTriple(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
