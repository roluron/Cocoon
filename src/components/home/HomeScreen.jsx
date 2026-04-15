import { Settings } from 'lucide-react';
import { useState } from 'react';
import CocoonStateCard from './CocoonStateCard.jsx';
import TodayRituals from './TodayRituals.jsx';
import WisdomFragment from './WisdomFragment.jsx';
import MoodCheckinFlow from './MoodCheckinFlow.jsx';
import { useApp } from '../../context/AppContext.jsx';

function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ onGoToJournal }) {
  const { state } = useApp();
  const [checkinOpen, setCheckinOpen] = useState(false);
  const softCheckin = state.presence.checkInsToday >= 3;

  return (
    <div className="flex min-h-full flex-col pb-4">
      <header className="flex items-center justify-between px-6 pt-8 pb-2">
        <p className="font-body text-sm text-cocoon-ash">{greeting()}</p>
        <button
          type="button"
          aria-label="Settings"
          className="text-cocoon-ash hover:text-cocoon-pearl"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </header>

      <CocoonStateCard
        onCheckin={() => setCheckinOpen(true)}
        softCheckin={softCheckin}
      />
      <TodayRituals />
      <WisdomFragment />

      <MoodCheckinFlow
        open={checkinOpen}
        onClose={() => setCheckinOpen(false)}
        onWriteRequest={() => onGoToJournal?.('reflect')}
      />
    </div>
  );
}
