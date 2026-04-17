import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { drawWeeklyCard, getWeekNumber } from '../../utils/tarot.js';

/**
 * Converts a standard Roman numeral string like "XIII" into a
 * spaced small-caps representation like "X I I I".
 */
function spacedNumeral(numeral) {
  return numeral.split('').join(' ');
}

export default function WeeklyTarotCard() {
  const { state } = useApp();
  const { glow } = useTheme();

  if (!state.profile?.onboarding?.archetypeEnabled) return null;

  const card = drawWeeklyCard(state.profile.id, getWeekNumber(new Date()));

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="relative mt-8 px-6"
      aria-label="This week's archetype"
    >
      {/* Hairline divider — gradient fade using glow color */}
      <div
        className="mb-5 h-px"
        style={{
          background: `linear-gradient(to right, ${glow}55, ${glow}22 40%, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Section marker: ✦ left — THIS WEEK'S ARCHETYPE right */}
      <div className="flex items-baseline justify-between">
        <span
          className="font-display italic text-cocoon-pearl/70 text-[15px]"
          aria-hidden="true"
        >
          ✦
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
          this week's archetype
        </span>
      </div>

      {/* Card numeral */}
      <p
        className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-cocoon-ash/60"
        aria-hidden="true"
      >
        {spacedNumeral(card.numeral)}
      </p>

      {/* Card name */}
      <h2
        className="mt-1 font-display italic leading-[1.1] text-cocoon-light"
        style={{ fontSize: 'clamp(28px, 8vw, 36px)' }}
      >
        {card.name}
      </h2>

      {/* Keywords — comma-separated mono small-caps line */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cocoon-ash/70">
        {card.keywords.join(', ')}
      </p>

      {/* Reflection — Jungian block quote, floating open-quote style */}
      <div className="relative mt-6 pl-0">
        <p
          className="font-display italic text-cocoon-pearl/80 leading-[1.35]"
          style={{ fontSize: 'clamp(16px, 4.6vw, 20px)' }}
        >
          <span
            className="relative -top-1 mr-1 font-display text-cocoon-pearl/30"
            style={{ fontSize: '1.5em', lineHeight: 0 }}
            aria-hidden="true"
          >
            "
          </span>
          {card.reflection}
        </p>
      </div>

      {/* Drawn-for-this-week caption */}
      <p className="mt-5 font-mono text-[10px] tracking-[0.22em] text-cocoon-ash/40">
        drawn for this week
      </p>
    </motion.section>
  );
}
