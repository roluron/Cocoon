import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { selectWisdom } from '../../utils/wisdomSelector.js';

export default function WisdomFragment() {
  const { state } = useApp();
  const quote = selectWisdom({ moods: state.moods, cycle: state.cycle });
  if (!quote) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay: 0.6 }}
      className="relative mt-10 mb-8 pl-6 pr-8"
      aria-label="A fragment"
    >
      <div
        className="mb-6 h-px w-10"
        style={{
          background:
            'linear-gradient(to right, var(--cocoon-pearl), transparent)',
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      <p
        className="font-display italic text-cocoon-light leading-[1.25]"
        style={{ fontSize: 'clamp(22px, 6.2vw, 28px)' }}
      >
        <span
          className="relative -top-1 mr-1 font-display text-cocoon-pearl/40"
          style={{ fontSize: '1.4em', lineHeight: 0 }}
          aria-hidden="true"
        >
          “
        </span>
        {quote.text}
      </p>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
        — {quote.author}
      </p>
    </motion.section>
  );
}
