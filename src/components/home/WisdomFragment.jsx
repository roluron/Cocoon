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
      transition={{ duration: 1.4, delay: 0.3 }}
      className="mx-5 mt-8 mb-6 text-center"
    >
      <p className="font-display italic text-cocoon-pearl text-base leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
        {quote.author}
      </p>
    </motion.section>
  );
}
