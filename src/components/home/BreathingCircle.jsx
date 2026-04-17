/**
 * Breathing Circle — the decompression chamber.
 *
 * No instructions. No "breathe in / breathe out." Just the circle moving.
 * The user naturally syncs their breathing. This is felt, not taught.
 *
 * Three concentric layers breathing at slightly different rates
 * create an organic, living pulse — not mechanical.
 */

import { useTheme } from '../../context/ThemeContext.jsx';

export default function BreathingCircle({ size = 200 }) {
  const { glow } = useTheme();

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Outermost — slowest, most diffuse */}
      <div
        className="absolute inset-[-15%] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow}22, transparent 65%)`,
          animation: 'cocoon-breath 8.5s ease-in-out infinite',
        }}
      />
      {/* Middle — the primary breath rhythm */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 48% 48%, ${glow}55, ${glow}18 50%, transparent 75%)`,
          filter: 'blur(12px)',
          animation: 'cocoon-breath 8s ease-in-out infinite',
        }}
      />
      {/* Inner core — slightly faster, gives liveliness */}
      <div
        className="absolute inset-[20%] rounded-full"
        style={{
          background: `radial-gradient(circle at 45% 45%, ${glow}88, ${glow}33 50%, transparent 80%)`,
          filter: 'blur(6px)',
          animation: 'cocoon-breath 7.2s ease-in-out infinite',
          animationDelay: '-0.5s',
        }}
      />
      {/* Bright center point */}
      <div
        className="absolute inset-[38%] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow}cc, ${glow}44 60%, transparent 90%)`,
          filter: 'blur(3px)',
          animation: 'cocoon-breath 7.2s ease-in-out infinite',
          animationDelay: '-0.5s',
        }}
      />
    </div>
  );
}
