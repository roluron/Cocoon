import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen.jsx';
import NameScreen from './NameScreen.jsx';
import QuestionScreen from './QuestionScreen.jsx';
import MoodSelectScreen from './MoodSelectScreen.jsx';
import TwentyOneDaysScreen from './TwentyOneDaysScreen.jsx';
import PrivacyScreen from './PrivacyScreen.jsx';
import HealthScreen from './HealthScreen.jsx';
import ArchetypeOptInScreen from './ArchetypeOptInScreen.jsx';
import BirthDataScreen from './BirthDataScreen.jsx';
import RitualSetupScreen from './RitualSetupScreen.jsx';
import IntentionScreen from './IntentionScreen.jsx';
import { useApp } from '../../context/AppContext.jsx';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function OnboardingFlow() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const next = (patch) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setStep((s) => s + 1);
  };

  const finishRituals = ({ time, caffeine, sunlight, rituals }) => {
    setAnswers((a) => ({ ...a, time, caffeine, sunlight, rituals }));
    setStep((s) => s + 1);
  };

  const finishAll = (intention) => {
    const all = { ...answers, intention };
    const profile = {
      id: uid(),
      createdAt: new Date().toISOString(),
      name: all.name ?? null,
      onboarding: {
        motivation: all.motivation,
        energyDirection: all.energy,
        priorities: all.priorities ?? [],
        morningTime: all.time,
        caffeine: all.caffeine,
        sunlightAccess: all.sunlight === 'yes',
        healthEnabled: all.healthEnabled ?? false,
        archetypeEnabled: all.archetypeEnabled ?? false,
        birthData: all.birthData ?? null,
      },
      settings: {
        notificationsEnabled: false,
        morningNotificationTime: '06:30',
        eveningNotificationTime: '21:00',
        weeklyReviewDay: 'sunday',
      },
    };

    const cycle = {
      id: uid(),
      intention: intention ?? '',
      startDate: new Date().toISOString(),
      phase: 'dormancy',
      phaseHistory: [{ phase: 'dormancy', enteredAt: new Date().toISOString() }],
      dominantColor: '#4a7c8a',
      ecloseAcknowledged: false,
    };

    const firstMood = all.firstMood
      ? {
          id: uid(),
          timestamp: new Date().toISOString(),
          mood: all.firstMood,
          source: 'check-in',
        }
      : null;

    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: { profile, cycle, rituals: all.rituals ?? [], firstMood },
    });
  };

  /*  Screen index mapping:
   *  0  Welcome
   *  1  Name
   *  2  "What brought you here?"
   *  3  "Where does your energy go?"
   *  4  "What matters most?"
   *  5  First mood capture
   *  6  The 21 Days story moment
   *  7  Privacy promise
   *  8  Apple Health permission
   *  9  Archetype opt-in
   * 10  Birth data (conditional — skipped if archetype declined)
   * 11  Ritual setup
   * 12  Intention
   */
  const handleArchetypeOptIn = (enabled) => {
    if (enabled) {
      next({ archetypeEnabled: true });
      // step advances to 10 (BirthDataScreen)
    } else {
      // skip birth data screen, go straight to ritual setup
      setAnswers((a) => ({ ...a, archetypeEnabled: false }));
      setStep(11);
    }
  };

  const handleBirthData = (data) => {
    setAnswers((a) => ({ ...a, birthData: data }));
    setStep(11);
  };

  const screens = [
    /* 0  */ <WelcomeScreen key="welcome" onContinue={() => setStep(1)} />,
    /* 1  */ <NameScreen key="name" onSubmit={(name) => next({ name })} />,
    /* 2  */ <QuestionScreen
      key="motivation"
      title="What brought you here?"
      subtitle="There are no wrong answers."
      options={[
        { value: 'stuck', label: 'I feel stuck' },
        { value: 'grow', label: 'I want to grow' },
        { value: 'searching', label: 'I\u2019m searching for something' },
        { value: 'hurting', label: 'I\u2019m hurting' },
      ]}
      onSubmit={(v) => next({ motivation: v })}
    />,
    /* 3  */ <QuestionScreen
      key="energy"
      title="Where does your energy go?"
      subtitle="Most of it. Be honest."
      options={[
        { value: 'others', label: 'Into others' },
        { value: 'work', label: 'Into work' },
        { value: 'surviving', label: 'Into surviving' },
        { value: 'unknown', label: 'I don\u2019t know anymore' },
      ]}
      onSubmit={(v) => next({ energy: v })}
    />,
    /* 4  */ <QuestionScreen
      key="priorities"
      title="What matters to you right now?"
      subtitle="Pick up to two."
      multi
      maxSelect={2}
      options={[
        { value: 'creative', label: 'Creative expression' },
        { value: 'peace', label: 'Inner peace' },
        { value: 'discipline', label: 'Discipline & structure' },
        { value: 'connection', label: 'Connection with others' },
        { value: 'self', label: 'Understanding myself' },
      ]}
      onSubmit={(v) => next({ priorities: v })}
    />,
    /* 5  */ <MoodSelectScreen key="firstMood" onSubmit={(mood) => next({ firstMood: mood })} />,
    /* 6  */ <TwentyOneDaysScreen key="twentyOne" onContinue={() => setStep(7)} />,
    /* 7  */ <PrivacyScreen key="privacy" onContinue={() => setStep(8)} />,
    /* 8  */ <HealthScreen
      key="health"
      onSubmit={(enabled) => next({ healthEnabled: enabled })}
    />,
    /* 9  */ <ArchetypeOptInScreen key="archetype" onSubmit={handleArchetypeOptIn} />,
    /* 10 */ <BirthDataScreen key="birthData" onSubmit={handleBirthData} />,
    /* 11 */ <RitualSetupScreen key="ritualSetup" onSubmit={finishRituals} />,
    /* 12 */ <IntentionScreen key="intention" onSubmit={finishAll} />,
  ];

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {screens[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
