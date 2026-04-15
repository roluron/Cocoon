import { AppProvider, useApp } from './context/AppContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

function Splash() {
  return (
    <div className="flex h-full items-center justify-center px-8 text-center">
      <p className="font-display italic text-cocoon-light text-2xl leading-relaxed">
        Before anything changes outside,
        <br />
        something stirs within.
      </p>
    </div>
  );
}

function Root() {
  const { state } = useApp();
  if (!state.hydrated) return null;
  return <Splash />;
}

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </AppProvider>
  );
}
