/**
 * archetypes.js
 *
 * Archetype computation engine for Cocoon.
 * Provides simplified (no-ephemeris) calculations for:
 *   - Western sun sign
 *   - Moon sign approximation (2.5-day lunar cycle)
 *   - Rising sign approximation (2-hour ascendant window)
 *   - Chinese zodiac animal + element + yin/yang
 *   - Numerology life-path number
 *   - Combined profile
 *
 * All calculations are simplified for consumer UX purposes.
 * They do not replace a full astronomical ephemeris.
 */

// ---------------------------------------------------------------------------
// Zodiac data — all 12 signs
// ---------------------------------------------------------------------------

export const ZODIAC_SIGNS = [
  {
    id: 'aries',
    name: 'Aries',
    glyph: '♈',
    element: 'fire',
    quality: 'cardinal',
    ruler: 'Mars',
    // Month/day windows stored as [startMD, endMD] in MMDD integer form
    start: 321,
    end: 419,
    description:
      'The Warrior archetype — driven by the impulse to initiate, assert, and forge identity through bold action.',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    glyph: '♉',
    element: 'earth',
    quality: 'fixed',
    ruler: 'Venus',
    start: 420,
    end: 520,
    description:
      'The Builder archetype — grounded in the body and the material world, seeking beauty, continuity, and belonging through steadfast presence.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    glyph: '♊',
    element: 'air',
    quality: 'mutable',
    ruler: 'Mercury',
    start: 521,
    end: 620,
    description:
      'The Trickster-Messenger archetype — curious and dualistic, weaving meaning between opposites through language, connection, and perpetual inquiry.',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    glyph: '♋',
    element: 'water',
    quality: 'cardinal',
    ruler: 'Moon',
    start: 621,
    end: 722,
    description:
      'The Great Mother archetype — protective and emotionally perceptive, creating safety and belonging through nurture, memory, and deep feeling.',
  },
  {
    id: 'leo',
    name: 'Leo',
    glyph: '♌',
    element: 'fire',
    quality: 'fixed',
    ruler: 'Sun',
    start: 723,
    end: 822,
    description:
      'The Sovereign archetype — radiating creative will and the need to be witnessed, transforming inner light into generous self-expression.',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    glyph: '♍',
    element: 'earth',
    quality: 'mutable',
    ruler: 'Mercury',
    start: 823,
    end: 922,
    description:
      'The Healer-Craftsman archetype — devoted to discernment, service, and the refinement of self and world through patient, meticulous care.',
  },
  {
    id: 'libra',
    name: 'Libra',
    glyph: '♎',
    element: 'air',
    quality: 'cardinal',
    ruler: 'Venus',
    start: 923,
    end: 1022,
    description:
      'The Lover-Judge archetype — seeking harmony, reciprocity, and beauty by holding opposing truths in elegant, relational balance.',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    glyph: '♏',
    element: 'water',
    quality: 'fixed',
    ruler: 'Pluto',
    start: 1023,
    end: 1121,
    description:
      'The Transformer archetype — drawn into depth, shadow, and regeneration, courageously confronting what lies beneath the surface.',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    glyph: '♐',
    element: 'fire',
    quality: 'mutable',
    ruler: 'Jupiter',
    start: 1122,
    end: 1221,
    description:
      'The Seeker-Philosopher archetype — restless toward meaning and freedom, expanding the self through quest, vision, and wide-horizon thinking.',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    glyph: '♑',
    element: 'earth',
    quality: 'cardinal',
    ruler: 'Saturn',
    start: 1222,
    end: 119, // wraps: Dec 22 – Jan 19
    description:
      'The Elder-Architect archetype — climbing toward mastery through discipline, responsibility, and the slow construction of lasting legacy.',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    glyph: '♒',
    element: 'air',
    quality: 'fixed',
    ruler: 'Uranus',
    start: 120,
    end: 218,
    description:
      'The Revolutionary archetype — driven by the collective ideal, disrupting convention to awaken humanity to wider possibilities.',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    glyph: '♓',
    element: 'water',
    quality: 'mutable',
    ruler: 'Neptune',
    start: 219,
    end: 320,
    description:
      'The Mystic archetype — dissolving boundaries between self and other, channeling the unconscious ocean into empathy, art, and transcendence.',
  },
];

