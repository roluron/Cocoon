import { Circle, Feather, Sunrise, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

const TABS = [
  { id: 'home', label: 'Home', Icon: Circle },
  { id: 'journal', label: 'Journal', Icon: Feather },
  { id: 'rituals', label: 'Rituals', Icon: Sunrise },
  { id: 'soundscape', label: 'Sound', Icon: Headphones },
];

export default function BottomNav({ active, onChange }) {
  const { glow } = useTheme();

  return (
    <nav
      className="relative shrink-0 px-2 pt-2"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
    >
      <div className="flex items-stretch justify-around gap-1 rounded-modal border border-cocoon-mist/40 bg-cocoon-deep/70 px-2 py-2 backdrop-blur-xl">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-card px-2 py-2 transition-colors"
              aria-label={label}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="navGlow"
                  className="absolute inset-0 rounded-card"
                  style={{
                    background: `radial-gradient(ellipse at center, ${glow}30, transparent 70%)`,
                    boxShadow: `0 0 24px ${glow}33`,
                  }}
                  transition={{ type: 'spring', damping: 24, stiffness: 240 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={1.5}
                className="relative z-10"
                color={isActive ? glow : 'var(--cocoon-ash)'}
              />
              <span
                className="relative z-10 font-mono text-[10px] tracking-wider uppercase"
                style={{ color: isActive ? 'var(--cocoon-light)' : 'var(--cocoon-ash)' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
