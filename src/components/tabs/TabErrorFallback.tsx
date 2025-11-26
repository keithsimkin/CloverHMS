/**
 * TabErrorFallback Component
 * 
 * Error fallback UI specifically designed for tab content errors.
 * Provides reload functionality and user-friendly error messages.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useTabStore } from '@/stores/tabStore';
import { useRouter } from '@tanstack/react-router';
import { getUserFriendlyMessage, logError } from '@/lib/errorUtils';
import type { AppError } from '@/lib/errorUtils';

interface TabErrorFallbackProps {
  error: AppError;
  tabId: string;
  onReload: () => void;
}

/**
 * Error fallback component for individual tabs
 * Shows user-friendly error message with options to reload or close the tab
 */
export function TabErrorFallback({ error, tabId, onReload }: TabErrorFallbackProps) {
  const { closeTab, tabs } = useTabStore();
  const router = useRouter();

  // Log error for debugging
  logError(error);

  const handleCloseTab = () => {
    closeTab(tabId);
  };

  const handleGoHome = () => {
    router.navigate({ to: '/' as any });
  };

  const currentTab = tabs.find(t => t.id === tabId);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Tab Error</CardTitle>
          </div>
          <CardDescription>
            An error occurred while loading {currentTab?.title || 'this tab'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
            <p className="text-sm text-foreground">
              {getUserFriendlyMessage(error)}
            </p>
          </div>

          {import.meta.env.DEV && error.details && (
            <details className="text-xs">
              <summary className="text-muted-foreground cursor-pointer hover:text-foreground font-medium mb-2">
                Technical Details (Development Only)
              </summary>
              <div className="bg-muted p-3 rounded border border-border overflow-auto max-h-40">
                <pre className="text-xs font-mono">
                  {typeof error.details === 'string'
                    ? error.details
                    : JSON.stringify(error.details, null, 2)}
                </pre>
              </div>
            </details>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>You can try the following:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Reload the tab to try again</li>
              <li>Close this tab and open it again</li>
              <li>Go back to the Dashboard</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onReload} variant="default" className="gap-2 flex-1">
            <RefreshCw className="h-4 w-4" />
            Reload Tab
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="gap-2 flex-1">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
          <Button onClick={handleCloseTab} variant="ghost" className="flex-1">
            Close Tab
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
