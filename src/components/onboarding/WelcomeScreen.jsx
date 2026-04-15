import { motion } from 'framer-motion';
import GlowButton from '../shared/GlowButton.jsx';
import AmbientOrb from '../shared/AmbientOrb.jsx';

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <AmbientOrb size={180} />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="mt-12 max-w-xs font-display italic text-cocoon-light text-2xl leading-snug"
      >
        Before anything changes outside, something stirs within.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="mt-12"
      >
        <GlowButton onClick={onContinue}>Begin</GlowButton>
      </motion.div>
    </div>
  );
}
