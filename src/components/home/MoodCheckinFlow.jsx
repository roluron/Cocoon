/**
 * Mood Check-in Flow — the emotional core of Cocoon.
 *
 * Three stages:
 *   1. Select — name what you feel (editorial list, not glowing orbs)
 *   2. Breathe — decompression chamber (no instructions, just the circle)
 *   3. Invite — "feel like writing today?" (yes / not today, both valid)
 *
 * Anti-anxiety:
 *   - "Not today" is a complete, respected answer
 *   - No guilt, no streak counters for journaling
 *   - The breathing space adapts: shorter as user builds familiarity
 *   - Background tap = "not today" (escape hatch, never trapped)
 */

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import MoodOption from '../shared/MoodOption.jsx';
import BreathingCircle from './BreathingCircle.jsx';
import { MOODS, moodLabel } from '../../utils/moodAlgorithm.js';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { dayInCycle } from '../../utils/promptArc.js';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Adaptive timing: shorter breathing space as user builds familiarity */
function breathDuration(cycle) {
  const day = dayInCycle(cycle);
  if (day <= 7) return 24000;
  if (day <= 14) return 16000;
  return 8000;
}

export default function MoodCheckinFlow({ open, onClose, onWriteRequest }) {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const [stage, setStage] = useState('select');
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const breathMs = useMemo(() => breathDuration(state.cycle), [state.cycle]);

  useEffect(() => {
    if (!open) {
      setStage('select');
      setMood(null);
      setNote('');
      setShowInvite(false);
    }
  }, [open]);

  useEffect(() => {
    if (stage !== 'breathe') return;
    const t = setTimeout(() => setShowInvite(true), breathMs);
    return () => clearTimeout(t);
  }, [stage, breathMs]);

  const commitMood = (m) => {
    setMood(m);
    dispatch({
      type: 'ADD_MOOD',
      payload: {
        id: uid(),
        timestamp: new Date().toISOString(),
        mood: m,
        note: note.trim() || undefined,
        source: 'check-in',
      },
    });
    setStage('breathe');
  };

  const dismiss = () => onClose();

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-cocoon-void/98 backdrop-blur sheet-fade"
      onClick={(e) => {
        if (stage === 'invite' && e.target === e.currentTarget) dismiss();
      }}
    >
      {/* close — always available, never prominent */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/60 hover:text-cocoon-pearl transition"
      >
        close
      </button>

      {/* Stage 1: Select */}
      {stage === 'select' && (
        <div
          className="flex h-full flex-col justify-center px-8"
          style={{ animation: 'cocoon-sheet-fade 0.8s ease-out both' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            check in
          </p>
          <h2
            className="mt-2 font-display italic text-cocoon-light leading-snug"
            style={{ fontSize: 'clamp(24px, 7vw, 32px)' }}
          >
            How are you, right now?
          </h2>

          <div className="mt-8 flex flex-col gap-0">
            {MOODS.map((m) => (
              <MoodOption
                key={m.id}
                mood={m}
                selected={mood === m.id}
                dimmed={mood && mood !== m.id}
                onSelect={commitMood}
              />
            ))}
          </div>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="in a few words..."
            className="mt-8 w-full border-b border-cocoon-mist bg-transparent pb-2 font-display italic text-[16px] text-cocoon-pearl placeholder:text-cocoon-ash/40 focus:border-cocoon-ash focus:outline-none"
          />
        </div>
      )}

      {/* Stage 2: Breathe + Stage 3: Invite */}
      {(stage === 'breathe' || stage === 'invite') && mood && (
        <div
          className="flex h-full flex-col items-center justify-center gap-10 px-8 text-center"
          style={{ animation: 'cocoon-sheet-fade 1.5s ease-out both' }}
        >
          <BreathingCircle size={200} />

          <p className="font-display italic text-cocoon-pearl/60 text-[18px]">
            {moodLabel(mood).toLowerCase()}
          </p>

          {showInvite && (
            <div
              className="flex flex-col items-center gap-6"
              style={{ animation: 'cocoon-sheet-fade 1.5s ease-out both' }}
              onAnimationStart={() => setStage('invite')}
            >
              <p className="font-display italic text-cocoon-pearl text-[17px]">
                Feel like writing today?
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onWriteRequest?.();
                }}
                className="rounded-full border px-8 py-3 font-display italic text-[15px] text-cocoon-light transition"
                style={{
                  borderColor: `${glow}66`,
                  boxShadow: `0 0 20px ${glow}22`,
                }}
              >
                yes
              </button>

              <button
                type="button"
                onClick={dismiss}
                className="font-display italic text-[13px] text-cocoon-ash/70 hover:text-cocoon-pearl transition"
              >
                not today
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return createPortal(content, document.getElementById('root') ?? document.body);
}
