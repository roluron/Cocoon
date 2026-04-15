import { useTheme } from '../../context/ThemeContext.jsx';

export default function BreathingCircle({ size = 180 }) {
  const { glow } = useTheme();
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 50%, ${glow}, ${glow}33 55%, transparent 80%)`,
        filter: 'blur(20px)',
        animation: 'cocoon-breath 8s ease-in-out infinite',
      }}
    />
  );
}
