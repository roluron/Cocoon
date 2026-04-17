import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  MOOD_VALENCE,
  moodColor,
  moodLabel,
  computeDirection,
  dominantMood,
} from '../../utils/moodAlgorithm.js';

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DIRECTION_LINES = {
  ascending: 'You\'re moving toward something.',
  descending: 'Even descent has its wisdom.',
  still: 'Stillness is not stagnation.',
};

function isoDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(isoDateStr(d));
  }
  return days;
}

function formatDateRange(days) {
  const first = new Date(days[0] + 'T12:00:00');
  const last = new Date(days[days.length - 1] + 'T12:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startStr = `${months[first.getMonth()]} ${first.getDate()}`;
  const endStr = `${months[last.getMonth()]} ${last.getDate()}`;
  return `${startStr} — ${endStr}`;
}

function getDayAbbr(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return DAY_ABBR[d.getDay()];
}

const PHASE_LABELS = {
  dormancy: 'Dormancy',
  stirring: 'Stirring',
  unraveling: 'Unraveling',
  reforming: 'Reforming',
  emergence: 'Emergence',
};

// Custom dot for the chart
function CustomDot({ cx, cy, payload, color }) {
  if (payload.valence == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill={color}
      stroke="var(--cocoon-deep)"
      strokeWidth={1.5}
      opacity={0.9}
    />
  );
}

// Minimal tooltip
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d?.moodId) return null;
  return (
    <div
      style={{
        background: 'var(--cocoon-surface)',
        border: '1px solid var(--cocoon-mist)',
        padding: '6px 10px',
        borderRadius: 4,
      }}
    >
      <span
        className="font-display italic text-[13px]"
        style={{ color: moodColor(d.moodId) }}
      >
        {moodLabel(d.moodId).toLowerCase()}
      </span>
    </div>
  );
}