// Index by id for O(1) lookup
export const ZODIAC_BY_ID = Object.fromEntries(ZODIAC_SIGNS.map((s) => [s.id, s]));

// ---------------------------------------------------------------------------
// Sun sign
// ---------------------------------------------------------------------------

/**
 * Convert a Date to a MMDD integer (e.g. March 21 → 321).
 * @param {Date} date
 * @returns {number}
 */
function toMMDD(date) {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();
  return m * 100 + d;
}

/**
 * computeSunSign
 * Returns the zodiac sign object for a given birth date.
 *
 * @param {Date} birthDate
 * @returns {{ id, name, element, quality, ruler, glyph, description }}
 */
export function computeSunSign(birthDate) {
  const mmdd = toMMDD(birthDate);

  for (const sign of ZODIAC_SIGNS) {
    if (sign.start > sign.end) {
      // Wraps across year boundary (Capricorn: Dec 22 – Jan 19)
      if (mmdd >= sign.start || mmdd <= sign.end) return sign;
    } else {
      if (mmdd >= sign.start && mmdd <= sign.end) return sign;
    }
  }

  // Fallback: should never occur for valid dates
  return ZODIAC_SIGNS[0];
}

// ---------------------------------------------------------------------------
// Moon sign — simplified 2.5-day cycle approximation
// ---------------------------------------------------------------------------

/**
 * The moon transits each zodiac sign in approximately 2.5 days,
 * completing a full cycle (~29.5 days) through all 12 signs.
 *
 * Approximation: anchor the lunar cycle to a known New Moon date
 * (Jan 1, 2000 = Julian Day 2451545.0, moon was in Sagittarius ~sign index 8)
 * and advance one sign every 2.5 days from there.
 *
 * This is a rough consumer approximation — not astronomically precise.
 */
const MOON_ANCHOR_DATE = new Date('2000-01-01T00:00:00Z');
const MOON_ANCHOR_SIGN_INDEX = 8; // Sagittarius on Jan 1, 2000 (approximate)
const MOON_DAYS_PER_SIGN = 2.5;

/**
 * computeMoonSign
 * Returns an approximate zodiac sign for the Moon position at birth.
 *
 * @param {Date} birthDate
 * @returns {{ id, name, element, quality, ruler, glyph, description }}
 */
export function computeMoonSign(birthDate) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = (birthDate.getTime() - MOON_ANCHOR_DATE.getTime()) / msPerDay;
  const signOffset = Math.floor(daysDiff / MOON_DAYS_PER_SIGN);
  // Modulo 12, keeping positive
  const index = ((MOON_ANCHOR_SIGN_INDEX + signOffset) % 12 + 12) % 12;
  return ZODIAC_SIGNS[index];
}

// ---------------------------------------------------------------------------
// Rising sign — simplified birth-hour approximation
// ---------------------------------------------------------------------------

/**
 * The ascendant (rising sign) changes roughly every 2 hours.
 * Approximation: offset 6 signs from the sun sign at midnight, then
 * advance one sign for every 2 hours elapsed since midnight.
 * (The sun sign is always on the horizon near solar noon; 6 signs away
 * is a common simplified anchor for midnight births.)
 *
 * @param {Date} birthDate
 * @param {string|null} birthTime — "HH:MM" 24-hour string, or null/undefined
 * @returns {{ id, name, element, quality, ruler, glyph, description }}
 */
export function computeRisingSign(birthDate, birthTime) {
  const sunSign = computeSunSign(birthDate);
  const sunIndex = ZODIAC_SIGNS.indexOf(sunSign);

  // Default to noon if no time provided
  let hour = 12;
  if (birthTime && typeof birthTime === 'string') {
    const parts = birthTime.split(':');
    hour = parseInt(parts[0], 10) || 0;
  }

  // At midnight the rising is ~6 signs before the sun sign
  const midnightOffset = (sunIndex - 6 + 12) % 12;
  // Each 2 hours advances the ascendant one sign
  const hourOffset = Math.floor(hour / 2);
  const risingIndex = (midnightOffset + hourOffset) % 12;

  return ZODIAC_SIGNS[risingIndex];
}

