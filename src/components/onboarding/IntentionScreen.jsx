import { useEffect, useState } from 'react';

const EXAMPLES = [
  '...build a morning practice',
  '...sit with my grief',
  '...find creative flow',
  '...understand myself better',
  '...stop running from what I feel',
];

export default function IntentionScreen({ onSubmit }) {
  const [intention, setIntention] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  const typing = intention.length > 0;

  useEffect(() => {
    if (typing) return;
    const t = setInterval(
      () => setExampleIdx((i) => (i + 1) % EXAMPLES.length),
      3000,
    );
    return () => clearInterval(t);
  }, [typing]);

  return (
    <div className="flex h-full flex-col justify-center px-8 text-center">
      <h1 className="font-display text-cocoon-light text-[24px] leading-snug">
        What is this cycle about for you?
      </h1>
      <p className="mt-3 font-body text-[14px] text-cocoon-ash">
        In one sentence. There's no wrong answer.
      </p>

      <input
        type="text"
        value={intention}
        onChange={(e) => setIntention(e.target.value.slice(0, 100))}
        autoFocus
        maxLength={100}
        className="mt-10 w-full border-b border-cocoon-mist bg-transparent pb-3 text-center font-display text-[22px] text-cocoon-light placeholder:text-cocoon-ash/40 focus:border-cocoon-ash focus:outline-none"
        placeholder="I want to..."
      />

      {!typing && (
        <p
          key={exampleIdx}
          className="mt-4 font-body text-[13px] text-cocoon-ash opacity-0"
          style={{ animation: 'cocoon-sheet-fade 0.8s ease-out forwards' }}
        >
          {EXAMPLES[exampleIdx]}
        </p>
      )}

      {intention.trim().length >= 5 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => onSubmit(intention.trim())}
            className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
          >
            Begin your cycle
          </button>
        </div>
      )}
    </div>
  );
}
