import { useTheme } from '../../context/ThemeContext.jsx';

export default function AmbientOrb({ size = 200, intensity = 1 }) {
  const { glow } = useTheme();
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${glow}, transparent 70%)`,
          filter: `blur(${28 * intensity}px)`,
          animation: 'cocoon-breathe 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-[18%] rounded-full"
        style={{
          background: `radial-gradient(circle at 45% 45%, ${glow}aa, ${glow}22 60%, transparent 80%)`,
          filter: 'blur(8px)',
          animation: 'cocoon-breathe 4s ease-in-out infinite',
        }}
      />
    </div>
  );
}
