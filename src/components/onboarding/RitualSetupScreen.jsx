import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import GlowButton from '../shared/GlowButton.jsx';
import ritualPool from '../../data/rituals.json';

const TIME_OPTIONS = [
  { value: '15min', label: '15 minutes' },
  { value: '30min', label: '30 minutes' },
  { value: '60min', label: '1 hour+' },
];

const CAFFEINE = [
  { value: 'coffee', label: 'Coffee' },
  { value: 'tea', label: 'Tea' },
  { value: 'neither', label: 'Neither' },
];

const SUNLIGHT = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'Not easily' },
];

function suggestRituals({ time, caffeine, sunlight }) {
  const morning = [...ritualPool.morning];
  const ids = new Set();
  ids.add('hydrate');
  ids.add('breathwork');
  ids.add('intention');
  if (sunlight === 'yes') ids.add('sunlight');
  if (caffeine !== 'neither') ids.add('delay-caffeine');
  if (time === '30min' || time === '60min') ids.add('movement');
  if (time === '60min') {
    ids.add('morning-journal');
    ids.add('cold-exposure');
  }
  return morning
    .filter((r) => ids.has(r.id))
    .map((r, i) => ({ ...r, timeOfDay: 'morning', isCustom: false, order: i }));
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map(({ value: v, label }) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="flex-1 rounded-card border px-3 py-3 text-sm transition-colors"
            style={{
              borderColor: active ? 'var(--cocoon-glow)' : 'var(--cocoon-mist)',
              color: active ? 'var(--cocoon-light)' : 'var(--cocoon-pearl)',
              background: active ? 'rgb(var(--cocoon-glow-rgb) / 0.08)' : 'var(--cocoon-deep)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
        {label}
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function RitualSetupScreen({ onSubmit }) {
  const [time, setTime] = useState('15min');
  const [caffeine, setCaffeine] = useState('coffee');
  const [sunlight, setSunlight] = useState('yes');

  const suggested = useMemo(
    () => suggestRituals({ time, caffeine, sunlight }),
    [time, caffeine, sunlight]
  );

  return (
    <div className="flex h-full flex-col px-6 pt-12 pb-10">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-display text-cocoon-light text-[26px] leading-snug"
      >
        Let&rsquo;s shape your morning.
      </motion.h1>

      <div className="mt-8 space-y-6">
        <Field label="How much time do you have?">
          <Segmented options={TIME_OPTIONS} value={time} onChange={setTime} />
        </Field>
        <Field label="Coffee or tea?">
          <Segmented options={CAFFEINE} value={caffeine} onChange={setCaffeine} />
        </Field>
        <Field label="Sunlight in the morning?">
          <Segmented options={SUNLIGHT} value={sunlight} onChange={setSunlight} />
        </Field>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
          Suggested ritual
        </p>
        <ul className="mt-3 max-h-44 overflow-y-auto rounded-card border border-cocoon-mist/60 bg-cocoon-deep/60 px-4 py-3">
          {suggested.map((r) => (
            <li key={r.id} className="flex items-baseline gap-3 py-1.5">
              <span className="font-body text-[15px] text-cocoon-pearl">{r.title}</span>
              <span className="font-body text-xs text-cocoon-ash">{r.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <GlowButton onClick={() => onSubmit({ time, caffeine, sunlight, rituals: suggested })}>
          This feels right
        </GlowButton>
        <GlowButton variant="text" onClick={() => onSubmit({ time, caffeine, sunlight, rituals: [] })}>
          Adjust later
        </GlowButton>
      </div>
    </div>
  );
}
