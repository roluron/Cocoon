import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';

const TEN_MIN = 10 * 60 * 1000;
const FIFTEEN_MIN = 15 * 60 * 1000;

export default function PresenceNudge() {
  const { state, dispatch } = useApp();
  const [message, setMessage] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!state.hydrated) return;
    if (dismissed) return;

    const tick = () => {
      const start = new Date(state.presence.sessionStartTime).getTime();
      const elapsed = Date.now() - start;
      const lastNudge = state.presence.lastNudgeAt
        ? new Date(state.presence.lastNudgeAt).getTime()
        : 0;
      const sinceLastNudge = Date.now() - lastNudge;

      if (elapsed >= FIFTEEN_MIN && sinceLastNudge >= 5 * 60 * 1000) {
        setMessage('Maybe step outside for a moment. Cocoon will be here when you return.');
        dispatch({ type: 'NUDGE_SHOWN' });
      } else if (elapsed >= TEN_MIN && !state.presence.lastNudgeAt) {
        setMessage("You've been here a while. The world outside is also part of the journey.");
        dispatch({ type: 'NUDGE_SHOWN' });
      }
    };

    const id = setInterval(tick, 30000);
    tick();
    return () => clearInterval(id);
  }, [state.hydrated, state.presence.sessionStartTime, state.presence.lastNudgeAt, dismissed, dispatch]);

  const dismiss = () => {
    setMessage(null);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.button
          type="button"
          onClick={dismiss}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="pointer-events-auto absolute inset-x-0 bottom-2 z-30 mx-auto block w-full max-w-xs px-6 text-center"
          aria-live="polite"
        >
          <p className="font-body text-[13px] italic text-cocoon-ash leading-relaxed">{message}</p>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
