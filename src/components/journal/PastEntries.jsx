import { useApp } from '../../context/AppContext.jsx';
import { moodColor } from '../../utils/moodAlgorithm.js';

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function entrySnippet(e) {
  if (e.quickPulse) return e.quickPulse;
  if (e.guidedReflection?.response) return e.guidedReflection.response.slice(0, 80);
  if (e.freeWrite) return e.freeWrite.slice(0, 80);
  return '';
}

export default function PastEntries() {
  const { state } = useApp();
  const entries = [...state.journal].reverse();
  if (!entries.length) return null;

  return (
    <section className="mx-5 mt-6">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">Past</h3>
      <ul className="mt-3 space-y-2">
        {entries.map((e) => (
          <li
            key={e.id}
            className="flex items-start gap-3 rounded-card border border-cocoon-mist/40 bg-cocoon-deep/40 px-4 py-3"
          >
            <span
              className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ background: moodColor(e.moodAtTime) }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cocoon-ash">
                {dateLabel(e.date)}
              </p>
              <p className="mt-1 truncate font-body text-[14px] text-cocoon-pearl">
                {entrySnippet(e)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
