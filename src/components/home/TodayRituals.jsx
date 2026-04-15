import {
  Activity,
  BookOpen,
  Circle,
  Coffee,
  Compass,
  Droplet,
  Feather,
  Heart,
  Moon,
  MoonStar,
  Snowflake,
  Sun,
  Sunrise,
  Waves,
  Wind,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const ICONS = {
  Activity,
  BookOpen,
  Circle,
  Coffee,
  Compass,
  Droplet,
  Feather,
  Heart,
  Moon,
  MoonStar,
  Snowflake,
  Sun,
  Sunrise,
  Waves,
  Wind,
};

const today = () => new Date().toISOString().slice(0, 10);

export default function TodayRituals() {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const date = today();

  const rituals = state.rituals ?? [];
  if (!rituals.length) return null;

  const isDone = (ritualId) =>
    state.ritualCompletions.some((c) => c.ritualId === ritualId && c.date === date);

  return (
    <section className="mt-6 px-5">
      <h3 className="font-body text-sm font-semibold tracking-wide text-cocoon-pearl">Today</h3>
      <div className="mt-3 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
        {rituals.slice(0, 8).map((r) => {
          const Icon = ICONS[r.icon] ?? Circle;
          const done = isDone(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_RITUAL', payload: { ritualId: r.id, date } })}
              className="relative flex w-[120px] shrink-0 flex-col items-start justify-between rounded-card border bg-cocoon-deep/60 px-3 py-3 text-left"
              style={{
                borderColor: done ? glow : 'var(--cocoon-mist)',
                boxShadow: done ? `0 6px 24px ${glow}26` : 'none',
                height: 88,
              }}
              aria-pressed={done}
            >
              <Icon size={18} strokeWidth={1.5} color={done ? glow : 'var(--cocoon-ash)'} />
              <span className="font-body text-[13px] text-cocoon-pearl leading-tight">
                {r.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
