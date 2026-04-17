/**
 * Resting State
 *
 * Shown on home screen after éclosion when user chose "I'm good for now."
 * The butterfly sits quietly. Mood check-in still works. No rituals.
 * After 7+ days, a gentle re-entry whisper appears once.
 *
 * Anti-anxiety: no countdown, no "you've been resting for X days",
 * no guilt. The butterfly is just there, calm, like a plant on a shelf.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

function Butterfly({ color, size = 140 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 60 C45 30, 15 20, 20 50 C25 70, 40 75, 60 60"
        fill={`${color}44`}
        stroke={`${color}66`}
        strokeWidth="0.5"
      />
      <path
        d="M60 60 C50 50, 25 55, 30 75 C35 85, 50 80, 60 60"
        fill={`${color}33`}
        stroke={`${color}55`}
        strokeWidth="0.5"
      />
      <path
        d="M60 60 C75 30, 105 20, 100 50 C95 70, 80 75, 60 60"
        fill={`${color}44`}
        stroke={`${color}66`}
        strokeWidth="0.5"
      />
      <path
        d="M60 60 C70 50, 95 55, 90 75 C85 85, 70 80, 60 60"
        fill={`${color}33`}
        stroke={`${color}55`}
        strokeWidth="0.5"
      />
      <line
        x1="60" y1="40" x2="60" y2="80"
        stroke={`${color}88`}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M60 42 C55 32, 50 28, 48 25" stroke={`${color}55`} strokeWidth="0.5" fill="none" />
      <path d="M60 42 C65 32, 70 28, 72 25" stroke={`${color}55`} strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export default function RestingState({ onBeginNewCycle, daysSinceEclosion = 0 }) {
  const { glow } = useTheme();

  // Gentle re-entry appears once after 7 days, then never again
  const showReentry = daysSinceEclosion >= 7;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      >
        <Butterfly color={glow} size={160} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70"
      >
        resting
      </motion.p>

      {showReentry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="mt-12 flex flex-col items-center"
        >
          <button
            type="button"
            onClick={onBeginNewCycle}
            className="font-display italic text-[14px] text-cocoon-pearl/60 hover:text-cocoon-light transition"
          >
            whenever you're ready.
          </button>
        </motion.div>
      )}
    </div>
  );
}
