import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalKeyboardShortcuts } from '@/components/common/GlobalKeyboardShortcuts';
import { TabSystemProvider } from '@/components/tabs/TabSystemProvider';
import { useThemeStore } from '@/stores/themeStore';

function App() {
  const { theme } = useThemeStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <TabSystemProvider>
        <RouterProvider router={router} />
      </TabSystemProvider>
      <Toaster />
      <GlobalKeyboardShortcuts />
    </ErrorBoundary>
  );
}

export default App;
