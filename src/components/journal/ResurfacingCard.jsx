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
    [state.moods, state.journal],
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
    <section className="mt-10 px-6">
      <div
        className="mb-5 h-px w-8"
        style={{
          background: `linear-gradient(to right, ${dot}, transparent)`,
          opacity: 0.6,
        }}
        aria-hidden="true"
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
        from a lighter day
      </p>
      <p
        className="mt-4 font-display italic text-cocoon-light leading-[1.25]"
        style={{ fontSize: 'clamp(20px, 5.5vw, 26px)' }}
      >
        <span
          className="relative -top-1 mr-1 text-cocoon-pearl/40"
          style={{ fontSize: '1.3em', lineHeight: 0 }}
          aria-hidden="true"
        >
          "
        </span>
        {text}
      </p>
      <div className="mt-5 flex items-center gap-2">
        <span
          className="inline-block h-[6px] w-[6px] rounded-full"
          style={{ background: dot }}
          aria-hidden
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/80">
          {dateLabel(entry.date)}
        </span>
      </div>
      <p className="mt-4 font-display italic text-[14px] text-cocoon-pearl/70">
        you wrote this. you've felt this before.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70 hover:text-cocoon-pearl transition"
      >
        set aside
      </button>
    </section>
  );
}
