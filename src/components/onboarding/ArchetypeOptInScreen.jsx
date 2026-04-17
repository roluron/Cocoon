export default function ArchetypeOptInScreen({ onSubmit }) {
  return (
    <div className="flex h-full flex-col justify-center px-8">
      <h1 className="font-display text-cocoon-light text-[24px] leading-snug">
        An optional layer.
      </h1>

      <p className="mt-6 font-body text-[15px] text-cocoon-pearl leading-relaxed">
        For thousands of years, humans have used symbolic systems to understand themselves.
        Astrology. Chinese zodiac. Numerology. Not as prediction. As pattern language.
        As a vocabulary for things science hasn't named yet.
      </p>
      <p className="mt-4 font-body text-[15px] text-cocoon-pearl leading-relaxed">
        If you want, Cocoon can weave these into your reflections.
        Not to tell you who you are. To offer another mirror.
      </p>
      <p className="mt-4 font-body text-[14px] italic text-cocoon-ash leading-relaxed">
        Jung himself used astrology this way: not as fate, but as archetypal recognition.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => onSubmit(true)}
          className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
        >
          Yes, include this layer
        </button>
        <button
          type="button"
          onClick={() => onSubmit(false)}
          className="font-body text-[13px] text-cocoon-ash"
        >
          Keep it simple
        </button>
      </div>
    </div>
  );
}
