import AmbientOrb from '../shared/AmbientOrb.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { moodLabel } from '../../utils/moodAlgorithm.js';

const PHASE_LABELS = {
  dormancy: 'Dormancy',
  stirring: 'Stirring',
  unraveling: 'Unraveling',
  reforming: 'Reforming',
  emergence: 'Emergence',
};

export default function CocoonStateCard({ onCheckin, softCheckin }) {
  const { state } = useApp();
  const lastMood = state.moods[state.moods.length - 1]?.mood;
  const phase = state.cycle?.phase ?? 'dormancy';

  return (
    <section className="mx-5 mt-2 flex flex-col items-center justify-between rounded-modal border border-cocoon-mist/50 bg-cocoon-deep/70 px-6 py-8 backdrop-blur"
      style={{ minHeight: '60vh' }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <AmbientOrb size={200} />
        {lastMood && (
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-cocoon-light text-xl">{moodLabel(lastMood)}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
              {PHASE_LABELS[phase]}
            </p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onCheckin}
        className="font-body text-sm text-cocoon-pearl underline-offset-4 hover:underline"
      >
        {softCheckin ? 'You\u2019ve already checked in today. Trust what you felt.' : 'How are you now?'}
      </button>
    </section>
  );
}
