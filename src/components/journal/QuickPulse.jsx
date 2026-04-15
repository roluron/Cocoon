import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { MOOD_VALENCE } from '../../utils/moodAlgorithm.js';

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function QuickPulse() {
  const { state, dispatch } = useApp();
  const [word, setWord] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const date = today();
  const existing = state.journal.find((e) => e.date === date && e.quickPulse);
  if (existing && !submitted) return null;

  const submit = (e) => {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;
    const lastMood = state.moods[state.moods.length - 1]?.mood ?? 'serene';
    dispatch({
      type: 'ADD_JOURNAL',
      payload: {
        id: uid(),
        date,
        quickPulse: trimmed,
        moodAtTime: lastMood,
        isResurfaceable: (MOOD_VALENCE[lastMood] ?? 0) > 0.3,
      },
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.7 }}
        className="mx-5 mt-4 rounded-card border border-cocoon-mist/50 bg-cocoon-deep/60 px-5 py-4"
      >
        <p className="font-body text-sm text-cocoon-ash">Noted.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-5 mt-4 rounded-card border border-cocoon-mist/50 bg-cocoon-deep/60 px-5 py-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
        One word for today
      </p>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        autoFocus={false}
        maxLength={40}
        className="mt-3 w-full text-center font-display text-3xl text-cocoon-light placeholder:text-cocoon-ash/50 focus:outline-none"
        placeholder="\u2014"
      />
    </form>
  );
}
