import { motion } from 'framer-motion';
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
import { today } from '../../utils/storage.js';

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

const pad2 = (n) => String(n).padStart(2, '0');

export default function TodayRituals() {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const date = today();

  const rituals = state.rituals ?? [];
  if (!rituals.length) return null;

  const items = rituals.slice(0, 5);
  const isDone = (ritualId) =>
    state.ritualCompletions.some((c) => c.ritualId === ritualId && c.date === date);

  return (
    <section className="relative mt-4 px-6" aria-label="Rituals for today">
      {/* hairline top rule that fades in from the left */}
      <div
        className="mb-5 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
        }}
      />

      <div className="flex items-baseline justify-between">
        <span
          className="font-display italic text-cocoon-pearl/70 text-[15px]"
          aria-hidden="true"
        >
          ✦
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          rituals
        </span>
      </div>

      <ul className="mt-4 flex flex-col">
        {items.map((r, i) => {
          const Icon = ICONS[r.icon] ?? Circle;
          const done = isDone(r.id);
          return (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08 }}
            >
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_RITUAL', payload: { ritualId: r.id, date } })}
                className="group flex w-full items-center gap-4 py-3 text-left"
                aria-pressed={done}
              >
                <span
                  className="font-mono text-[10px] text-cocoon-ash/60 tabular-nums"
                  aria-hidden="true"
                >
                  {pad2(i + 1)}
                </span>
                <Icon
                  size={15}
                  strokeWidth={1.25}
                  color={done ? glow : 'var(--cocoon-ash)'}
                  style={{ opacity: done ? 1 : 0.7 }}
                />
                <span
                  className="flex-1 font-display italic text-[18px] leading-tight transition"
                  style={{
                    color: done ? 'var(--cocoon-light)' : 'var(--cocoon-pearl)',
                    textDecoration: done ? 'none' : 'none',
                    opacity: done ? 1 : 0.88,
                  }}
                >
                  {r.title.toLowerCase()}
                </span>
                <span
                  className="relative flex h-2 w-2 items-center justify-center"
                  aria-hidden="true"
                >
                  {done ? (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: glow,
                        boxShadow: `0 0 10px ${glow}aa`,
                      }}
                    />
                  ) : (
                    <span
                      className="h-[7px] w-[7px] rounded-full border"
                      style={{ borderColor: 'var(--cocoon-ash)', opacity: 0.55 }}
                    />
                  )}
                </span>
              </button>
              {i < items.length - 1 && (
                <div
                  className="ml-[44px] h-px opacity-40"
                  style={{ background: 'var(--cocoon-mist)' }}
                />
              )}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