// ---------------------------------------------------------------------------
// Chinese zodiac
// ---------------------------------------------------------------------------

/**
 * Chinese zodiac animals in order (cycle of 12, starting from Rat = 0).
 * The cycle repeats every 12 years; 1900 is a Rat year.
 */
const CHINESE_ANIMALS = [
  { animal: 'Rat',     yin_yang: 'yang' },
  { animal: 'Ox',      yin_yang: 'yin'  },
  { animal: 'Tiger',   yin_yang: 'yang' },
  { animal: 'Rabbit',  yin_yang: 'yin'  },
  { animal: 'Dragon',  yin_yang: 'yang' },
  { animal: 'Snake',   yin_yang: 'yin'  },
  { animal: 'Horse',   yin_yang: 'yang' },
  { animal: 'Goat',    yin_yang: 'yin'  },
  { animal: 'Monkey',  yin_yang: 'yang' },
  { animal: 'Rooster', yin_yang: 'yin'  },
  { animal: 'Dog',     yin_yang: 'yang' },
  { animal: 'Pig',     yin_yang: 'yin'  },
];

/**
 * Five elements repeat in a 10-year cycle (each element spans 2 years).
 * Cycle starts from Wood in 1924.
 */
const CHINESE_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
const CHINESE_ELEMENT_ANCHOR = 1924;

/**
 * computeChineseZodiac
 * Returns the Chinese zodiac animal, element, and yin/yang polarity
 * for a given birth year.
 *
 * Note: lunar new year falls in Jan–Feb; this uses the Gregorian year as a
 * simplified approximation — users born in Jan–Feb may be off by one animal.
 *
 * @param {number} birthYear — e.g. 1990
 * @returns {{ animal: string, element: string, yin_yang: string }}
 */
export function computeChineseZodiac(birthYear) {
  // Animal: 1900 = Rat (index 0)
  const animalIndex = ((birthYear - 1900) % 12 + 12) % 12;
  const { animal, yin_yang } = CHINESE_ANIMALS[animalIndex];

  // Element: anchor 1924 = Wood
  const elementIndex = ((birthYear - CHINESE_ELEMENT_ANCHOR) % 10 + 10) % 10;
  const element = CHINESE_ELEMENTS[elementIndex];

  return { animal, element, yin_yang };
}

// ---------------------------------------------------------------------------
// Numerology — Life Path number
// ---------------------------------------------------------------------------

/**
 * Master numbers in Pythagorean numerology are not reduced further.
 */
const MASTER_NUMBERS = new Set([11, 22, 33]);

/**
 * Reduce a positive integer to a single digit or master number.
 * @param {number} n
 * @returns {number}
 */
function reduceToDigit(n) {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split('')
      .reduce((sum, ch) => sum + parseInt(ch, 10), 0);
  }
  return n;
}

/**
 * computeLifePath
 * Returns the numerology life-path number (1–9 or master number 11/22/33).
 *
 * Method: reduce month, day, and year each to a single digit (or master
 * number), then sum and reduce again.
 *
 * @param {Date} birthDate
 * @returns {number}
 */
export function computeLifePath(birthDate) {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();

  const mReduced = reduceToDigit(month);
  const dReduced = reduceToDigit(day);
  const yReduced = reduceToDigit(year);

  return reduceToDigit(mReduced + dReduced + yReduced);
}

// ---------------------------------------------------------------------------
// Combined profile
// ---------------------------------------------------------------------------

/**
 * computeFullProfile
 * Returns the complete archetype profile for a person.
 *
 * @param {Date} birthDate
 * @param {string|null} birthTime — "HH:MM" 24-hour string (optional)
 * @returns {{
 *   sunSign: object,
 *   moonSign: object,
 *   risingSign: object,
 *   chineseZodiac: object,
 *   lifePath: number,
 * }}
 */
export function computeFullProfile(birthDate, birthTime = null) {
  return {
    sunSign: computeSunSign(birthDate),
    moonSign: computeMoonSign(birthDate),
    risingSign: computeRisingSign(birthDate, birthTime),
    chineseZodiac: computeChineseZodiac(birthDate.getFullYear()),
    lifePath: computeLifePath(birthDate),
  };
}
