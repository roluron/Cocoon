import { useApp } from '../../context/AppContext.jsx';
import { dayInCycle } from '../../utils/promptArc.js';
import ScreenHeader from '../shared/ScreenHeader.jsx';
import QuickPulse from './QuickPulse.jsx';
import GuidedReflection from './GuidedReflection.jsx';
import ResurfacingCard from './ResurfacingCard.jsx';
import FreeJournal from './FreeJournal.jsx';
import PastEntries from './PastEntries.jsx';

export default function JournalScreen({ journalIntent }) {
  const { state } = useApp();
  const day = dayInCycle(state.cycle);

  return (
    <div className="flex min-h-full flex-col pb-6">
      <ScreenHeader title="Journal" subtitle={`Day ${day} of your cycle`} />
      <QuickPulse />
      <ResurfacingCard />
      <GuidedReflection autoFocus={journalIntent === 'reflect'} />
      <FreeJournal />
      <PastEntries />
    </div>
  );
}
