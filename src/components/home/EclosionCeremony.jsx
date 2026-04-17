/**
 * Éclosion Ceremony
 *
 * The emotional climax of a Cocoon cycle. Not a reward — a recognition.
 * Design principles:
 *   - Anti-anxiety: no test to pass. If something shifted, that counts.
 *   - The butterfly doesn't "pop" — it materializes slowly, like noticing
 *     a flower bloomed while you weren't looking.
 *   - The user's intention is reflected back to them.
 *   - "Come back if you need to. Or don't. Both are beautiful."
 *   - No fireworks. No confetti. Gravity. Warmth.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const STAGES = ['question', 'breath', 'emerge', 'farewell'];

function Butterfly({ color, size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className="eclosion-butterfly"
      aria-hidden="true"
    >
      {/* Left wing */}
      <path
        d="M60 60 C45 30, 15 20, 20 50 C25 70, 40 75, 60 60"
        fill={`${color}44`}
        stroke={`${color}88`}
        strokeWidth="0.5"
      />
      <path
        d="M60 60 C50 50, 25 55, 30 75 C35 85, 50 80, 60 60"
        fill={`${color}33`}
        stroke={`${color}66`}
        strokeWidth="0.5"
      />
      {/* Right wing */}
      <path
        d="M60 60 C75 30, 105 20, 100 50 C95 70, 80 75, 60 60"
        fill={`${color}44`}
        stroke={`${color}88`}
        strokeWidth="0.5"
      />
      <path
        d="M60 60 C70 50, 95 55, 90 75 C85 85, 70 80, 60 60"
        fill={`${color}33`}
        stroke={`${color}66`}
        strokeWidth="0.5"
      />
      {/* Body */}
      <line
        x1="60" y1="40" x2="60" y2="80"
        stroke={`${color}aa`}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Antennae */}
      <path
        d="M60 42 C55 32, 50 28, 48 25"
        stroke={`${color}66`}
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M60 42 C65 32, 70 28, 72 25"
        stroke={`${color}66`}
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

