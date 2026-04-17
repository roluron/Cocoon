import { motion } from 'framer-motion';
import AmbientOrb from '../shared/AmbientOrb.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { moodLabel } from '../../utils/moodAlgorithm.js';

const PHASE_LABELS = {
  dormancy: 'Dormancy',
  stirring: 'Stirring',
  unraveling: 'Unraveling',
  reforming: 'Reforming',
  emergence: 'Emergence',
};

const PHASE_WHISPERS = {
  dormancy: 'the quiet before',
  stirring: 'something is moving',
  unraveling: 'letting it come apart',
  reforming: 'taking a new shape',
  emergence: 'stepping into the light',
};

function timeParts(d = new Date()) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const h = d.getHours();
  let period = 'evening';
  if (h < 5) period = 'late night';
  else if (h < 12) period = 'morning';
  else if (h < 18) period = 'afternoon';
  return { time: `${hh}·${mm}`, period };
}

export default function CocoonStateCard({ onCheckin, softCheckin }) {
  const { state } = useApp();
  const { glow } = useTheme();
  const lastMood = state.moods[state.moods.length - 1]?.mood;
  const phase = state.cycle?.phase ?? 'dormancy';
  const phaseLabel = PHASE_LABELS[phase];
  const whisper = PHASE_WHISPERS[phase];
  const { time, period } = timeParts();
  const name = state.profile?.name;

  return (
    <section
      className="relative mt-4 overflow-hidden pb-14"
      style={{ minHeight: '58vh' }}
      aria-label="Your current state"
    >
      {/* top-right hairline meta */}
      <div className="absolute right-5 top-0 flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cocoon-ash/80">
        <span>{time}</span>
        <span className="text-cocoon-ash/60">{period}</span>
      </div>

      {/* orb, offset right and slightly up — bleeds past the center */}
      <div
        className="pointer-events-none absolute"
        style={{ right: '-14%', top: '8%' }}
        aria-hidden="true"
      >
        <AmbientOrb size={320} intensity={1.15} />
      </div>

      {/* hero type, flush left, slow staggered reveal */}
      <div className="relative z-10 flex flex-col pt-28 pl-6 pr-5">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.1 }}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash"
        >
          {name ? `${period}, ${name.toLowerCase()}` : 'the cocoon'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.25 }}
          className="mt-2 font-display italic text-cocoon-light leading-[0.95]"
          style={{ fontSize: 'clamp(56px, 17vw, 84px)', letterSpacing: '-0.01em' }}
        >
          {phaseLabel}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.8 }}
          className="mt-4 font-display italic text-cocoon-pearl/75 text-[17px] leading-snug max-w-[70%]"
        >
          {whisper}.
        </motion.p>

        {/* mood as a supporting whisper, not the headline */}
        {lastMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.1 }}
            className="mt-10 flex items-center gap-3"
          >
            <span
              className="h-px w-8"
              style={{ background: `linear-gradient(to right, ${glow}, transparent)` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
              you feel
            </span>
            <span className="font-display italic text-cocoon-light text-[17px]">
              {moodLabel(lastMood).toLowerCase()}
            </span>
          </motion.div>
        )}
      </div>

      {/* invitation — a pulsing dot, not a button label */}
      <motion.button
        type="button"
        onClick={onCheckin}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.5 }}
        className="group relative z-10 mt-8 ml-6 flex items-center gap-3 py-2 text-left"
        aria-label={softCheckin ? 'Check in again' : 'Check in now'}
      >
        <span
          className="relative flex h-2 w-2 items-center justify-center"
          aria-hidden="true"
        >
          <span
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: glow,
              animation: 'cocoon-breath 3.2s ease-in-out infinite',
            }}
          />
          <span
            className="relative h-[5px] w-[5px] rounded-full"
            style={{ background: glow }}
          />
        </span>
        <span className="font-display italic text-[14px] text-cocoon-pearl/75 transition group-hover:text-cocoon-light">
          {softCheckin ? 'trust what you felt' : lastMood ? 'again' : 'begin listening'}
        </span>
      </motion.button>
    </section>
  );
}
