import { useState } from 'react';

export default function NameScreen({ onSubmit }) {
  const [name, setName] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="flex h-full flex-col justify-center px-8">
      <h1 className="font-display text-cocoon-light text-[28px] leading-snug">
        What should we call you?
      </h1>
      <p className="mt-3 font-body text-sm text-cocoon-ash">
        Your first name, or whatever feels right.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value.slice(0, 30));
          if (e.target.value.trim().length >= 1 && !showPrivacy) {
            setTimeout(() => setShowPrivacy(true), 600);
          }
        }}
        autoFocus
        maxLength={30}
        className="mt-8 w-full border-b border-cocoon-mist bg-transparent pb-3 text-center font-display text-[28px] text-cocoon-light placeholder:text-cocoon-ash/40 focus:border-cocoon-ash focus:outline-none"
        placeholder="—"
      />
      {showPrivacy && (
        <p className="mt-6 font-body text-[12px] italic text-cocoon-ash leading-relaxed opacity-0 animate-[cocoon-sheet-fade_1s_ease-out_forwards]">
          Your name, and everything you write here, is encrypted with a key only your device holds.
          Even we can't read your journal.
        </p>
      )}
      {name.trim().length >= 1 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => onSubmit(name.trim())}
            className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
