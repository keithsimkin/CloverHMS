/**
 * Tab Notification Example Component
 * 
 * Real-world examples of using the tab notification system.
 */

import { useEffect } from 'react';
import { useTabNotification } from '@/hooks/useTabNotification';
import { useTabStore } from '@/stores/tabStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Example 1: Form Auto-Save with Notifications
 */
export function FormAutoSaveExample() {
  const { notifyCurrentTab } = useTabNotification();

  const handleAutoSave = async () => {
    try {
      // Simulate auto-save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      notifyCurrentTab(
        'success',
        'Form auto-saved successfully',
        'Auto-Save'
      );
    } catch (error) {
      notifyCurrentTab(
        'error',
        'Failed to auto-save form',
        'Auto-Save Error'
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Auto-Save Example</CardTitle>
        <CardDescription>
          Demonstrates auto-save notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAutoSave}>
          Trigger Auto-Save
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Example 2: Background Data Sync
 */
export function BackgroundSyncExample() {
  const { notifyTabByPath } = useTabNotification();

  useEffect(() => {
    // Simulate background data sync every 30 seconds
    const interval = setInterval(() => {
      // Randomly notify different tabs
      const updates = [
        { path: '/patients', message: '3 patient records updated' },
        { path: '/appointments', message: '2 new appointments scheduled' },
        { path: '/inventory', message: '5 items low in stock' },
      ];

      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      
      notifyTabByPath(
        randomUpdate.path,
        'update',
        randomUpdate.message,
        'Data Sync'
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [notifyTabByPath]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Sync Example</CardTitle>
        <CardDescription>
          Simulates background data synchronization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Background sync is running. Notifications will appear on relevant tabs every 30 seconds.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Example 3: API Error Notifications
 */
export function ApiErrorExample() {
  const { notifyCurrentTab } = useTabNotification();

  const handleApiCall = async (shouldFail: boolean) => {
    try {
      if (shouldFail) {
        throw new Error('API request failed');
      }

      // Simulate successful API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      notifyCurrentTab(
        'success',
        'Data loaded successfully',
        'Success'
      );
    } catch (error) {
      notifyCurrentTab(
        'error',
        error instanceof Error ? error.message : 'An error occurred',
        'API Error'
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Error Example</CardTitle>
        <CardDescription>
          Demonstrates error handling with notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={() => handleApiCall(false)} variant="outline">
          Successful API Call
        </Button>
        <Button onClick={() => handleApiCall(true)} variant="destructive">
          Failed API Call
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Example 4: Session Warning
 */
export function SessionWarningExample() {
  const { notifyCurrentTab } = useTabNotification();

  useEffect(() => {
    // Simulate session expiry warning after 5 seconds
    const timeout = setTimeout(() => {
      notifyCurrentTab(
        'warning',
        'Your session will expire in 5 minutes. Please save your work.',
        'Session Warning'
      );
    }, 5000);

    return () => clearTimeout(timeout);
  }, [notifyCurrentTab]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Warning Example</CardTitle>
        <CardDescription>
          Demonstrates session expiry warnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A session warning will appear after 5 seconds.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Example 5: Multi-Tab Notification
 */
export function MultiTabNotificationExample() {
  const { setNotification } = useTabNotification();
  const { tabs } = useTabStore();

  const notifyAllTabs = () => {
    tabs.forEach((tab) => {
      setNotification(
        tab.id,
        'info',
        'System maintenance scheduled for tonight at 10 PM',
        'Maintenance Alert'
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Tab Notification Example</CardTitle>
        <CardDescription>
          Notify all open tabs at once
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={notifyAllTabs}>
          Notify All Tabs
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Combined Examples Page
 */
export function TabNotificationExamples() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tab Notification Examples</h1>
        <p className="text-muted-foreground">
          Real-world examples of using the tab notification system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormAutoSaveExample />
        <ApiErrorExample />
        <SessionWarningExample />
        <BackgroundSyncExample />
        <MultiTabNotificationExample />
      </div>
    </div>
  );
}
