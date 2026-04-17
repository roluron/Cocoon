import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { MOOD_VALENCE } from '../../utils/moodAlgorithm.js';
import { today } from '../../utils/storage.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function FreeJournal() {
  const { state, dispatch } = useApp();
  const { glow } = useTheme();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [entryId, setEntryId] = useState(null);
  const saveRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => taRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!text.trim()) return;
    clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      const lastMood = state.moods[state.moods.length - 1]?.mood ?? 'serene';
      if (entryId) {
        dispatch({ type: 'UPDATE_JOURNAL', payload: { id: entryId, patch: { freeWrite: text } } });
      } else {
        const id = uid();
        setEntryId(id);
        dispatch({
          type: 'ADD_JOURNAL',
          payload: {
            id,
            date: today(),
            freeWrite: text,
            moodAtTime: lastMood,
            isResurfaceable: (MOOD_VALENCE[lastMood] ?? 0) > 0.3,
          },
        });
      }
    }, 5000);
    return () => clearTimeout(saveRef.current);
  }, [text, open, entryId, dispatch, state.moods]);

  const close = () => {
    if (text.trim() && entryId) {
      dispatch({ type: 'UPDATE_JOURNAL', payload: { id: entryId, patch: { freeWrite: text } } });
    }
    setOpen(false);
    setText('');
    setEntryId(null);
  };

  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-6 mx-6 flex items-center gap-3 py-3 text-left"
      >
        <span
          className="relative flex h-2 w-2 items-center justify-center"
          aria-hidden="true"
        >
          <span
            className="h-[5px] w-[5px] rounded-full"
            style={{ background: glow, opacity: 0.7 }}
          />
        </span>
        <span className="font-display italic text-[16px] text-cocoon-pearl/80 group-hover:text-cocoon-light transition">
          open a quiet page
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-30 flex flex-col bg-cocoon-void"
          >
            <div className="flex items-center justify-between px-6 pt-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
                {dateStr}
              </span>
              <button
                type="button"
                onClick={close}
                className="font-display italic text-[14px] text-cocoon-pearl/80 hover:text-cocoon-light transition"
              >
                done
              </button>
            </div>
            <textarea
              ref={taRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 resize-none bg-transparent px-6 py-8 font-display italic text-[20px] leading-[1.6] text-cocoon-light placeholder:text-cocoon-ash/40 focus:outline-none"
              placeholder="…"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
