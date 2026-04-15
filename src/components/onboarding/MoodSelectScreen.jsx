import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import MoodOption from '../shared/MoodOption.jsx';
import GlowButton from '../shared/GlowButton.jsx';
import { MOODS } from '../../utils/moodAlgorithm.js';

export default function MoodSelectScreen({
  title = 'Close your eyes for a moment. How do you feel?',
  ctaLabel = 'Enter Cocoon',
  showAfterText = 'This is your starting point.',
  onSubmit,
}) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex h-full flex-col px-6 pt-14 pb-10">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-display text-cocoon-light text-[26px] leading-snug"
      >
        {title}
      </motion.h1>

      <div className="mt-10 flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-6">
        {MOODS.map((mood) => (
          <MoodOption
            key={mood.id}
            mood={mood}
            selected={selected === mood.id}
            dimmed={selected !== null && selected !== mood.id}
            onSelect={setSelected}
            size={72}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="mt-4 flex flex-col items-center gap-6"
          >
            <p className="font-body text-sm text-cocoon-ash">{showAfterText}</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <GlowButton onClick={() => onSubmit(selected)}>{ctaLabel}</GlowButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
