import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { selectPrompt, dayInCycle } from '../../utils/promptArc.js';
import { MOOD_VALENCE } from '../../utils/moodAlgorithm.js';
import { today } from '../../utils/storage.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const MAX = 500;

export default function GuidedReflection({ autoFocus }) {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const [response, setResponse] = useState('');
  const [done, setDone] = useState(false);

  const day = useMemo(() => dayInCycle(state.cycle), [state.cycle]);

  const completionRate = useMemo(() => {
    if (!state.rituals.length) return 0;
    const date = today();
    const todays = state.ritualCompletions.filter((c) => c.date === date);
    return todays.length / state.rituals.length;
  }, [state.rituals, state.ritualCompletions]);

  const prompt = useMemo(
    () =>
      selectPrompt({
        cycle: state.cycle,
        moods: state.moods,
        journal: state.journal,
        ritualCompletionRate: completionRate,
        day,
      }),
    [state.cycle, state.moods, state.journal, completionRate, day],
  );

  const submit = (e) => {
    e.preventDefault();
    const trimmed = response.trim();
    if (!trimmed) return;
    const lastMood = state.moods[state.moods.length - 1]?.mood ?? 'serene';
    dispatch({
      type: 'ADD_JOURNAL',
      payload: {
        id: uid(),
        date: today(),
        guidedReflection: {
          prompt: prompt.prompt,
          promptPhase: prompt.promptPhase,
          response: trimmed,
        },
        moodAtTime: lastMood,
        isResurfaceable: (MOOD_VALENCE[lastMood] ?? 0) > 0.3,
      },
    });
    setDone(true);
  };

  if (done) return null;

  return (
    <form onSubmit={submit} className="mt-10 px-6">
      <div className="flex items-baseline justify-between">
        <span
          className="font-display italic text-cocoon-pearl/70 text-[15px]"
          aria-hidden="true"
        >
          ✦
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          guided reflection
        </span>
      </div>

      <p
        className="mt-5 font-display italic text-cocoon-light leading-[1.25]"
        style={{ fontSize: 'clamp(20px, 5.5vw, 26px)' }}
      >
        {prompt.prompt}
      </p>

      <textarea
        autoFocus={autoFocus}
        value={response}
        onChange={(e) => setResponse(e.target.value.slice(0, MAX))}
        rows={4}
        className="mt-6 w-full border-b bg-transparent pb-3 font-body text-[15px] text-cocoon-pearl leading-relaxed placeholder:text-cocoon-ash/40 focus:outline-none"
        style={{
          borderColor: response.trim() ? glow : 'var(--cocoon-mist)',
          transition: 'border-color 600ms',
        }}
        placeholder="…"
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60 tabular-nums">
          {response.length}/{MAX}
        </span>
        <button
          type="submit"
          disabled={!response.trim()}
          className="font-display italic text-[15px] text-cocoon-light transition disabled:opacity-30"
        >
          reflect →
        </button>
      </div>
    </form>
  );
}
