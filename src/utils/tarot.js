/**
 * tarot.js
 *
 * Major Arcana data and deterministic weekly card draw for Cocoon.
 *
 * Design principles:
 *   - Reflections are introspective questions, never predictions or fortune-telling.
 *   - Jungian framing: each card is treated as a face of the psyche, not fate.
 *   - drawWeeklyCard is deterministic: the same userId + weekNumber always
 *     returns the same card, so the card feels like a companion for the week
 *     rather than a random shuffle.
 */

// ---------------------------------------------------------------------------
// Major Arcana — 22 cards (The Fool = 0 through The World = 21)
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} TarotCard
 * @property {number} id            — 0–21
 * @property {string} name          — card name
 * @property {string} numeral       — Roman numeral (The Fool uses "0")
 * @property {string[]} keywords    — three thematic keywords
 * @property {string} reflection    — introspective question (Jungian framing)
 * @property {string} element       — fire / earth / air / water / spirit
 * @property {string} archetype     — Jungian archetype label
 */

/** @type {TarotCard[]} */
export const MAJOR_ARCANA = [
  {
    id: 0,
    name: 'The Fool',
    numeral: '0',
    keywords: ['beginnings', 'innocence', 'trust'],
    reflection: 'What would you begin if you weren\'t afraid of looking foolish?',
    element: 'spirit',
    archetype: 'The Child',
  },
  {
    id: 1,
    name: 'The Magician',
    numeral: 'I',
    keywords: ['will', 'skill', 'resourcefulness'],
    reflection: 'Which of your existing gifts have you been leaving unused?',
    element: 'air',
    archetype: 'The Trickster',
  },
  {
    id: 2,
    name: 'The High Priestess',
    numeral: 'II',
    keywords: ['intuition', 'mystery', 'inner knowing'],
    reflection: 'What do you already know but have been reluctant to admit to yourself?',
    element: 'water',
    archetype: 'The Anima',
  },
  {
    id: 3,
    name: 'The Empress',
    numeral: 'III',
    keywords: ['abundance', 'nurture', 'creativity'],
    reflection: 'Where in your life are you withholding care — from yourself or from others?',
    element: 'earth',
    archetype: 'The Great Mother',
  },
  {
    id: 4,
    name: 'The Emperor',
    numeral: 'IV',
    keywords: ['structure', 'authority', 'stability'],
    reflection: 'What would it mean to take full, unhurried responsibility for one area of your life?',
    element: 'fire',
    archetype: 'The Father',
  },
  {
    id: 5,
    name: 'The Hierophant',
    numeral: 'V',
    keywords: ['tradition', 'teaching', 'belief'],
    reflection: 'Which inherited beliefs still serve you, and which ones are simply inherited?',
    element: 'earth',
    archetype: 'The Wise Elder',
  },
  {
    id: 6,
    name: 'The Lovers',
    numeral: 'VI',
    keywords: ['choice', 'union', 'values'],
    reflection: 'What commitment is asking to be made — not to another person, but to your own values?',
    element: 'air',
    archetype: 'The Syzygy',
  },
  {
    id: 7,
    name: 'The Chariot',
    numeral: 'VII',
    keywords: ['direction', 'discipline', 'momentum'],
    reflection: 'What opposing impulses inside you are asking to be harnessed rather than suppressed?',
    element: 'water',
    archetype: 'The Hero',
  },
  {
    id: 8,
    name: 'Strength',
    numeral: 'VIII',
    keywords: ['courage', 'patience', 'compassion'],
    reflection: 'What fear or difficult emotion could you meet with curiosity instead of resistance?',
    element: 'fire',
    archetype: 'The Self',
  },
  {
    id: 9,
    name: 'The Hermit',
    numeral: 'IX',
    keywords: ['solitude', 'guidance', 'inner light'],
    reflection: 'What clarity has been waiting for you in the quiet spaces you\'ve been avoiding?',
    element: 'earth',
    archetype: 'The Wise Old Man',
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    numeral: 'X',
    keywords: ['cycles', 'turning points', 'impermanence'],
    reflection: 'What in your life is in motion whether you acknowledge it or not?',
    element: 'fire',
    archetype: 'The Trickster',
  },
  {
    id: 11,
    name: 'Justice',
    numeral: 'XI',
    keywords: ['truth', 'accountability', 'balance'],
    reflection: 'Where are you demanding fairness from others while avoiding honest self-appraisal?',
    element: 'air',
    archetype: 'The Judge',
  },
  {
    id: 12,
    name: 'The Hanged Man',
    numeral: 'XII',
    keywords: ['surrender', 'perspective', 'waiting'],
    reflection: 'What might shift if you stopped trying to resolve this and simply let yourself be in it?',
    element: 'water',
    archetype: 'The Martyr',
  },
  {
    id: 13,
    name: 'Death',
    numeral: 'XIII',
    keywords: ['endings', 'transformation', 'release'],
    reflection: 'What version of yourself is asking to be allowed to end so that something new can begin?',
    element: 'water',
    archetype: 'The Transformer',
  },
  {
    id: 14,
    name: 'Temperance',
    numeral: 'XIV',
    keywords: ['integration', 'patience', 'alchemy'],
    reflection: 'Which two parts of yourself have you been keeping separate that long to meet?',
    element: 'fire',
    archetype: 'The Alchemist',
  },
  {
    id: 15,
    name: 'The Devil',
    numeral: 'XV',
    keywords: ['shadow', 'attachment', 'unconscious patterns'],
    reflection: 'What chain are you holding onto because it feels safer than freedom?',
    element: 'earth',
    archetype: 'The Shadow',
  },
  {
    id: 16,
    name: 'The Tower',
    numeral: 'XVI',
    keywords: ['disruption', 'revelation', 'liberation'],
    reflection: 'What structure in your life is asking to be released rather than rebuilt?',
    element: 'fire',
    archetype: 'The Destroyer',
  },
  {
    id: 17,
    name: 'The Star',
    numeral: 'XVII',
    keywords: ['hope', 'healing', 'renewal'],
    reflection: 'Where in your life are you being called to hope again, even without certainty?',
    element: 'air',
    archetype: 'The Anima',
  },
  {
    id: 18,
    name: 'The Moon',
    numeral: 'XVIII',
    keywords: ['the unconscious', 'illusion', 'depth'],
    reflection: 'What are you afraid to look at directly — and what might that fear be protecting?',
    element: 'water',
    archetype: 'The Shadow',
  },
  {
    id: 19,
    name: 'The Sun',
    numeral: 'XIX',
    keywords: ['vitality', 'clarity', 'authentic joy'],
    reflection: 'What form of expression, when you allow it fully, makes you feel most like yourself?',
    element: 'fire',
    archetype: 'The Child',
  },
  {
    id: 20,
    name: 'Judgement',
    numeral: 'XX',
    keywords: ['calling', 'awakening', 'forgiveness'],
    reflection: 'What would you do differently if you genuinely believed you could begin again?',
    element: 'fire',
    archetype: 'The Rebirth',
  },
  {
    id: 21,
    name: 'The World',
    numeral: 'XXI',
    keywords: ['completion', 'wholeness', 'integration'],
    reflection: 'What have you completed that you haven\'t yet let yourself fully celebrate?',
    element: 'earth',
    archetype: 'The Self',
  },
];

