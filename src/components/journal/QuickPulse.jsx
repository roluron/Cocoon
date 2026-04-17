import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { MOOD_VALENCE } from '../../utils/moodAlgorithm.js';
import { today } from '../../utils/storage.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function QuickPulse() {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
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
      <div className="mt-8 px-6">
        <p className="font-display italic text-[15px] text-cocoon-ash/80">noted.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
        one word for today
      </p>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        autoFocus={false}
        maxLength={40}
        className="mt-4 w-full border-b pb-3 font-display italic text-cocoon-light placeholder:text-cocoon-ash/40 focus:outline-none"
        style={{
          fontSize: 'clamp(28px, 8vw, 36px)',
          borderColor: word.trim() ? glow : 'var(--cocoon-mist)',
          transition: 'border-color 600ms',
        }}
        placeholder="—"
      />
    </form>
  );
}
