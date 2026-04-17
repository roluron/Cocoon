/**
 * Archetypal Weaver
 *
 * Subtly enriches guided reflection prompts with birth-chart patterns.
 * Design principles:
 *   - Never prescriptive ("because you're a Cancer" → forbidden)
 *   - Uses element/archetype language, not sun-sign horoscope language
 *   - Probabilistic: only ~30% of prompts get woven. Silence is golden.
 *   - The user should feel like finding a word they didn't know they needed,
 *     not being told what to think.
 *   - Anti-anxiety: never implies the user SHOULD feel a certain way
 */

import { computeFullProfile } from './archetypes.js';

const ELEMENT_QUALITIES = {
  fire: {
    essence: 'initiation',
    verbs: ['ignite', 'move', 'begin', 'dare'],
    textures: ['heat', 'light', 'spark', 'urgency'],
    shadow: 'burnout',
    question: 'What are you ready to begin — or ready to stop fueling?',
  },
  earth: {
    essence: 'embodiment',
    verbs: ['build', 'hold', 'ground', 'tend'],
    textures: ['weight', 'soil', 'root', 'patience'],
    shadow: 'rigidity',
    question: 'What needs tending in your life right now — not fixing, just tending?',
  },
  air: {
    essence: 'understanding',
    verbs: ['name', 'connect', 'release', 'see'],
    textures: ['breath', 'space', 'clarity', 'distance'],
    shadow: 'detachment',
    question: 'What would become clearer if you stepped back far enough to see the whole shape?',
  },
  water: {
    essence: 'feeling',
    verbs: ['flow', 'dissolve', 'receive', 'remember'],
    textures: ['depth', 'tide', 'current', 'reflection'],
    shadow: 'drowning',
    question: 'What feeling have you been holding at arm\'s length instead of letting it move through you?',
  },
};

const QUALITY_TENSIONS = {
  cardinal: 'the impulse to begin',
  fixed: 'the desire to hold steady',
  mutable: 'the readiness to change shape',
};

const LIFE_PATH_WHISPERS = {
  1: 'independence — doing it your way, even when it\'s lonely',
  2: 'partnership — the space between you and another person',
  3: 'expression — what you create when no one is watching',
  4: 'foundation — the quiet work that holds everything up',
  5: 'freedom — what you\'d do if no one needed you to stay',
  6: 'care — who you tend to, and whether you tend to yourself',
  7: 'solitude — what you find when you stop looking',
  8: 'power — what you\'d build if you trusted your own authority',
  9: 'release — what you\'d let go of if you knew it would return',
  11: 'intuition — what you know before you can explain it',
  22: 'vision — what you see that others don\'t yet',
  33: 'compassion — the weight of caring deeply in a careless world',
};

/**
 * Decide whether to weave archetype into this prompt.
 * Returns false ~70% of the time. Silence preserves the magic.
 */
function shouldWeave(day, journalLength) {
  // Use a deterministic but varied signal so it doesn't feel random
  const signal = (day * 7 + journalLength * 13) % 10;
  return signal < 3; // ~30% chance
}

/**
 * Generate an archetypal suffix or replacement for a prompt.
 * Returns null if no weaving should happen.
 *
 * @param {object} params
 * @param {string} params.basePrompt - the original prompt text
 * @param {string} params.promptPhase - current phase (entry, sensory, agency, etc.)
 * @param {object} params.profile - from computeFullProfile()
 * @param {number} params.day - day in cycle
 * @param {number} params.journalLength - total journal entries
 * @param {string|null} params.currentMood - latest mood id
 * @returns {string|null} woven prompt, or null to keep original
 */
export function weaveArchetype({
  basePrompt,
  promptPhase,
  profile,
  day,
  journalLength,
  currentMood,
}) {
  if (!profile) return null;
  if (!shouldWeave(day, journalLength)) return null;

  const { sunSign, moonSign, lifePath } = profile;
  const sunElement = ELEMENT_QUALITIES[sunSign?.element];
  const moonElement = ELEMENT_QUALITIES[moonSign?.element];

  // Different weaving strategies per phase
  switch (promptPhase) {
    case 'entry': {
      // Early days: gentle element-awareness, never diagnostic
      if (!sunElement) return null;
      const texture = sunElement.textures[day % sunElement.textures.length];
      return `${basePrompt}\n\nIf it helps: notice where you feel ${texture} in your body.`;
    }

    case 'sensory': {
      // Deepening: moon element introduces the feeling layer
      if (!moonElement) return null;
      return moonElement.question;
    }

    case 'agency': {
      // Shadow work: the element's shadow offers a mirror
      if (!sunElement) return null;
      const quality = QUALITY_TENSIONS[sunSign.quality];
      if (!quality) return null;
      return `You carry ${quality}. When does that impulse serve you — and when does it hold you back?`;
    }

    case 'reflection': {
      // Meaning-making: life path offers a lens
      const whisper = LIFE_PATH_WHISPERS[lifePath];
      if (!whisper) return null;
      return `One thread in your pattern is ${whisper}. How does that show up in what you've written these past weeks?`;
    }

    case 'proof': {
      // Claiming: the full archetype as mirror, never as fate
      if (!sunElement || !moonElement) return null;
      if (sunElement.essence === moonElement.essence) {
        return `You are deeply ${sunElement.essence}. What does that word mean to you now, compared to day one?`;
      }
      return `You live between ${sunElement.essence} and ${moonElement.essence}. Which one carried you through this cycle?`;
    }

    default:
      return null;
  }
}

/**
 * Compute a full profile from birth data stored in the user profile.
 * Returns null if archetype is not enabled or no birth data.
 */
export function getProfileFromState(state) {
  if (!state.profile?.onboarding?.archetypeEnabled) return null;
  const bd = state.profile.onboarding.birthData;
  if (!bd?.birthDate) return null;
  return computeFullProfile(new Date(bd.birthDate), bd.birthTime ?? null);
}
