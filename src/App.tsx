import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalKeyboardShortcuts } from '@/components/common/GlobalKeyboardShortcuts';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
      <GlobalKeyboardShortcuts />
    </ErrorBoundary>
  );
}

export default App;
