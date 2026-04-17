import { useApp } from '../../context/AppContext.jsx';
import { moodColor } from '../../utils/moodAlgorithm.js';

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function entrySnippet(e) {
  if (e.quickPulse) return e.quickPulse;
  if (e.guidedReflection?.response) return e.guidedReflection.response.slice(0, 120);
  if (e.freeWrite) return e.freeWrite.slice(0, 120);
  return '';
}

function entryType(e) {
  if (e.quickPulse) return 'pulse';
  if (e.guidedReflection) return 'reflection';
  if (e.freeWrite) return 'free write';
  return '';
}

export default function PastEntries() {
  const { state } = useApp();
  const entries = [...state.journal].reverse();
  if (!entries.length) return null;

  return (
    <section className="mt-6 px-6">
      <div className="flex items-baseline justify-between">
        <span
          className="font-display italic text-cocoon-pearl/70 text-[15px]"
          aria-hidden="true"
        >
          ✦
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          past
        </span>
      </div>

      <ul className="mt-4 flex flex-col">
        {entries.map((e, i) => {
          const snippet = entrySnippet(e);
          const type = entryType(e);
          return (
            <li key={e.id}>
              <div className="flex items-start gap-4 py-4">
                <span
                  className="mt-2 inline-block h-[6px] w-[6px] shrink-0 rounded-full"
                  style={{ background: moodColor(e.moodAtTime) }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cocoon-ash/80 tabular-nums">
                      {dateLabel(e.date)}
                    </span>
                    {type && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/50">
                        {type}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-display italic text-[16px] text-cocoon-pearl/90 leading-snug">
                    {snippet}
                    {snippet.length >= 120 && '…'}
                  </p>
                </div>
              </div>
              {i < entries.length - 1 && (
                <div
                  className="ml-[22px] h-px opacity-25"
                  style={{ background: 'var(--cocoon-mist)' }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
