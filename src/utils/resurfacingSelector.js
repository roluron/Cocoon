import { MOOD_VALENCE } from './moodAlgorithm.js';

const DAY = 86400000;
const days = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / DAY);

export function shouldResurface(moods) {
  if (moods.length < 2) return false;
  const last = moods[moods.length - 1];
  const prev = moods[moods.length - 2];
  const lastV = MOOD_VALENCE[last?.mood] ?? 0;
  const prevV = MOOD_VALENCE[prev?.mood] ?? 0;
  return lastV <= -0.4 && prevV <= -0.4;
}

export function selectResurfacing({ moods, journal }) {
  if (!shouldResurface(moods)) return null;

  const candidates = journal.filter((e) => {
    if (!e.isResurfaceable) return false;
    if (days(e.date) < 5) return false;
    if (e.lastResurfacedAt && days(e.lastResurfacedAt) < 14) return false;
    const free = e.freeWrite?.trim().length ?? 0;
    const guided = e.guidedReflection?.response?.trim().length ?? 0;
    const pulse = e.quickPulse?.trim().length ?? 0;
    return free > 20 || guided > 20 || pulse > 0;
  });

  if (!candidates.length) return null;

  candidates.sort(
    (a, b) => (MOOD_VALENCE[b.moodAtTime] ?? 0) - (MOOD_VALENCE[a.moodAtTime] ?? 0)
  );

  return candidates[0];
}
