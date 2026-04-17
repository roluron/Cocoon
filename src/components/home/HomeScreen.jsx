import { Settings } from 'lucide-react';
import { useState } from 'react';
import CocoonStateCard from './CocoonStateCard.jsx';
import TodayRituals from './TodayRituals.jsx';
import WeeklyTarotCard from './WeeklyTarotCard.jsx';
import WisdomFragment from './WisdomFragment.jsx';
import MoodCheckinFlow from './MoodCheckinFlow.jsx';
import WeeklySummary from './WeeklySummary.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import ArchetypeProfile from './ArchetypeProfile.jsx';
import EclosionCeremony from './EclosionCeremony.jsx';
import DiscoveryMap from './DiscoveryMap.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { Map } from 'lucide-react';

export default function HomeScreen({ onGoToJournal }) {
  const { state } = useApp();
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [archetypeOpen, setArchetypeOpen] = useState(false);
  const [eclosionOpen, setEclosionOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const softCheckin = state.presence.checkInsToday >= 3;

  // Check if éclosion is ready (emergence phase, not yet acknowledged)
  const eclosionReady =
    state.cycle?.phase === 'emergence' && !state.cycle?.ecloseAcknowledged;

  return (
    <div className="flex min-h-full flex-col pb-10">
      <header className="flex items-start justify-between px-5 pt-6 pb-0">
        <button
          type="button"
          aria-label="Discovery map"
          onClick={() => setMapOpen(true)}
          className="text-cocoon-ash/50 hover:text-cocoon-pearl transition"
        >
          <Map size={16} strokeWidth={1.25} />
        </button>
        <button
          type="button"
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
          className="text-cocoon-ash/70 hover:text-cocoon-pearl transition"
        >
          <Settings size={16} strokeWidth={1.25} />
        </button>
      </header>

      {/* Éclosion trigger — gentle, not urgent */}
      {eclosionReady && (
        <button
          type="button"
          onClick={() => setEclosionOpen(true)}
          className="mx-6 mt-2 flex items-center gap-2 py-1"
        >
          <span
            className="h-[5px] w-[5px] rounded-full"
            style={{ background: 'var(--cocoon-glow)', animation: 'cocoon-breath 4s ease-in-out infinite' }}
          />
          <span className="font-display italic text-[13px] text-cocoon-pearl/60">
            something is ready
          </span>
        </button>
      )}

      <CocoonStateCard
        onCheckin={() => setCheckinOpen(true)}
        softCheckin={softCheckin}
      />
      <TodayRituals />
      {state.profile?.onboarding?.archetypeEnabled && <WeeklyTarotCard />}

      {/* Weekly summary trigger — sits above the wisdom fragment */}
      <div className="mt-8 px-6 mb-2">
        <button
          type="button"
          onClick={() => setWeeklyOpen(true)}
          className="group flex items-center gap-2 py-1 text-left"
          aria-label="Open weekly summary"
        >
          <span className="font-mono text-[10px] text-cocoon-ash/50 group-hover:text-cocoon-ash transition">
            ✦
          </span>
          <span className="font-display italic text-[14px] text-cocoon-pearl/50 group-hover:text-cocoon-pearl/80 transition">
            your week
          </span>
        </button>
      </div>

      <WisdomFragment />

      <MoodCheckinFlow
        open={checkinOpen}
        onClose={() => setCheckinOpen(false)}
        onWriteRequest={() => onGoToJournal?.('reflect')}
      />

      <WeeklySummary
        open={weeklyOpen}
        onClose={() => setWeeklyOpen(false)}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenArchetype={() => {
          setSettingsOpen(false);
          setTimeout(() => setArchetypeOpen(true), 350);
        }}
      />

      <ArchetypeProfile
        open={archetypeOpen}
        onClose={() => setArchetypeOpen(false)}
      />

      <EclosionCeremony
        open={eclosionOpen}
        onClose={(startNew) => {
          setEclosionOpen(false);
          // If user chose "begin a new cycle", could navigate to intention screen
          // For now, just close — resting state will show on next render
        }}
      />

      <DiscoveryMap
        open={mapOpen}
        onClose={() => setMapOpen(false)}
      />
    </div>
  );
}
