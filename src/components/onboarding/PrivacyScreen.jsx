import { useEffect, useState } from 'react';

const LINES = [
  { text: 'Everything you write in Cocoon lives only on this device.', style: 'body' },
  { text: 'Your journal. Your moods. Your memory.', style: 'body' },
  { text: 'All of it encrypted with a key that only your face or fingerprint can unlock.', style: 'body' },
  { text: 'If someone steals your phone, they can\u2019t read it.', style: 'detail' },
  { text: 'If our servers are hacked, there\u2019s nothing to steal.', style: 'detail' },
  { text: 'If we get subpoenaed, we have nothing to hand over.', style: 'detail' },
];

export default function PrivacyScreen({ onContinue }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= LINES.length + 2) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), 1200);
    return () => clearTimeout(t);
  }, [revealed]);

  const accelerate = () => {
    if (revealed < LINES.length + 2) setRevealed(LINES.length + 2);
  };

  return (
    <div
      className="flex h-full flex-col justify-center px-8"
      onClick={accelerate}
      role="presentation"
    >
      <h1
        className="font-display text-cocoon-light text-[24px] italic leading-snug"
        style={{
          opacity: revealed >= 0 ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        Your inner life is encrypted.
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {LINES.map((line, i) => (
          <p
            key={i}
            className={
              line.style === 'detail'
                ? 'font-body text-[14px] text-cocoon-ash leading-relaxed'
                : 'font-body text-[15px] text-cocoon-pearl leading-relaxed'
            }
            style={{
              opacity: revealed > i ? 1 : 0,
              transform: `translateY(${revealed > i ? 0 : 6}px)`,
              transition: 'opacity 1s ease, transform 1s ease',
            }}
          >
            {line.text}
          </p>
        ))}
      </div>

      {revealed >= LINES.length && (
        <p
          className="mt-8 font-display text-[16px] italic text-cocoon-light leading-relaxed"
          style={{
            opacity: revealed > LINES.length ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          Your inner life stays yours. That's not a feature. That's the whole point.
        </p>
      )}

      {revealed >= LINES.length + 2 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
          >
            I understand
          </button>
        </div>
      )}
    </div>
  );
}
