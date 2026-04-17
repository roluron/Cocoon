import promptArc from '../data/promptArc.json';
import { consecutiveSameMood, MOOD_VALENCE } from './moodAlgorithm.js';
import { weaveArchetype } from './archetypeWeaver.js';

export function dayInCycle(cycle, now = new Date()) {
  if (!cycle?.startDate) return 1;
  const start = new Date(cycle.startDate).getTime();
  return Math.max(1, Math.floor((now.getTime() - start) / 86400000) + 1);
}

export function phaseForDay(day) {
  const phases = promptArc.phases;
  for (const [name, def] of Object.entries(phases)) {
    if (def.days.includes(day)) return name;
  }
  // Beyond day 21: cycle back through, weighted toward agency/reflection
  const beyondDay = ((day - 1) % 21) + 1;
  for (const [name, def] of Object.entries(phases)) {
    if (def.days.includes(beyondDay)) return name;
  }
  return 'reflection';
}

function pick(list, seed) {
  return list[seed % list.length];
}

export function selectPrompt({ cycle, moods, journal, ritualCompletionRate, day, archetypeProfile }) {
  const phaseName = phaseForDay(day);
  const phaseDef = promptArc.phases[phaseName];
  const overrides = promptArc.patternOverrides;

  const same = consecutiveSameMood(moods);
  if (same.count >= 4) {
    return {
      prompt: overrides.sameMood4Days.replace('{mood}', same.mood),
      promptPhase: phaseName,
      reason: 'same-mood-4',
    };
  }

  if (moods.length >= 2) {
    const prev = moods[moods.length - 2];
    const cur = moods[moods.length - 1];
    if ((MOOD_VALENCE[prev.mood] ?? 0) <= -0.4 && (MOOD_VALENCE[cur.mood] ?? 0) >= 0.4) {
      return {
        prompt: overrides.shiftedHeavyToLight,
        promptPhase: phaseName,
        reason: 'shifted-up',
      };
    }
  }

  const lastMoodValence = MOOD_VALENCE[moods[moods.length - 1]?.mood] ?? 0;
  if (ritualCompletionRate >= 0.7 && lastMoodValence < -0.2) {
    return {
      prompt: overrides.highRitualLowMood,
      promptPhase: phaseName,
      reason: 'high-ritual-low-mood',
    };
  }
  if (ritualCompletionRate < 0.3 && lastMoodValence > 0.4) {
    return {
      prompt: overrides.lowRitualGoodMood,
      promptPhase: phaseName,
      reason: 'low-ritual-good-mood',
    };
  }

  if (journal.length >= 3) {
    const lastEntry = journal[journal.length - 1];
    const lastDate = new Date(lastEntry.date);
    const days = Math.floor((Date.now() - lastDate.getTime()) / 86400000);
    if (days >= 3) {
      return {
        prompt: overrides.noJournal3Days,
        promptPhase: phaseName,
        reason: 'no-journal-3',
      };
    }
  }

  const seed = day + journal.length;
  const text = pick(phaseDef.prompts, seed).replace('{days}', String(day));

  // Attempt archetypal weaving — subtle, probabilistic, never forced
  if (archetypeProfile) {
    const currentMood = moods[moods.length - 1]?.mood ?? null;
    const woven = weaveArchetype({
      basePrompt: text,
      promptPhase: phaseName,
      profile: archetypeProfile,
      day,
      journalLength: journal.length,
      currentMood,
    });
    if (woven) {
      return { prompt: woven, promptPhase: phaseName, reason: 'archetype-woven' };
    }
  }

  return { prompt: text, promptPhase: phaseName, reason: 'arc' };
}