export default function EclosionCeremony({ open, onClose }) {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const [stage, setStage] = useState(0);
  const [revealed, setRevealed] = useState(0);

  const intention = state.cycle?.intention || 'something you couldn\'t name';
  const dominantColor = state.cycle?.dominantColor || glow;

  useEffect(() => {
    if (!open) {
      setStage(0);
      setRevealed(0);
      return;
    }
  }, [open]);

  // Auto-advance reveals within a stage
  useEffect(() => {
    if (!open) return;
    if (stage === 2) {
      // Emerge stage: slow reveal over 8 seconds
      const timers = [
        setTimeout(() => setRevealed(1), 1500),
        setTimeout(() => setRevealed(2), 3500),
        setTimeout(() => setRevealed(3), 6000),
        setTimeout(() => setRevealed(4), 8000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [open, stage]);

  if (!open) return null;

  const advance = () => {
    if (stage < STAGES.length - 1) {
      setStage((s) => s + 1);
      setRevealed(0);
    }
  };

  const complete = (startNew) => {
    dispatch({
      type: 'SEED',
      payload: {
        cycle: {
          ...state.cycle,
          ecloseAcknowledged: true,
        },
      },
    });
    onClose(startNew);
  };

  const content = (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cocoon-void"
      style={{ animation: 'cocoon-sheet-fade 1.5s ease-out both' }}
    >
      {/* Question stage — "Do you feel something has changed?" */}
      {STAGES[stage] === 'question' && (
        <div
          className="flex flex-col items-center px-8 text-center"
          style={{ animation: 'cocoon-sheet-fade 1.5s ease-out both' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            day {Math.floor((Date.now() - new Date(state.cycle?.startDate).getTime()) / 86400000) + 1}
          </p>
          <h1
            className="mt-6 font-display italic text-cocoon-light leading-[1.15]"
            style={{ fontSize: 'clamp(24px, 7vw, 32px)' }}
          >
            Do you feel something has changed?
          </h1>
          <p className="mt-4 font-display italic text-[15px] text-cocoon-pearl/70 leading-relaxed max-w-[280px]">
            Not everything. Not perfectly. Just — something.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={advance}
              className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-display italic text-[15px] text-cocoon-pearl hover:border-cocoon-pearl transition"
            >
              yes, something shifted
            </button>
            <button
              type="button"
              onClick={advance}
              className="font-display italic text-[13px] text-cocoon-ash/70"
            >
              I'm not sure yet
            </button>
          </div>
          <p className="mt-8 font-body text-[11px] text-cocoon-ash/50 max-w-[240px]">
            Both answers lead to the same place. This isn't a test.
          </p>
        </div>
      )}

      {/* Breath stage — a pause before the reveal */}
      {STAGES[stage] === 'breath' && (
        <div
          className="flex flex-col items-center px-8 text-center"
          style={{ animation: 'cocoon-sheet-fade 2s ease-out both' }}
        >
          <div
            className="h-32 w-32 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${dominantColor}88, ${dominantColor}22 55%, transparent 80%)`,
              filter: 'blur(16px)',
              animation: 'cocoon-breath 6s ease-in-out infinite',
            }}
          />
          <p
            className="mt-8 font-display italic text-cocoon-pearl/60 text-[16px]"
            style={{ animation: 'cocoon-sheet-fade 3s 2s ease-out both' }}
          >
            breathe.
          </p>
          <button
            type="button"
            onClick={advance}
            className="mt-16 font-display italic text-[13px] text-cocoon-ash/50 hover:text-cocoon-pearl/70 transition"
            style={{ animation: 'cocoon-sheet-fade 1s 5s ease-out both' }}
          >
            continue
          </button>
        </div>
      )}

      {/* Emerge stage — the butterfly materializes */}
      {STAGES[stage] === 'emerge' && (
        <div className="flex flex-col items-center px-8 text-center">
          <div
            className="transition-all duration-[4000ms]"
            style={{
              opacity: revealed >= 1 ? 1 : 0,
              transform: `scale(${revealed >= 1 ? 1 : 0.6})`,
              filter: `blur(${revealed >= 2 ? 0 : 12}px)`,
            }}
          >
            <Butterfly color={dominantColor} size={160} />
          </div>

          {revealed >= 2 && (
            <p
              className="mt-8 font-display italic text-cocoon-light text-[20px] leading-relaxed max-w-[280px]"
              style={{ animation: 'cocoon-sheet-fade 2s ease-out both' }}
            >
              "{intention}"
            </p>
          )}

          {revealed >= 3 && (
            <p
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash"
              style={{ animation: 'cocoon-sheet-fade 1.5s ease-out both' }}
            >
              you did something real.
            </p>
          )}

          {revealed >= 4 && (
            <button
              type="button"
              onClick={advance}
              className="mt-10 font-display italic text-[14px] text-cocoon-pearl/70 hover:text-cocoon-light transition"
              style={{ animation: 'cocoon-sheet-fade 1s ease-out both' }}
            >
              continue
            </button>
          )}
        </div>
      )}

      {/* Farewell stage — the anti-retention message */}
      {STAGES[stage] === 'farewell' && (
        <div
          className="flex flex-col items-center px-8 text-center"
          style={{ animation: 'cocoon-sheet-fade 2s ease-out both' }}
        >
          <p
            className="font-display italic text-cocoon-light leading-[1.3] max-w-[300px]"
            style={{ fontSize: 'clamp(20px, 6vw, 26px)' }}
          >
            Come back if you need to. Or don't. Both are beautiful.
          </p>
          <div className="mt-12 flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => complete(true)}
              className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-display italic text-[14px] text-cocoon-pearl hover:border-cocoon-pearl transition"
            >
              begin a new cycle
            </button>
            <button
              type="button"
              onClick={() => complete(false)}
              className="font-display italic text-[13px] text-cocoon-ash/70"
            >
              I'm good for now
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, document.getElementById('root') ?? document.body);
}
