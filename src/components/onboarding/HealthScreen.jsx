export default function HealthScreen({ onSubmit }) {
  return (
    <div className="flex h-full flex-col justify-center px-8">
      <h1 className="font-display text-cocoon-light text-[24px] leading-snug">
        Your body tells the truth.
      </h1>
      <p className="mt-1 font-body text-[14px] text-cocoon-ash">
        Before your mind does.
      </p>

      <p className="mt-8 font-body text-[15px] text-cocoon-pearl leading-relaxed">
        Cocoon can listen to your body alongside your mind. With your permission,
        it reads four signals from Apple Health: your sleep, your heart rate variability,
        your movement, and your mindfulness minutes.
      </p>
      <p className="mt-4 font-body text-[15px] text-cocoon-pearl leading-relaxed">
        When you feel heavy, Cocoon might notice you slept four hours.
        When you feel light, it might notice you moved your body.
      </p>
      <p className="mt-4 font-body text-[13px] italic text-cocoon-ash leading-relaxed">
        Your data never leaves your device. Ever.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => onSubmit(true)}
          className="rounded-full border border-cocoon-mist/80 px-10 py-3 font-body text-sm text-cocoon-pearl hover:border-cocoon-pearl transition"
        >
          Allow Apple Health
        </button>
        <button
          type="button"
          onClick={() => onSubmit(false)}
          className="font-body text-[13px] text-cocoon-ash"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
