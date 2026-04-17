import { useApp } from '../../context/AppContext.jsx';
import { dayInCycle } from '../../utils/promptArc.js';
import QuickPulse from './QuickPulse.jsx';
import GuidedReflection from './GuidedReflection.jsx';
import ResurfacingCard from './ResurfacingCard.jsx';
import FreeJournal from './FreeJournal.jsx';
import PastEntries from './PastEntries.jsx';

export default function JournalScreen({ journalIntent }) {
  const { state } = useApp();
  const day = dayInCycle(state.cycle);

  return (
    <div className="flex min-h-full flex-col pb-10">
      <header className="flex flex-col px-6 pt-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          day {day} of your cycle
        </span>
        <h1
          className="mt-1 font-display italic text-cocoon-light leading-[0.95]"
          style={{ fontSize: 'clamp(48px, 14vw, 68px)', letterSpacing: '-0.01em' }}
        >
          Journal
        </h1>
      </header>

      <QuickPulse />
      <ResurfacingCard />
      <GuidedReflection autoFocus={journalIntent === 'reflect'} />
      <FreeJournal />

      <div
        className="mt-10 mx-6 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
        }}
      />

      <PastEntries />
    </div>
  );
}
