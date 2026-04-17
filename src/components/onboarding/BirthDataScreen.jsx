import { useState } from 'react';

export default function BirthDataScreen({ onSubmit }) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [computing, setComputing] = useState(false);

  const canCompute = birthDate.length > 0;

  const compute = async () => {
    setComputing(true);
    // brief pause for dramatic effect
    await new Promise((r) => setTimeout(r, 2200));
    setComputing(false);
    setShowResult(true);
  };

  if (computing) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <div
          className="h-16 w-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--cocoon-glow) 0%, transparent 70%)',
            animation: 'cocoon-breathe 2s ease-in-out infinite',
          }}
        />
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          computing your archetypes
        </p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex h-full flex-col justify-center px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          your birth signature
        </p>
        <p className="mt-6 font-display italic text-cocoon-light text-[20px] leading-relaxed">
          Cocoon will weave these patterns into your reflections when they resonate.
        </p>
        <p className="mt-4 font-body text-[14px] text-cocoon-ash leading-relaxed">
          This is not prediction. It's recognition.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() =>
              onSubmit({ birthDate, birthTime: birthTime || null })
            }
            className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
          >
            This feels right
          </button>
          <button
            type="button"
            onClick={() => onSubmit(null)}
            className="font-body text-[13px] text-cocoon-ash"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center px-8">
      <h1 className="font-display text-cocoon-light text-[24px] leading-snug">
        When were you born?
      </h1>
      <p className="mt-2 font-body text-[14px] text-cocoon-ash">
        For your archetypal profile.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-cocoon-ash">
            date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-2 w-full border-b border-cocoon-mist bg-transparent pb-2 font-display text-[20px] text-cocoon-light focus:border-cocoon-ash focus:outline-none"
            style={{ colorScheme: 'dark' }}
          />
          <p className="mt-1 font-body text-[11px] text-cocoon-ash/60">
            your core archetypes
          </p>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-cocoon-ash">
            time <span className="text-cocoon-ash/50">(optional)</span>
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="mt-2 w-full border-b border-cocoon-mist bg-transparent pb-2 font-display text-[20px] text-cocoon-light focus:border-cocoon-ash focus:outline-none"
            style={{ colorScheme: 'dark' }}
          />
          <p className="mt-1 font-body text-[11px] text-cocoon-ash/60">
            your emerging self — unlocks rising sign
          </p>
        </div>
      </div>

      {canCompute && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={compute}
            className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
          >
            Calculate my profile
          </button>
        </div>
      )}
    </div>
  );
}
