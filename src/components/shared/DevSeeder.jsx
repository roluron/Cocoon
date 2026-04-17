import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { storage } from '../../utils/storage.js';
import { MOODS } from '../../utils/moodAlgorithm.js';
import { PHASE_ORDER } from '../../utils/phaseTransition.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const dayIso = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

const MOOD_IDS = MOODS.map((m) => m.id);
const PHASE_LABELS = {
  dormancy: 'Dormancy',
  stirring: 'Stirring',
  unraveling: 'Unraveling',
  reforming: 'Reforming',
  emergence: 'Emergence',
};

function buildMockHistory(days = 12) {
  const pattern = [
    'serene', 'peaceful', 'creative', 'light', 'energized',
    'creative', 'peaceful', 'restless', 'melancholy', 'heavy',
    'heavy', 'melancholy',
  ];
  const moods = Array.from({ length: days }, (_, i) => ({
    id: uid(),
    timestamp: dayIso(days - 1 - i),
    mood: pattern[i % pattern.length],
    source: 'check-in',
  }));

  const journal = [
    {
      id: uid(),
      date: dayIso(days - 1).slice(0, 10),
      freeWrite: 'Walked at sunrise without checking my phone. Felt the air on my skin.',
      moodAtTime: 'serene',
      isResurfaceable: true,
    },
    {
      id: uid(),
      date: dayIso(Math.floor(days / 2)).slice(0, 10),
      guidedReflection: {
        prompt: 'When was the last time you felt fully present?',
        promptPhase: 'sensory',
        response: 'Sitting on the kitchen floor with the dog this morning.',
      },
      moodAtTime: 'peaceful',
      isResurfaceable: true,
    },
    {
      id: uid(),
      date: dayIso(1).slice(0, 10),
      quickPulse: 'restless',
      moodAtTime: 'restless',
      isResurfaceable: false,
    },
  ];

  return { moods, journal };
}

export default function DevSeeder() {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const [open, setOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  const currentPhase = state.cycle?.phase ?? 'dormancy';
  const lastMood = state.moods[state.moods.length - 1]?.mood;

  const setPhase = (phase) => {
    if (!state.cycle) return;
    dispatch({
      type: 'SEED',
      payload: {
        cycle: {
          ...state.cycle,
          phase,
          phaseHistory: [
            ...state.cycle.phaseHistory,
            { phase, enteredAt: new Date().toISOString() },
          ],
        },
      },
    });
  };

  const setMood = (mood) => {
    dispatch({
      type: 'ADD_MOOD',
      payload: {
        id: uid(),
        timestamp: new Date().toISOString(),
        mood,
        source: 'dev-tool',
      },
    });
  };

  const seedHistory = (days) => {
    const { moods, journal } = buildMockHistory(days);
    const cycle = state.cycle ?? {
      id: uid(),
      intention: '',
      startDate: dayIso(days),
      phase: 'dormancy',
      phaseHistory: [{ phase: 'dormancy', enteredAt: dayIso(days) }],
      dominantColor: '#4a7c8a',
      ecloseAcknowledged: false,
    };
    dispatch({
      type: 'SEED',
      payload: {
        moods: [...state.moods, ...moods],
        journal: [...state.journal, ...journal],
        cycle: { ...cycle, startDate: dayIso(days) },
      },
    });
  };

  const advanceDays = (n) => {
    if (!state.cycle) return;
    const d = new Date(state.cycle.startDate);
    d.setDate(d.getDate() - n);
    dispatch({
      type: 'SEED',
      payload: {
        cycle: { ...state.cycle, startDate: d.toISOString() },
      },
    });
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
          aria-label="Open dev tools"
        >
          dev
        </button>
      ) : (
        <div
          className="flex w-[260px] flex-col gap-3 rounded-card border border-cocoon-mist/60 bg-cocoon-deep/95 p-4 backdrop-blur-xl"
          style={{ maxHeight: '80vh', overflow: 'auto' }}
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cocoon-ash">
              time machine
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-[9px] uppercase tracking-widest text-cocoon-ash hover:text-cocoon-pearl"
            >
              ✕
            </button>
          </div>

          {/* phase switcher */}
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/70">
              phase
            </p>
            <div className="flex flex-wrap gap-1">
              {PHASE_ORDER.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  className="rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition"
                  style={{
                    background: currentPhase === p ? glow + '33' : 'transparent',
                    color: currentPhase === p ? 'var(--cocoon-light)' : 'var(--cocoon-ash)',
                    border: `1px solid ${currentPhase === p ? glow + '66' : 'var(--cocoon-mist)'}`,
                  }}
                >
                  {PHASE_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* mood switcher */}
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/70">
              mood → {lastMood ?? 'none'}
            </p>
            <div className="flex flex-wrap gap-1">
              {MOOD_IDS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className="rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition"
                  style={{
                    background: lastMood === m ? `var(--mood-${m})33` : 'transparent',
                    color: lastMood === m ? 'var(--cocoon-light)' : 'var(--cocoon-ash)',
                    border: `1px solid ${lastMood === m ? `var(--mood-${m})` : 'var(--cocoon-mist)'}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* time travel */}
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/70">
              advance cycle by
            </p>
            <div className="flex gap-1">
              {[1, 3, 7, 14, 21].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => advanceDays(n)}
                  className="rounded-full border border-cocoon-mist px-2 py-1 font-mono text-[9px] text-cocoon-ash hover:border-cocoon-ash hover:text-cocoon-pearl transition"
                >
                  +{n}d
                </button>
              ))}
            </div>
          </div>

          {/* seed history */}
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/70">
              seed history
            </p>
            <div className="flex gap-1">
              {[7, 14, 21, 30].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => seedHistory(n)}
                  className="rounded-full border border-cocoon-mist px-2 py-1 font-mono text-[9px] text-cocoon-ash hover:border-cocoon-ash hover:text-cocoon-pearl transition"
                >
                  {n} days
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          {state.cycle && (
            <div className="mt-1 flex flex-col gap-1 border-t border-cocoon-mist/50 pt-2">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-cocoon-ash/60">
                cycle start: {state.cycle.startDate?.slice(0, 10)}
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-cocoon-ash/60">
                moods: {state.moods.length} · journal: {state.journal.length} · rituals: {state.rituals.length}
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-cocoon-ash/60">
                check-ins today: {state.presence.checkInsToday}
              </p>
            </div>
          )}

          {/* reset */}
          <button
            type="button"
            onClick={reset}
            className="mt-1 rounded-card border border-cocoon-mist px-3 py-2 text-left font-mono text-[9px] uppercase tracking-wider text-cocoon-ash hover:border-red-900/50 hover:text-red-400 transition"
          >
            reset all state
          </button>
        </div>
      )}
    </div>
  );
}
