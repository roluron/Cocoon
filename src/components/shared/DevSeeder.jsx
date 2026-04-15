import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { storage } from '../../utils/storage.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const dayIso = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

function buildMockHistory() {
  // 12 days of history: 7 lighter days, then 2 heavy days at the end
  const moodPattern = [
    'serene', 'peaceful', 'creative', 'light', 'energized',
    'creative', 'peaceful', 'restless', 'melancholy', 'heavy',
    'heavy', 'melancholy',
  ];

  const moods = moodPattern.map((mood, i) => ({
    id: uid(),
    timestamp: dayIso(moodPattern.length - 1 - i),
    mood,
    source: 'check-in',
  }));

  // Seed a few resurfaceable journal entries from the bright early days
  const journal = [
    {
      id: uid(),
      date: dayIso(11).slice(0, 10),
      freeWrite:
        'Walked at sunrise without checking my phone. Felt the air on my skin and remembered I have a body. This is the version of me I want to keep visiting.',
      moodAtTime: 'serene',
      isResurfaceable: true,
    },
    {
      id: uid(),
      date: dayIso(9).slice(0, 10),
      quickPulse: 'open',
      moodAtTime: 'creative',
      isResurfaceable: true,
    },
    {
      id: uid(),
      date: dayIso(7).slice(0, 10),
      guidedReflection: {
        prompt: 'When was the last time you felt fully present?',
        promptPhase: 'sensory',
        response:
          'Sitting on the kitchen floor with the dog this morning. I had nowhere to be for ten minutes and I let myself have them.',
      },
      moodAtTime: 'peaceful',
      isResurfaceable: true,
    },
  ];

  return { moods, journal };
}

export default function DevSeeder() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  const seed = () => {
    const { moods, journal } = buildMockHistory();
    const cycle = state.cycle ?? {
      id: uid(),
      intention: 'Devseed cycle',
      startDate: dayIso(11),
      phase: 'dormancy',
      phaseHistory: [{ phase: 'dormancy', enteredAt: dayIso(11) }],
      dominantColor: '#4a7c8a',
      ecloseAcknowledged: false,
    };
    dispatch({
      type: 'SEED',
      payload: {
        moods: [...state.moods, ...moods],
        journal: [...state.journal, ...journal],
        cycle: { ...cycle, startDate: dayIso(11) },
      },
    });
    setOpen(false);
  };

  const reset = () => {
    storage.clearAll();
    location.reload();
  };

  return (
    <div className="absolute right-3 top-3 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-cocoon-mist/60 bg-cocoon-deep/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cocoon-ash backdrop-blur"
          aria-label="Open dev seeder"
        >
          dev
        </button>
      ) : (
        <div className="flex flex-col gap-2 rounded-card border border-cocoon-mist/60 bg-cocoon-deep/95 p-3 backdrop-blur">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cocoon-ash">
            Dev tools
          </p>
          <button
            type="button"
            onClick={seed}
            className="rounded-card border border-cocoon-mist px-3 py-2 text-left font-body text-xs text-cocoon-pearl hover:border-cocoon-ash"
          >
            Seed 12-day history
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-card border border-cocoon-mist px-3 py-2 text-left font-body text-xs text-cocoon-pearl hover:border-cocoon-ash"
          >
            Reset all state
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-mono text-[10px] uppercase tracking-widest text-cocoon-ash"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