// Index by id for O(1) lookup
export const MAJOR_ARCANA_BY_ID = Object.fromEntries(MAJOR_ARCANA.map((c) => [c.id, c]));

// ---------------------------------------------------------------------------
// Week number helper
// ---------------------------------------------------------------------------

/**
 * getWeekNumber
 * Returns the ISO 8601 week number (1–53) for a given date.
 *
 * ISO weeks start on Monday; week 1 contains the year's first Thursday.
 *
 * @param {Date} date
 * @returns {number}
 */
export function getWeekNumber(date) {
  // Copy date so we don't mutate the original
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // ISO week day: Monday = 1, Sunday = 7
  const dayNum = d.getUTCDay() || 7;
  // Set to nearest Thursday (current date + 4 - current ISO day number)
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ---------------------------------------------------------------------------
// Deterministic weekly draw
// ---------------------------------------------------------------------------

/**
 * A simple, non-cryptographic string hash (djb2 variant).
 * Produces a stable positive integer for any string.
 *
 * @param {string} str
 * @returns {number}
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  // Force unsigned 32-bit so we always get a positive number
  return hash >>> 0;
}

/**
 * drawWeeklyCard
 * Returns a deterministic Major Arcana card for the given user and week.
 *
 * The same userId + weekNumber always resolves to the same card,
 * but different weeks (or different users) yield different cards.
 *
 * @param {string|number} userId    — any stable user identifier
 * @param {number} weekNumber       — ISO week number (use getWeekNumber)
 * @returns {TarotCard}
 */
export function drawWeeklyCard(userId, weekNumber) {
  const seed = hashString(`${userId}:${weekNumber}`);
  const index = seed % MAJOR_ARCANA.length; // 0–21
  return MAJOR_ARCANA[index];
}
