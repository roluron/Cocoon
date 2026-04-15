import { createContext, useContext, useEffect, useMemo } from 'react';
import { useApp } from './AppContext.jsx';
import { hexToRgbTriple, moodColor } from '../utils/moodAlgorithm.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { state } = useApp();

  const currentMood = state.moods[state.moods.length - 1]?.mood ?? 'serene';
  const glow = moodColor(currentMood);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cocoon-glow', glow);
    root.style.setProperty('--cocoon-glow-rgb', hexToRgbTriple(glow));
  }, [glow]);

  const value = useMemo(() => ({ currentMood, glow }), [currentMood, glow]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
