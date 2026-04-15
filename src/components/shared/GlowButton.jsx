import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function GlowButton({ children, onClick, variant = 'pill', disabled, type = 'button', as }) {
  const { glow } = useTheme();

  const base =
    'relative inline-flex items-center justify-center font-body text-[15px] tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  const styles =
    variant === 'pill'
      ? {
          className: `${base} px-7 py-3 rounded-full text-cocoon-light`,
          style: {
            border: `1px solid ${glow}80`,
            background: `linear-gradient(180deg, ${glow}14, transparent)`,
            boxShadow: `0 0 24px ${glow}33`,
          },
        }
      : {
          className: `${base} text-cocoon-ash hover:text-cocoon-pearl underline-offset-4 hover:underline`,
          style: {},
        };

  const Cmp = as || motion.button;

  return (
    <Cmp
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles.className}
      style={styles.style}
      whileHover={!disabled && variant === 'pill' ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {children}
    </Cmp>
  );
}
