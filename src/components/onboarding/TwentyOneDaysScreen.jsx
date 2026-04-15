import { motion } from 'framer-motion';
import { useState } from 'react';
import GlowButton from '../shared/GlowButton.jsx';

const LINES = [
  { text: 'Change isn\u2019t magic.', cls: 'font-display text-2xl text-cocoon-light', delay: 0 },
  {
    text: 'Your brain builds new pathways through repetition.',
    cls: 'font-body text-base text-cocoon-pearl',
    delay: 1.5,
  },
  {
    text: 'Neuroscience shows this takes around 21 days.',
    cls: 'font-body text-base text-cocoon-pearl',
    delay: 3,
  },
  {
    text: 'Not because of willpower. Because of biology.',
    cls: 'font-body text-base text-cocoon-pearl',
    delay: 4.5,
  },
  {
    text: 'Some days will feel easy. Some won\u2019t.',
    cls: 'font-body text-base text-cocoon-ash',
    delay: 6,
  },
  { text: 'Both are part of it.', cls: 'font-display text-xl text-cocoon-light', delay: 7.5 },
];

const FULL_DURATION = 9;

export default function TwentyOneDaysScreen({ onContinue }) {
  const [accelerated, setAccelerated] = useState(false);
  const factor = accelerated ? 0.18 : 1;

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center px-8 text-center"
      onClick={() => setAccelerated(true)}
    >
      <div className="flex flex-col gap-5">
        {LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: line.delay * factor }}
            className={`${line.cls} max-w-sm leading-relaxed`}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: FULL_DURATION * factor }}
        className="mt-12"
      >
        <GlowButton onClick={(e) => { e.stopPropagation(); onContinue(); }}>Continue</GlowButton>
      </motion.div>
    </div>
  );
}