export default function WeeklySummary({ open, onClose }) {
  const { state } = useApp();
  const { glow } = useTheme();

  const days = useMemo(() => last7Days(), []);
  const dateRange = useMemo(() => formatDateRange(days), [days]);

  // Filter data to the past 7 days
  const cutoff = days[0];

  const weekMoods = useMemo(
    () => state.moods.filter((m) => m.date >= cutoff),
    [state.moods, cutoff],
  );

  const weekJournal = useMemo(
    () => state.journal.filter((j) => (j.date ?? j.createdAt?.slice(0, 10)) >= cutoff),
    [state.journal, cutoff],
  );

  const weekRituals = useMemo(
    () => state.ritualCompletions.filter((c) => c.date >= cutoff),
    [state.ritualCompletions, cutoff],
  );

  // Build chart data: one point per day, using the last mood of that day
  const chartData = useMemo(() => {
    return days.map((dateStr) => {
      const moodsOnDay = state.moods.filter((m) => m.date === dateStr);
      const last = moodsOnDay[moodsOnDay.length - 1];
      const valence = last ? ((MOOD_VALENCE[last.mood] ?? 0) + 1) / 2 : null;
      return {
        day: getDayAbbr(dateStr),
        valence,
        moodId: last?.mood ?? null,
      };
    });
  }, [days, state.moods]);

  const dominant = useMemo(() => dominantMood(weekMoods), [weekMoods]);
  const dominantColor = dominant ? moodColor(dominant) : glow;
  const direction = useMemo(() => computeDirection(weekMoods), [weekMoods]);
  const closingLine = DIRECTION_LINES[direction];

  const phase = state.cycle?.phase ?? null;
  const phaseLabel = phase ? PHASE_LABELS[phase] : null;

  // Compute day in current phase from phaseHistory or cycle startDate
  const cycleDay = useMemo(() => {
    if (!state.cycle) return null;
    const history = state.cycle.phaseHistory ?? [];
    const lastEntry = history[history.length - 1];
    const phaseStartIso = lastEntry?.enteredAt ?? state.cycle.startDate;
    if (!phaseStartIso) return null;
    const ms = Date.now() - new Date(phaseStartIso).getTime();
    return Math.max(1, Math.floor(ms / 86400000) + 1);
  }, [state.cycle]);

  // Gradient id — unique per render to avoid SVG conflicts
  const gradientId = 'weekly-mood-gradient';

  if (!open) return null;

  const overlay = (
    <div
      className="fixed inset-0 z-50 flex flex-col sheet-fade"
      style={{ background: 'var(--cocoon-void)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Weekly summary"
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-10 pb-0">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
              your week
            </span>
            <h1
              className="mt-2 font-display italic text-cocoon-light leading-[0.95]"
              style={{ fontSize: 'clamp(40px, 12vw, 58px)', letterSpacing: '-0.01em' }}
            >
              {dateRange}
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close weekly summary"
            className="mt-2 font-display italic text-[16px] text-cocoon-pearl/60 hover:text-cocoon-light transition"
          >
            done
          </button>
        </div>

        {/* Hairline */}
        <div
          className="mt-8 mx-6 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
            opacity: 0.6,
          }}
        />

        {/* Mood Wave */}
        <div className="mt-8 px-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            mood arc
          </span>
          <div className="mt-4" style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={glow} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={glow} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: 9,
                    fill: 'var(--cocoon-ash)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                  interval={0}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: 'var(--cocoon-mist)', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area
                  type="monotone"
                  dataKey="valence"
                  stroke={glow}
                  strokeWidth={1.5}
                  fill={`url(#${gradientId})`}
                  dot={<CustomDot color={glow} />}
                  activeDot={{ r: 4, fill: glow, stroke: 'var(--cocoon-deep)', strokeWidth: 2 }}
                  connectNulls={false}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hairline */}
        <div
          className="mt-8 mx-6 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
            opacity: 0.6,
          }}
        />

        {/* Stats row */}
        <div className="mt-8 px-6 flex items-start justify-between">
          {[
            { count: weekMoods.length, label: 'check-ins' },
            { count: weekJournal.length, label: 'journal entries' },
            { count: weekRituals.length, label: 'rituals done' },
          ].map(({ count, label }) => (
            <div key={label} className="flex flex-col items-start">
              <span
                className="font-mono tabular-nums text-cocoon-light"
                style={{ fontSize: 'clamp(28px, 8vw, 40px)', letterSpacing: '-0.02em' }}
              >
                {String(count).padStart(2, '0')}
              </span>
              <span className="mt-1 font-display italic text-[12px] text-cocoon-ash/90 leading-snug max-w-[70px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Hairline */}
        <div
          className="mt-8 mx-6 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
            opacity: 0.6,
          }}
        />

        {/* Dominant mood */}
        <div className="mt-8 px-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            this week you felt most
          </span>
          {dominant ? (
            <div className="mt-3 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{
                  background: dominantColor,
                  boxShadow: `0 0 8px ${dominantColor}88`,
                }}
              />
              <span
                className="font-display italic leading-tight"
                style={{
                  fontSize: 'clamp(30px, 9vw, 46px)',
                  color: dominantColor,
                  letterSpacing: '-0.01em',
                }}
              >
                {moodLabel(dominant).toLowerCase()}
              </span>
            </div>
          ) : (
            <p className="mt-3 font-display italic text-[22px] text-cocoon-ash/70">
              no check-ins yet.
            </p>
          )}
        </div>

        {/* Phase progression — only show if cycle exists */}
        {phaseLabel && (
          <>
            {/* Hairline */}
            <div
              className="mt-8 mx-6 h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
                opacity: 0.6,
              }}
            />

            <div className="mt-8 px-6 flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
                  your phase
                </span>
                <span
                  className="mt-2 font-display italic text-cocoon-light"
                  style={{ fontSize: 'clamp(26px, 7.5vw, 36px)', letterSpacing: '-0.01em' }}
                >
                  {phaseLabel.toLowerCase()}
                </span>
              </div>
              {cycleDay != null && (
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash tabular-nums">
                  day {cycleDay}
                </span>
              )}
            </div>
          </>
        )}

        {/* Hairline */}
        <div
          className="mt-8 mx-6 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, var(--cocoon-mist) 20%, var(--cocoon-mist) 80%, transparent)',
            opacity: 0.6,
          }}
        />

        {/* Closing line */}
        <div className="mt-8 px-6 pb-4">
          <div
            className="mb-4 h-px w-8 opacity-40"
            style={{
              background: `linear-gradient(to right, ${glow}, transparent)`,
            }}
          />
          <p
            className="font-display italic text-cocoon-pearl/80 leading-snug"
            style={{ fontSize: 'clamp(18px, 5.5vw, 24px)' }}
          >
            {closingLine}
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.getElementById('root') ?? document.body);
}
