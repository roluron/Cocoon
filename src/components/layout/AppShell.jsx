import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './BottomNav.jsx';
import HomeScreen from '../home/HomeScreen.jsx';
import JournalScreen from '../journal/JournalScreen.jsx';
import RitualsScreen from '../rituals/RitualsScreen.jsx';
import SoundscapeScreen from '../soundscape/SoundscapeScreen.jsx';
import PresenceNudge from '../shared/PresenceNudge.jsx';

const SCREENS = {
  home: HomeScreen,
  journal: JournalScreen,
  rituals: RitualsScreen,
  soundscape: SoundscapeScreen,
};

export default function AppShell({ initialTab = 'home' }) {
  const [tab, setTab] = useState(initialTab);
  const [journalIntent, setJournalIntent] = useState(null);

  const ScreenComponent = SCREENS[tab];

  const goToJournal = (intent = 'open') => {
    setJournalIntent(intent);
    setTab('journal');
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-y-auto"
          >
            <ScreenComponent onGoToJournal={goToJournal} journalIntent={journalIntent} />
          </motion.div>
        </AnimatePresence>
        <PresenceNudge />
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
