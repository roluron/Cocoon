import { motion } from 'framer-motion';

export default function MoodOption({ mood, selected, dimmed, onSelect, size = 80 }) {
  const animate = selected
    ? { scale: [1, 1.1, 1], opacity: 1 }
    : { scale: 1, opacity: dimmed ? 0.3 : 1 };

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(mood.id)}
      animate={animate}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex shrink-0 flex-col items-center gap-2"
      aria-pressed={selected}
      aria-label={mood.label}
    >
      <span
        className="block rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, ${mood.color}cc, ${mood.color}55 55%, ${mood.color}10 80%)`,
          boxShadow: selected
            ? `0 0 32px ${mood.color}80, inset 0 0 24px ${mood.color}66`
            : `0 4px 16px ${mood.color}22, inset 0 0 12px ${mood.color}33`,
          border: `1px solid ${mood.color}40`,
        }}
      />
      <span
        className="font-body text-xs tracking-wide"
        style={{ color: selected ? 'var(--cocoon-light)' : 'var(--cocoon-ash)' }}
      >
        {mood.label}
      </span>
    </motion.button>
  );
}
