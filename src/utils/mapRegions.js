/**
 * Discovery Map region definitions and unlock detection.
 *
 * The map reveals itself silently. The user never sees criteria.
 * Fog is fog. No "complete X to unlock."
 */

export const REGIONS = [
  {
    id: 'shore_of_beginnings',
    name: 'The Shore of Beginnings',
    meaning: 'you began. this is where you entered yourself.',
    position: { x: 15, y: 78 },
    size: 38,
    check: (s) => s.moods.length >= 1,
  },
  {
    id: 'grove_of_words',
    name: 'The Grove of Words',
    meaning: 'you started to name what you feel.',
    position: { x: 30, y: 60 },
    size: 34,
    check: (s) => s.journal.length >= 3,
  },
  {
    id: 'path_of_rhythm',
    name: 'The Path of Rhythm',
    meaning: 'you began to build a shape for your days.',
    position: { x: 55, y: 72 },
    size: 30,
    check: (s) => (s.ritualCompletions?.length ?? 0) >= 5,
  },
  {
    id: 'forest_of_recurring',
    name: 'The Forest of Recurring Themes',
    meaning: 'patterns in you have become visible.',
    position: { x: 42, y: 42 },
    size: 40,
    check: (s) => s.moods.length >= 10,
  },
  {
    id: 'caves_of_shadow',
    name: 'The Caves of Shadow',
    meaning: 'you chose to enter the hard territory.',
    position: { x: 70, y: 52 },
    size: 32,
    check: (s) => {
      const phase = s.cycle?.phase;
      return ['unraveling', 'reforming', 'emergence'].includes(phase);
    },
  },
  {
    id: 'ridge_of_patterns',
    name: 'The Ridge of Patterns',
    meaning: 'your body\'s voice became legible to you.',
    position: { x: 78, y: 30 },
    size: 35,
    check: (s) => s.moods.length >= 14 && s.profile?.onboarding?.healthEnabled,
  },
  {
    id: 'archive_of_light',
    name: 'The Archive of Light',
    meaning: 'your brighter moments are preserved and retrievable.',
    position: { x: 22, y: 35 },
    size: 30,
    check: (s) => s.journal.filter((j) => j.isResurfaceable).length >= 5,
  },
  {
    id: 'honoring_grounds',
    name: 'The Honoring Grounds',
    meaning: 'you acknowledged what you have carried.',
    position: { x: 58, y: 22 },
    size: 28,
    check: (s) => {
      const heavy = s.moods.filter((m) => ['heavy', 'melancholy'].includes(m.mood));
      return heavy.length >= 3 && s.journal.length >= 5;
    },
  },
  {
    id: 'clearing_of_change',
    name: 'The Clearing of Change',
    meaning: 'something shifted. you noticed.',
    position: { x: 40, y: 15 },
    size: 36,
    check: (s) => {
      const phase = s.cycle?.phase;
      return ['reforming', 'emergence'].includes(phase);
    },
  },
  {
    id: 'tide_pools',
    name: 'The Tide Pools of Archetype',
    meaning: 'you have met several of your inner figures.',
    position: { x: 85, y: 68 },
    size: 28,
    check: (s) => s.profile?.onboarding?.archetypeEnabled && s.moods.length >= 7,
  },
  {
    id: 'sanctuary',
    name: 'The Sanctuary',
    meaning: 'you built a sacred space inside yourself.',
    position: { x: 50, y: 48 },
    size: 42,
    check: (s) => s.cycle?.ecloseAcknowledged === true,
  },
];

/**
 * Detect which regions are discovered based on current state.
 * Returns a Set of region IDs.
 */
export function detectDiscoveredRegions(state) {
  const discovered = new Set();
  for (const region of REGIONS) {
    try {
      if (region.check(state)) {
        discovered.add(region.id);
      }
    } catch {
      // fail silently — never crash the map
    }
  }
  return discovered;
}
