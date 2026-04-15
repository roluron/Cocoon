import { AppProvider, useApp } from './context/AppContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import OnboardingFlow from './components/onboarding/OnboardingFlow.jsx';
import AppShell from './components/layout/AppShell.jsx';

function Root() {
  const { state } = useApp();
  if (!state.hydrated) return null;
  if (!state.profile) return <OnboardingFlow />;
  return <AppShell />;
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
