import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
import ritualPool from '../../data/rituals.json';

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

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const pad2 = (n) => String(n).padStart(2, '0');

function isMorningTime(time) {
  if (!time) return true;
  const h = parseInt(time.split(':')[0], 10);
  return h < 14;
}

function slotOf(r) {
  return r.slot ?? (isMorningTime(r.suggestedTime) ? 'morning' : 'evening');
}

function computeFlowingDays(ritualCompletions) {
  if (!ritualCompletions.length) return 0;
  const dates = Array.from(new Set(ritualCompletions.map((c) => c.date))).sort().reverse();
  if (!dates.length) return 0;
  const t = new Date(today());
  let count = 0;
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(t);
    expected.setDate(t.getDate() - i);
    if (dates[i] === expected.toISOString().slice(0, 10)) count++;
    else break;
  }
  return count;
}

function morningOrEveningNow() {
  return new Date().getHours() < 14 ? 'morning' : 'evening';
}

export default function RitualsScreen() {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const [slot, setSlot] = useState(morningOrEveningNow);
  const [addOpen, setAddOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const date = today();

  const rituals = state.rituals ?? [];
  const filtered = useMemo(
    () => rituals.filter((r) => slotOf(r) === slot),
    [rituals, slot],
  );
  const flowingDays = useMemo(
    () => computeFlowingDays(state.ritualCompletions),
    [state.ritualCompletions],
  );

  const isDone = (ritualId) =>
    state.ritualCompletions.some((c) => c.ritualId === ritualId && c.date === date);

  const usedIds = new Set(rituals.map((r) => r.id));
  const availablePool = ritualPool[slot].filter((p) => !usedIds.has(p.id));

  const addFromPool = (p) => {
    dispatch({
      type: 'SET_RITUALS',
      payload: [...rituals, { ...p, slot, createdAt: new Date().toISOString() }],
    });
    setAddOpen(false);
  };

  const addCustom = () => {
    const title = customTitle.trim();
    if (!title) return;
    dispatch({
      type: 'SET_RITUALS',
      payload: [
        ...rituals,
        {
          id: uid(),
          title,
          description: '',
          icon: 'Circle',
          slot,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setCustomTitle('');
    setCustomMode(false);
    setAddOpen(false);
  };

  const removeRitual = (id) => {
    dispatch({ type: 'SET_RITUALS', payload: rituals.filter((r) => r.id !== id) });
  };

  const closeSheet = () => {
    setAddOpen(false);
    setCustomMode(false);
    setCustomTitle('');
  };

  const sheet = addOpen ? (
    <div className="fixed inset-0 z-40 flex items-end sheet-fade">
      <button
        type="button"
        aria-label="Close"
        onClick={closeSheet}
        className="absolute inset-0 bg-cocoon-void/70 backdrop-blur-sm"
      />
      <div
        className="relative w-full rounded-t-modal border-t border-cocoon-mist/60 bg-cocoon-deep/95 px-6 pb-8 pt-5 backdrop-blur-xl sheet-rise"
        style={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-cocoon-mist" />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            add to {slot}
          </span>
          <button
            type="button"
            onClick={() => setCustomMode((c) => !c)}
            className="font-display italic text-[13px] text-cocoon-pearl/75 hover:text-cocoon-light"
          >
            {customMode ? 'from pool' : 'create your own'}
          </button>
        </div>

        {customMode ? (
          <div className="mt-6">
            <label className="block font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
              name it
            </label>
            <input
              autoFocus
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="sit with the coffee"
              className="mt-2 w-full border-b border-cocoon-mist bg-transparent pb-2 font-display italic text-[22px] text-cocoon-light placeholder:text-cocoon-ash/40 focus:border-cocoon-pearl/60"
            />
            <div className="mt-6 flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => {
                  setCustomMode(false);
                  setCustomTitle('');
                }}
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={addCustom}
                disabled={!customTitle.trim()}
                className="font-display italic text-[16px] text-cocoon-light disabled:opacity-40"
              >
                add →
              </button>
            </div>
          </div>
        ) : (
          <ul className="mt-5 flex flex-col">
            {availablePool.length === 0 && (
              <li className="py-6 font-display italic text-[15px] text-cocoon-ash/70">
                you've added them all.
              </li>
            )}
            {availablePool.map((p, i) => {
              const Icon = ICONS[p.icon] ?? Circle;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => addFromPool(p)}
                    className="flex w-full items-center gap-4 py-3 text-left"
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.25}
                      className="text-cocoon-ash"
                      style={{ opacity: 0.75 }}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="font-display italic text-[18px] text-cocoon-pearl">
                        {p.title.toLowerCase()}
                      </span>
                      <span className="mt-0.5 font-body text-[12px] text-cocoon-ash/80">
                        {p.description}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cocoon-ash/60 tabular-nums">
                      {p.suggestedTime}
                    </span>
                  </button>
                  {i < availablePool.length - 1 && (
                    <div
                      className="h-px opacity-25"
                      style={{ background: 'var(--cocoon-mist)' }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="flex min-h-full flex-col pb-12">
      <header className="flex flex-col px-6 pt-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          your rhythms
        </span>
        <h1
          className="mt-1 font-display italic text-cocoon-light leading-[0.95]"
          style={{ fontSize: 'clamp(48px, 14vw, 68px)', letterSpacing: '-0.01em' }}
        >
          Rituals
        </h1>
      </header>

      <div className="mt-8 flex items-center gap-6 px-6">
        {['morning', 'evening'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlot(s)}
            className="group relative flex flex-col items-start pb-2"
          >
            <span
              className={`font-display italic text-[20px] transition ${
                slot === s ? 'text-cocoon-light' : 'text-cocoon-ash/60 hover:text-cocoon-pearl'
              }`}
            >
              {s}
            </span>
            <span
              className="absolute -bottom-px left-0 h-px transition-all"
              style={{
                width: slot === s ? '100%' : 0,
                background: `linear-gradient(to right, ${glow}, transparent)`,
              }}
            />
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70 tabular-nums">
          {filtered.length.toString().padStart(2, '0')}
        </span>
      </div>

      <div
        className="mt-4 h-px mx-6"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
        }}
      />

      <ul className="mt-3 flex flex-col px-6">
        {filtered.map((r, i) => {
          const Icon = ICONS[r.icon] ?? Circle;
          const done = isDone(r.id);
          return (
            <li key={r.id} className="group relative">
              <div className="flex items-center gap-4 py-4">
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'TOGGLE_RITUAL', payload: { ritualId: r.id, date } })
                  }
                  aria-pressed={done}
                  className="flex flex-1 items-center gap-4 text-left"
                >
                  <span className="font-mono text-[10px] text-cocoon-ash/60 tabular-nums">
                    {pad2(i + 1)}
                  </span>
                  <Icon
                    size={15}
                    strokeWidth={1.25}
                    color={done ? glow : 'var(--cocoon-ash)'}
                    style={{ opacity: done ? 1 : 0.7 }}
                  />
                  <div className="flex flex-1 flex-col">
                    <span
                      className="font-display italic text-[19px] leading-tight"
                      style={{
                        color: done ? 'var(--cocoon-light)' : 'var(--cocoon-pearl)',
                        opacity: done ? 1 : 0.9,
                      }}
                    >
                      {r.title.toLowerCase()}
                    </span>
                    {r.suggestedTime && (
                      <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60 tabular-nums">
                        {r.suggestedTime}
                      </span>
                    )}
                  </div>
                  <span
                    className="relative flex h-2 w-2 items-center justify-center"
                    aria-hidden="true"
                  >
                    {done ? (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: glow, boxShadow: `0 0 10px ${glow}aa` }}
                      />
                    ) : (
                      <span
                        className="h-[7px] w-[7px] rounded-full border"
                        style={{ borderColor: 'var(--cocoon-ash)', opacity: 0.55 }}
                      />
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeRitual(r.id)}
                  aria-label={`Remove ${r.title}`}
                  className="ml-1 opacity-40 transition hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-60 sm:hover:!opacity-100"
                >
                  <X size={13} strokeWidth={1.25} className="text-cocoon-ash" />
                </button>
              </div>
              {i < filtered.length - 1 && (
                <div
                  className="ml-[44px] h-px opacity-30"
                  style={{ background: 'var(--cocoon-mist)' }}
                />
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-8 font-display italic text-[16px] text-cocoon-ash/70">
            nothing yet. add your first.
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="mt-4 mx-6 flex items-center gap-3 py-3 text-left"
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full border"
          style={{ borderColor: 'var(--cocoon-ash)', opacity: 0.55 }}
        >
          <Plus size={12} strokeWidth={1.5} className="text-cocoon-ash" />
        </span>
        <span className="font-display italic text-[16px] text-cocoon-pearl/80">
          add a ritual
        </span>
      </button>

      <div className="mt-auto px-6 pt-10">
        <div
          className="mb-3 h-px w-10 opacity-40"
          style={{
            background: 'linear-gradient(to right, var(--cocoon-pearl), transparent)',
          }}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/80">
          {flowingDays === 0
            ? 'beginning'
            : flowingDays === 1
              ? '1 day flowing'
              : `${flowingDays} days flowing`}
        </p>
      </div>

      {sheet && createPortal(sheet, document.getElementById('root') ?? document.body)}
    </div>
  );
}
