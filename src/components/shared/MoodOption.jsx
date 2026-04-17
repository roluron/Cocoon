/**
 * MoodOption — editorial redesign
 *
 * Each mood is a flush-left text button with a colored dot,
 * not a glowing orb. Quieter. More literary. Less gamified.
 * The color still communicates — it just whispers instead of shouts.
 */

export default function MoodOption({ mood, selected, dimmed, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(mood.id)}
      className="group flex items-center gap-3 py-2 transition-all"
      style={{
        opacity: dimmed ? 0.25 : 1,
        transform: selected ? 'translateX(4px)' : 'none',
        transition: 'opacity 0.5s, transform 0.4s',
      }}
      aria-pressed={selected}
      aria-label={mood.label}
    >
      <span
        className="h-3 w-3 rounded-full transition-all"
        style={{
          background: selected
            ? mood.color
            : `${mood.color}88`,
          boxShadow: selected
            ? `0 0 16px ${mood.color}88`
            : 'none',
          transform: selected ? 'scale(1.3)' : 'scale(1)',
          transition: 'all 0.5s ease',
        }}
      />
      <span
        className="font-display italic text-[20px] transition-colors"
        style={{
          color: selected
            ? 'var(--cocoon-light)'
            : dimmed
              ? 'var(--cocoon-ash)'
              : 'var(--cocoon-pearl)',
        }}
      >
        {mood.label}
      </span>
    </button>
  );
}
