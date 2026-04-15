import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen.jsx';
import QuestionScreen from './QuestionScreen.jsx';
import MoodSelectScreen from './MoodSelectScreen.jsx';
import TwentyOneDaysScreen from './TwentyOneDaysScreen.jsx';
import RitualSetupScreen from './RitualSetupScreen.jsx';
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

  const finish = ({ time, caffeine, sunlight, rituals }) => {
    const all = { ...answers, time, caffeine, sunlight };
    const profile = {
      id: uid(),
      createdAt: new Date().toISOString(),
      onboarding: {
        motivation: all.motivation,
        energyDirection: all.energy,
        priorities: all.priorities ?? [],
        morningTime: time,
        caffeine,
        sunlightAccess: sunlight === 'yes',
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
      intention: '',
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
      payload: { profile, cycle, rituals, firstMood },
    });
  };

  const screens = [
    <WelcomeScreen key="welcome" onContinue={() => setStep(1)} />,
    <QuestionScreen
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
    <QuestionScreen
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
    <QuestionScreen
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
    <MoodSelectScreen key="firstMood" onSubmit={(mood) => next({ firstMood: mood })} />,
    <TwentyOneDaysScreen key="twentyOne" onContinue={() => setStep(6)} />,
    <RitualSetupScreen key="ritualSetup" onSubmit={finish} />,
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
