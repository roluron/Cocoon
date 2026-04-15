import wisdom from '../data/wisdom.json';
import { consecutiveSameMood } from './moodAlgorithm.js';

export function selectWisdom({ moods, cycle, ritualStreak = 0 }) {
  const last = moods[moods.length - 1]?.mood;
  const prev = moods[moods.length - 2]?.mood;
  const phase = cycle?.phase;

  let pool = [];
  let theme = null;

  if (prev && last && prev !== last) {
    theme = 'change';
  } else if (ritualStreak >= 5) {
    theme = 'discipline';
  } else if (consecutiveSameMood(moods).count >= 4) {
    theme = 'acceptance';
  } else if (phase) {
    pool = wisdom.filter((w) => w.bestForPhases.includes(phase));
  } else {
    return null;
  }

  if (theme) {
    pool = wisdom.filter((w) =>
      w.themes.some((t) => t === theme || (theme === 'change' && t === 'impermanence') || (theme === 'discipline' && t === 'patience') || (theme === 'acceptance' && t === 'stillness'))
    );
  }

  if (last) {
    const moodMatched = pool.filter((w) => w.bestForMoods.includes(last));
    if (moodMatched.length) pool = moodMatched;
  }

  if (!pool.length) return null;
  const seed = (moods.length + (cycle?.phaseHistory?.length ?? 0)) % pool.length;
  return pool[seed];
}
