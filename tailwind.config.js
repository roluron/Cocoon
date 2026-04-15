/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cocoon: {
          void: '#0a0a0f',
          deep: '#12121a',
          surface: '#1a1a24',
          mist: '#2a2a36',
          ash: '#6b6b7b',
          pearl: '#c8c8d4',
          light: '#e8e8f0',
        },
        mood: {
          serene: '#4a7c8a',
          melancholy: '#3d3d6b',
          restless: '#8a6a3d',
          energized: '#6b8a4a',
          heavy: '#4a3d5c',
          light: '#8a8a6b',
          creative: '#6b4a7c',
          peaceful: '#3d6b6b',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        modal: '24px',
      },
    },
  },
  plugins: [],
};
