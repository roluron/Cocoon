import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import MoodOption from '../shared/MoodOption.jsx';
import GlowButton from '../shared/GlowButton.jsx';
import BreathingCircle from './BreathingCircle.jsx';
import { MOODS, moodLabel } from '../../utils/moodAlgorithm.js';
import { useApp } from '../../context/AppContext.jsx';
import { dayInCycle } from '../../utils/promptArc.js';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Adaptive timing: shorter breathing space as user builds familiarity
 *  Days 1-7:  3 breath cycles (~24s)
 *  Days 8-14: 2 breath cycles (~16s)
 *  Days 15+:  1 breath cycle  (~8s)  */
function breathDuration(cycle) {
  const day = dayInCycle(cycle);
  if (day <= 7) return 24000;
  if (day <= 14) return 16000;
  return 8000;
}

export default function MoodCheckinFlow({ open, onClose, onWriteRequest }) {
  const { state, dispatch } = useApp();
  const [stage, setStage] = useState('select');
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const breathMs = useMemo(() => breathDuration(state.cycle), [state.cycle]);

  useEffect(() => {
    if (!open) {
      setStage('select');
      setMood(null);
      setNote('');
      setShowInvite(false);
    }
  }, [open]);

  useEffect(() => {
    if (stage !== 'breathe') return;
    const t = setTimeout(() => setShowInvite(true), breathMs);
    return () => clearTimeout(t);
  }, [stage, breathMs]);

  const commitMood = (m) => {
    setMood(m);
    dispatch({
      type: 'ADD_MOOD',
      payload: {
        id: uid(),
        timestamp: new Date().toISOString(),
        mood: m,
        note: note.trim() || undefined,
        source: 'check-in',
      },
    });
    setStage('breathe');
  };

  const dismiss = () => onClose();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute inset-0 z-40 flex flex-col bg-cocoon-void/95 backdrop-blur"
          onClick={(e) => {
            if (stage === 'invite' && e.target === e.currentTarget) dismiss();
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 font-mono text-[11px] uppercase tracking-widest text-cocoon-ash"
          >
            Close
          </button>

          <AnimatePresence mode="wait">
            {stage === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col justify-center px-6"
              >
                <h2 className="font-display text-cocoon-light text-[24px] leading-snug">
                  How are you, right now?
                </h2>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-6">
                  {MOODS.map((m) => (
                    <MoodOption
                      key={m.id}
                      mood={m}
                      selected={mood === m.id}
                      dimmed={mood && mood !== m.id}
                      onSelect={commitMood}
                      size={68}
                    />
                  ))}
                </div>
                <div className="mt-8">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="In a few words..."
                    className="w-full border-b border-cocoon-mist py-2 text-center font-body text-sm text-cocoon-pearl placeholder:text-cocoon-ash/70 focus:border-cocoon-ash"
                  />
                </div>
              </motion.div>
            )}

            {(stage === 'breathe' || stage === 'invite') && mood && (
              <motion.div
                key="breathe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="flex h-full flex-col items-center justify-center gap-10 px-8 text-center"
              >
                <BreathingCircle size={200} />
                <p className="font-display text-cocoon-pearl text-lg italic opacity-70">
                  {moodLabel(mood)}
                </p>
                <AnimatePresence>
                  {showInvite && (
                    <motion.div
                      key="invite"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5 }}
                      className="flex flex-col items-center gap-5"
                      onAnimationStart={() => setStage('invite')}
                    >
                      <p className="font-body text-base text-cocoon-pearl">
                        Feel like writing today?
                      </p>
                      <GlowButton
                        onClick={() => {
                          onClose();
                          onWriteRequest?.();
                        }}
                      >
                        Yes
                      </GlowButton>
                      <GlowButton variant="text" onClick={dismiss}>
                        Not today
                      </GlowButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
