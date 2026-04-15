import { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import DevSeeder from './components/shared/DevSeeder.jsx';

const OnboardingFlow = lazy(() => import('./components/onboarding/OnboardingFlow.jsx'));

function Root() {
  const { state } = useApp();
  if (!state.hydrated) return null;
  if (!state.profile)
    return (
      <Suspense fallback={null}>
        <OnboardingFlow />
      </Suspense>
    );
  return <AppShell />;
}

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <Root />
        <DevSeeder />
      </ThemeProvider>
    </AppProvider>
  );
}
