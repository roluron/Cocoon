import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { selectPrompt } from '../../utils/promptArc.js';
import { dayInCycle } from '../../utils/promptArc.js';
import { MOOD_VALENCE } from '../../utils/moodAlgorithm.js';
import GlowButton from '../shared/GlowButton.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const MAX = 500;

export default function GuidedReflection({ autoFocus }) {
  const { state, dispatch } = useApp();
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
    [state.cycle, state.moods, state.journal, completionRate, day]
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
    <form
      onSubmit={submit}
      className="mx-5 mt-4 rounded-card border border-cocoon-mist/50 bg-cocoon-deep/60 px-5 py-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
        Guided reflection
      </p>
      <p className="mt-3 font-display text-cocoon-light text-lg leading-relaxed">{prompt.prompt}</p>
      <textarea
        autoFocus={autoFocus}
        value={response}
        onChange={(e) => setResponse(e.target.value.slice(0, MAX))}
        rows={5}
        className="mt-4 w-full font-body text-[15px] text-cocoon-pearl leading-relaxed placeholder:text-cocoon-ash/50 focus:outline-none"
        placeholder="\u2026"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-cocoon-ash">
          {response.length}/{MAX}
        </span>
        <GlowButton onClick={submit} disabled={!response.trim()}>
          Reflect
        </GlowButton>
      </div>
    </form>
  );
}
