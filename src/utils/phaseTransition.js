import { computeDirection, MOOD_VALENCE } from './moodAlgorithm.js';

const DAY = 86400000;

export const PHASE_ORDER = ['dormancy', 'stirring', 'unraveling', 'reforming', 'emergence'];

export function daysSinceStart(cycle, now = Date.now()) {
  if (!cycle?.startDate) return 0;
  return Math.floor((now - new Date(cycle.startDate).getTime()) / DAY);
}

export function distinctMoodDays(moods) {
  return new Set(moods.map((m) => m.timestamp.slice(0, 10))).size;
}

export function ritualCompletionRate({ rituals, completions, sinceDate }) {
  if (!rituals.length) return 0;
  const start = new Date(sinceDate).getTime();
  const days = Math.max(1, Math.ceil((Date.now() - start) / DAY));
  const expected = rituals.length * days;
  const seen = completions.filter((c) => new Date(c.date).getTime() >= start).length;
  return Math.min(1, seen / expected);
}

export function evaluateNextPhase({ cycle, moods, journal, rituals, ritualCompletions }) {
  if (!cycle) return null;
  const current = cycle.phase;
  const days = daysSinceStart(cycle);
  const checkInDays = distinctMoodDays(moods);
  const journalCount = journal.length;
  const completionRate = ritualCompletionRate({
    rituals,
    completions: ritualCompletions,
    sinceDate: cycle.startDate,
  });
  const direction = computeDirection(moods);

  switch (current) {
    case 'dormancy':
      if (checkInDays >= 3 && journalCount >= 1 && days >= 3) return 'stirring';
      return null;
    case 'stirring':
      if (days >= 7 && completionRate >= 0.5 && journalCount >= 3) return 'unraveling';
      return null;
    case 'unraveling':
      if (days >= 14 && completionRate >= 0.6 && direction === 'ascending') return 'reforming';
      return null;
    case 'reforming':
      // Emergence requires user acknowledgment — surface as eligibility, don't auto-advance.
      return null;
    default:
      return null;
  }
}

export function isEmergenceEligible({ cycle, moods, rituals, ritualCompletions }) {
  if (cycle?.phase !== 'reforming') return false;
  const days = daysSinceStart(cycle);
  const completionRate = ritualCompletionRate({
    rituals,
    completions: ritualCompletions,
    sinceDate: cycle.startDate,
  });
  const direction = computeDirection(moods);
  return days >= 21 && completionRate >= 0.7 && direction === 'ascending';
}

export function applyPhaseAdvance(cycle, nextPhase) {
  return {
    ...cycle,
    phase: nextPhase,
    phaseHistory: [
      ...(cycle.phaseHistory ?? []),
      { phase: nextPhase, enteredAt: new Date().toISOString() },
    ],
  };
}
