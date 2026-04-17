import { AnimatePresence, motion } from 'framer-motion';
import { Feather, Moon, Pause, Play, Sunrise, Target, Wind } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AmbientCanvas from './AmbientCanvas.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { moodLabel } from '../../utils/moodAlgorithm.js';
import { useSoundEngine } from '../../utils/useSoundEngine.js';

const MODES = [
  {
    id: 'wake',
    label: 'Wake',
    icon: Sunrise,
    blurb: 'soft activation, the first light',
    palette: ['#d9a36a', '#8a6a3d', '#4a3d3d'],
  },
  {
    id: 'focus',
    label: 'Focus',
    icon: Target,
    blurb: 'low, sustained, room to think',
    palette: ['#4a6a8a', '#2a3d5c', '#1a1a3d'],
  },
  {
    id: 'create',
    label: 'Create',
    icon: Feather,
    blurb: 'modal, open, unpredictable',
    palette: ['#8a6ab4', '#6b4a7c', '#3d2a5c'],
  },
  {
    id: 'move',
    label: 'Move',
    icon: Wind,
    blurb: 'a pulse you can follow',
    palette: ['#6b8a4a', '#3d6b5c', '#1a3d3d'],
  },
  {
    id: 'rest',
    label: 'Rest',
    icon: Moon,
    blurb: 'slower than sleep, quieter than silence',
    palette: ['#3d3d6b', '#2a2a4a', '#12121a'],
  },
];

const DURATIONS = [15, 30, 60, null];

export default function SoundscapeScreen() {
  const { state } = useApp();
  const [modeId, setModeId] = useState('focus');
  const [volume, setVolume] = useState(0.6);
  const [fadeOut, setFadeOut] = useState(null);
  const mode = useMemo(() => MODES.find((m) => m.id === modeId), [modeId]);
  const lastMood = state.moods[state.moods.length - 1]?.mood ?? 'peaceful';
  const { playing, loading, play, stop } = useSoundEngine({
    mode: modeId,
    mood: lastMood,
    volume,
    fadeOut,
  });

  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef(null);
  useEffect(() => {
    if (!playing) {
      setElapsed(0);
      startedAtRef.current = null;
      return;
    }
    startedAtRef.current = Date.now();
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [playing]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden pb-10">
      <AmbientCanvas palette={mode.palette} playing={playing} />

      {/* header */}
      <div className="relative z-10 flex flex-col px-6 pt-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          soundscape
        </span>
        <AnimatePresence mode="wait">
          <motion.h1
            key={mode.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.8 }}
            className="mt-1 font-display italic text-cocoon-light leading-[0.95]"
            style={{ fontSize: 'clamp(48px, 14vw, 68px)', letterSpacing: '-0.01em' }}
          >
            {mode.label}
          </motion.h1>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={mode.id + '-b'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-3 max-w-[80%] font-display italic text-cocoon-pearl/75 text-[16px] leading-snug"
          >
            {mode.blurb}.
          </motion.p>
        </AnimatePresence>
      </div>

      {/* central play region */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <button
          type="button"
          onClick={() => (playing ? stop() : play())}
          aria-label={playing ? 'Stop' : 'Play'}
          disabled={loading}
          className="group relative flex h-[184px] w-[184px] items-center justify-center"
        >
          {/* breathing ring when playing */}
          <span
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: `${mode.palette[0]}aa`,
              animation: playing ? 'cocoon-breathe 5.5s ease-in-out infinite' : 'none',
            }}
          />
          <span
            className="absolute inset-[12%] rounded-full border"
            style={{
              borderColor: `${mode.palette[1]}88`,
              animation: playing ? 'cocoon-breathe 7s ease-in-out infinite' : 'none',
              animationDelay: '1s',
            }}
          />
          <span
            className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border backdrop-blur-sm transition"
            style={{
              borderColor: 'rgba(232,232,240,0.35)',
              background: 'rgba(18,18,26,0.55)',
            }}
          >
            {playing ? (
              <Pause size={22} strokeWidth={1.25} className="text-cocoon-light" />
            ) : (
              <Play
                size={22}
                strokeWidth={1.25}
                className="text-cocoon-light translate-x-[2px]"
              />
            )}
          </span>
        </button>

        {/* elapsed */}
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] tabular-nums text-cocoon-pearl/70">
          {playing ? fmt(elapsed) : '—— · ——'}
        </div>

        {/* tuned-to */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-cocoon-ash/80">
            tuned to
          </span>
          <span className="font-display italic text-[14px] text-cocoon-pearl/85">
            {moodLabel(lastMood).toLowerCase()}
          </span>
        </div>
      </div>

      {/* mode selector */}
      <div className="relative z-10 px-6">
        <div
          className="mb-4 h-px opacity-40"
          style={{
            background:
              'linear-gradient(to right, transparent, var(--cocoon-mist), transparent)',
          }}
        />
        <div className="flex items-start justify-between gap-2">
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = m.id === modeId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModeId(m.id)}
                className="group flex flex-1 flex-col items-center gap-2 py-1"
                aria-pressed={active}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition"
                  style={{
                    borderColor: active
                      ? 'rgba(232,232,240,0.55)'
                      : 'rgba(107,107,123,0.35)',
                    background: active
                      ? `radial-gradient(circle at 40% 40%, ${m.palette[0]}55, transparent 70%)`
                      : 'transparent',
                  }}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.25}
                    className={active ? 'text-cocoon-light' : 'text-cocoon-ash'}
                  />
                </span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.22em] transition ${
                    active ? 'text-cocoon-pearl' : 'text-cocoon-ash/70'
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* duration + volume */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            {DURATIONS.map((d) => {
              const active = fadeOut === d;
              return (
                <button
                  key={d ?? 'inf'}
                  type="button"
                  onClick={() => setFadeOut(d)}
                  className={`transition ${
                    active
                      ? 'text-cocoon-light'
                      : 'text-cocoon-ash/60 hover:text-cocoon-pearl'
                  }`}
                >
                  {d ? `${d}m` : '∞'}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60">
              vol
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="cocoon-range"
              style={{ width: 80 }}
              aria-label="Volume"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
