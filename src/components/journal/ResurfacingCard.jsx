import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { selectResurfacing } from '../../utils/resurfacingSelector.js';
import { moodColor } from '../../utils/moodAlgorithm.js';

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export default function ResurfacingCard() {
  const { state, dispatch } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const entry = useMemo(
    () => selectResurfacing({ moods: state.moods, journal: state.journal }),
    [state.moods, state.journal]
  );

  if (!entry || dismissed) return null;

  const text =
    entry.freeWrite?.trim() ||
    entry.guidedReflection?.response?.trim() ||
    entry.quickPulse?.trim() ||
    '';
  if (!text) return null;

  const onDismiss = () => {
    dispatch({
      type: 'UPDATE_JOURNAL',
      payload: { id: entry.id, patch: { lastResurfacedAt: new Date().toISOString() } },
    });
    setDismissed(true);
  };

  const dot = moodColor(entry.moodAtTime);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="mx-5 mt-4 rounded-card border px-5 py-5"
      style={{
        borderColor: 'var(--cocoon-mist)',
        background:
          'linear-gradient(180deg, color-mix(in oklab, var(--cocoon-deep) 92%, #2a2018 8%) 0%, var(--cocoon-deep) 100%)',
      }}
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
        From a lighter day
      </p>
      <p className="mt-4 font-display italic text-cocoon-light text-lg leading-relaxed">
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: dot }}
          aria-hidden
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-cocoon-ash">
          {dateLabel(entry.date)}
        </span>
      </div>
      <p className="mt-4 font-body text-[13px] text-cocoon-ash">
        You wrote this. You&rsquo;ve felt this before.
      </p>
      <div className="mt-3 text-right">
        <button
          type="button"
          onClick={onDismiss}
          className="font-body text-[12px] text-cocoon-ash underline-offset-4 hover:underline"
        >
          Set aside
        </button>
      </div>
    </motion.section>
  );
}
