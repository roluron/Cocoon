/**
 * Mock HealthKit data layer.
 * In a native app, this would read from Apple HealthKit.
 * For the web prototype, it generates plausible mock data
 * that shifts based on recent mood state.
 */

const DAY = 86400000;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function dateSeed(date) {
  const d = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < d.length; i++) h = ((h << 5) - h + d.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MOOD_HEALTH_BIAS = {
  serene:     { sleep: 7.5, hrv: 65, steps: 8000, mindful: 15 },
  peaceful:   { sleep: 7.8, hrv: 70, steps: 7000, mindful: 20 },
  energized:  { sleep: 7.0, hrv: 60, steps: 12000, mindful: 5 },
  light:      { sleep: 7.2, hrv: 58, steps: 9000, mindful: 10 },
  creative:   { sleep: 6.8, hrv: 55, steps: 6000, mindful: 8 },
  restless:   { sleep: 5.5, hrv: 40, steps: 11000, mindful: 2 },
  melancholy: { sleep: 8.5, hrv: 45, steps: 3000, mindful: 12 },
  heavy:      { sleep: 9.0, hrv: 35, steps: 2000, mindful: 0 },
};

const DEFAULT_BIAS = { sleep: 7.0, hrv: 55, steps: 7000, mindful: 8 };

/**
 * Generate mock health data for a given date, influenced by mood.
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @param {string|null} moodAtDate - mood id, if known
 * @returns {{ sleepHours, hrv, steps, mindfulMinutes }}
 */
export function getHealthData(dateStr, moodAtDate = null) {
  const rng = seededRandom(dateSeed(dateStr));
  const bias = MOOD_HEALTH_BIAS[moodAtDate] ?? DEFAULT_BIAS;

  const jitter = (base, range) => base + (rng() - 0.5) * range;

  return {
    date: dateStr,
    sleepHours: Math.round(jitter(bias.sleep, 2.0) * 10) / 10,
    hrv: Math.round(jitter(bias.hrv, 20)),
    steps: Math.round(jitter(bias.steps, 4000)),
    mindfulMinutes: Math.max(0, Math.round(jitter(bias.mindful, 10))),
  };
}

/**
 * Generate health data for the last N days.
 * @param {number} days
 * @param {Array} moods - mood entries array from state
 * @returns {Array<{date, sleepHours, hrv, steps, mindfulMinutes}>}
 */
export function getHealthHistory(days, moods = []) {
  const moodMap = {};
  for (const m of moods) {
    const d = m.timestamp.slice(0, 10);
    moodMap[d] = m.mood;
  }

  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY);
    const dateStr = d.toISOString().slice(0, 10);
    result.push(getHealthData(dateStr, moodMap[dateStr] ?? null));
  }
  return result;
}

/**
 * Detect simple correlations between mood and health metrics.
 * Returns an array of observation strings.
 */
export function detectCorrelations(healthHistory, moods) {
  if (healthHistory.length < 5 || moods.length < 3) return [];

  const observations = [];
  const moodMap = {};
  for (const m of moods) moodMap[m.timestamp.slice(0, 10)] = m.mood;

  // Check: low sleep → negative mood next day
  for (let i = 0; i < healthHistory.length - 1; i++) {
    const h = healthHistory[i];
    const nextDate = healthHistory[i + 1]?.date;
    const nextMood = moodMap[nextDate];
    if (h.sleepHours < 5.5 && ['heavy', 'restless', 'melancholy'].includes(nextMood)) {
      observations.push(
        `You slept ${h.sleepHours}h on ${h.date.slice(5)} and felt ${nextMood} the next day.`,
      );
      break;
    }
  }

  // Check: high steps → positive mood
  for (let i = 0; i < healthHistory.length; i++) {
    const h = healthHistory[i];
    const mood = moodMap[h.date];
    if (h.steps > 10000 && ['serene', 'energized', 'light', 'peaceful'].includes(mood)) {
      observations.push(
        `On days you move more (${Math.round(h.steps / 1000)}k steps), you tend to feel ${mood}.`,
      );
      break;
    }
  }

  // Check: mindfulness → better HRV
  const mindfulDays = healthHistory.filter((h) => h.mindfulMinutes >= 10);
  const nonMindfulDays = healthHistory.filter((h) => h.mindfulMinutes < 5);
  if (mindfulDays.length >= 2 && nonMindfulDays.length >= 2) {
    const avgMindfulHrv =
      mindfulDays.reduce((s, h) => s + h.hrv, 0) / mindfulDays.length;
    const avgNonHrv =
      nonMindfulDays.reduce((s, h) => s + h.hrv, 0) / nonMindfulDays.length;
    if (avgMindfulHrv > avgNonHrv + 5) {
      observations.push(
        `Your heart rate variability is ${Math.round(avgMindfulHrv - avgNonHrv)} points higher on days you practice mindfulness.`,
      );
    }
  }

  return observations;
}
