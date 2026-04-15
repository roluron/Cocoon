import { motion } from 'framer-motion';
import { useState } from 'react';
import GlowButton from '../shared/GlowButton.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function QuestionScreen({
  title,
  subtitle,
  options,
  multi = false,
  maxSelect = 1,
  onSubmit,
  ctaLabel = 'Continue',
}) {
  const [selected, setSelected] = useState([]);
  const { glow } = useTheme();

  const toggle = (value) => {
    if (multi) {
      setSelected((s) =>
        s.includes(value)
          ? s.filter((v) => v !== value)
          : s.length < maxSelect
            ? [...s, value]
            : s
      );
    } else {
      setSelected([value]);
    }
  };

  const canSubmit = multi ? selected.length > 0 : selected.length === 1;

  return (
    <div className="flex h-full flex-col px-6 pt-16 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-cocoon-light text-[28px] leading-snug">{title}</h1>
        {subtitle && <p className="mt-3 font-body text-sm text-cocoon-ash">{subtitle}</p>}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
        }}
        className="mt-10 flex flex-1 flex-col gap-3"
      >
        {options.map(({ value, label }) => {
          const isSelected = selected.includes(value);
          return (
            <motion.button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-card border bg-cocoon-deep px-5 py-4 text-left font-body text-[15px] transition-all"
              style={{
                borderColor: isSelected ? glow : 'var(--cocoon-mist)',
                color: isSelected ? 'var(--cocoon-light)' : 'var(--cocoon-pearl)',
                boxShadow: isSelected ? `0 8px 32px ${glow}26` : 'none',
              }}
              aria-pressed={isSelected}
            >
              {label}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: canSubmit ? 1 : 0.3 }}
        className="mt-6 flex justify-center"
      >
        <GlowButton onClick={() => canSubmit && onSubmit(multi ? selected : selected[0])} disabled={!canSubmit}>
          {ctaLabel}
        </GlowButton>
      </motion.div>
    </div>
  );
}
