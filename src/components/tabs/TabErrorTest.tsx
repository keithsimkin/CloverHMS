/**
 * TabErrorTest Component
 * 
 * Test component to verify error handling in tabs.
 * This component can be used to manually test the error boundary.
 * 
 * Usage: Navigate to a tab and add this component to trigger an error.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function TabErrorTest() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will trigger the error boundary
    throw new Error('Test error: This is a simulated tab error for testing purposes');
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <CardTitle>Tab Error Testing</CardTitle>
          </div>
          <CardDescription>
            Use this component to test the tab error handling system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to trigger a test error. This will demonstrate
            how the tab system handles errors gracefully without affecting other tabs.
          </p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">What to expect:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>The error will be caught by the tab's error boundary</li>
              <li>A user-friendly error message will be displayed</li>
              <li>Other tabs will continue to work normally</li>
              <li>You can reload the tab to recover</li>
              <li>Error details will be logged to the console</li>
            </ul>
          </div>

          <Button 
            onClick={() => setShouldError(true)}
            variant="destructive"
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Trigger Test Error
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
