# Tab Notification System

The tab notification system allows you to display visual indicators on tabs when important events occur in background tabs. This helps users stay informed about updates, errors, or other events that require attention.

## Features

- **Visual Indicators**: Colored dots on tabs indicate different notification types
- **Notification Types**: Support for info, success, warning, error, and update notifications
- **Auto-Clear**: Notifications automatically clear when the tab becomes active
- **Tooltips**: Hover over a tab to see detailed notification information
- **Screen Reader Support**: Notifications are announced to screen readers
- **Toast Integration**: Optional toast notifications for important updates

## Notification Types

Each notification type has a distinct color:

- **Info** (Blue): General information updates
- **Success** (Green): Successful operations
- **Warning** (Yellow): Warnings or attention needed
- **Error** (Red): Errors that occurred
- **Update** (Purple): Content updates

## Usage

### Basic Usage with useTabNotification Hook

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';

function MyComponent() {
  const { setNotification, clearNotification } = useTabNotification();

  const handleDataUpdate = () => {
    // Notify a specific tab by ID
    setNotification(
      'tab-id-123',
      'update',
      'New data available',
      'Data Updated'
    );
  };

  const handleError = () => {
    // Notify with error type
    setNotification(
      'tab-id-123',
      'error',
      'Failed to save changes',
      'Save Error'
    );
  };

  const handleClear = () => {
    // Clear notification from a tab
    clearNotification('tab-id-123');
  };

  return (
    <div>
      <button onClick={handleDataUpdate}>Update Data</button>
      <button onClick={handleError}>Trigger Error</button>
      <button onClick={handleClear}>Clear Notification</button>
    </div>
  );
}
```

### Notify Current Tab

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';

function MyComponent() {
  const { notifyCurrentTab } = useTabNotification();

  const handleSuccess = () => {
    // Notify the currently active tab
    notifyCurrentTab(
      'success',
      'Operation completed successfully',
      'Success'
    );
  };

  return <button onClick={handleSuccess}>Complete Operation</button>;
}
```

### Notify Tab by Path

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';

function MyComponent() {
  const { notifyTabByPath } = useTabNotification();

  const handlePatientUpdate = () => {
    // Notify a tab by its route path
    notifyTabByPath(
      '/patients',
      'info',
      'Patient records have been updated',
      'Records Updated'
    );
  };

  return <button onClick={handlePatientUpdate}>Update Patients</button>;
}
```

### Show Toast for Notification

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';

function MyComponent() {
  const { setNotification, showNotificationToast } = useTabNotification();

  const handleImportantUpdate = (tabId: string) => {
    // Set notification on tab
    setNotification(
      tabId,
      'warning',
      'Important update requires your attention',
      'Action Required'
    );

    // Also show a toast to ensure user sees it
    showNotificationToast(tabId);
  };

  return <button onClick={() => handleImportantUpdate('tab-id')}>
    Important Update
  </button>;
}
```

### Direct Store Access

For advanced use cases, you can access the store directly:

```typescript
import { useTabStore } from '@/stores/tabStore';

function MyComponent() {
  const setTabNotification = useTabStore((state) => state.setTabNotification);
  const clearTabNotification = useTabStore((state) => state.clearTabNotification);

  const handleNotify = () => {
    setTabNotification(
      'tab-id-123',
      'info',
      'This is a notification message',
      'Optional Title'
    );
  };

  return <button onClick={handleNotify}>Notify</button>;
}
```

## Real-World Examples

### Example 1: Form Auto-Save Notification

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';
import { useEffect } from 'react';

function PatientForm() {
  const { notifyCurrentTab } = useTabNotification();
  const [formData, setFormData] = useState({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await saveFormData(formData);
        setLastSaved(new Date());
        
        // Notify success
        notifyCurrentTab(
          'success',
          'Form auto-saved successfully',
          'Auto-Save'
        );
      } catch (error) {
        // Notify error
        notifyCurrentTab(
          'error',
          'Failed to auto-save form',
          'Auto-Save Error'
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, notifyCurrentTab]);

  return <form>{/* Form fields */}</form>;
}
```

### Example 2: Background Data Sync

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';
import { useEffect } from 'react';

function DataSyncManager() {
  const { notifyTabByPath } = useTabNotification();

  useEffect(() => {
    // Listen for data updates from WebSocket or polling
    const subscription = dataService.onUpdate((update) => {
      // Notify relevant tabs about the update
      if (update.type === 'patient') {
        notifyTabByPath(
          '/patients',
          'update',
          `${update.count} patient records updated`,
          'Data Sync'
        );
      } else if (update.type === 'appointment') {
        notifyTabByPath(
          '/appointments',
          'update',
          `${update.count} appointments updated`,
          'Data Sync'
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [notifyTabByPath]);

  return null; // This is a background manager component
}
```

### Example 3: Error Notification from API

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';
import { useMutation } from '@tanstack/react-query';

function AppointmentScheduler() {
  const { notifyCurrentTab } = useTabNotification();

  const scheduleMutation = useMutation({
    mutationFn: scheduleAppointment,
    onSuccess: () => {
      notifyCurrentTab(
        'success',
        'Appointment scheduled successfully',
        'Success'
      );
    },
    onError: (error) => {
      notifyCurrentTab(
        'error',
        error.message || 'Failed to schedule appointment',
        'Scheduling Error'
      );
    },
  });

  return (
    <button onClick={() => scheduleMutation.mutate(appointmentData)}>
      Schedule Appointment
    </button>
  );
}
```

### Example 4: Multi-Tab Notification

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';
import { useTabStore } from '@/stores/tabStore';

function SystemNotificationManager() {
  const { setNotification } = useTabNotification();
  const tabs = useTabStore((state) => state.tabs);

  const notifyAllTabs = (type, message, title) => {
    // Notify all open tabs
    tabs.forEach((tab) => {
      setNotification(tab.id, type, message, title);
    });
  };

  const handleSystemMaintenance = () => {
    notifyAllTabs(
      'warning',
      'System maintenance scheduled in 10 minutes',
      'Maintenance Alert'
    );
  };

  return (
    <button onClick={handleSystemMaintenance}>
      Announce Maintenance
    </button>
  );
}
```

## Best Practices

### 1. Use Appropriate Notification Types

- **Info**: General updates that don't require immediate action
- **Success**: Confirm successful operations
- **Warning**: Important information that may require attention
- **Error**: Critical errors that need immediate attention
- **Update**: Content changes or data refreshes

### 2. Keep Messages Concise

```typescript
// Good
notifyCurrentTab('success', 'Patient record saved', 'Success');

// Too verbose
notifyCurrentTab(
  'success',
  'The patient record has been successfully saved to the database and all related information has been updated accordingly',
  'Operation Completed Successfully'
);
```

### 3. Clear Notifications When Appropriate

Notifications automatically clear when a tab becomes active, but you can manually clear them:

```typescript
const { clearNotification } = useTabNotification();

// Clear after user acknowledges
const handleAcknowledge = (tabId: string) => {
  clearNotification(tabId);
};
```

### 4. Combine with Toasts for Critical Updates

For critical notifications, use both tab notifications and toasts:

```typescript
const { setNotification, showNotificationToast } = useTabNotification();

const handleCriticalError = (tabId: string) => {
  setNotification(tabId, 'error', 'Critical error occurred', 'Error');
  showNotificationToast(tabId); // Also show toast
};
```

### 5. Don't Overuse Notifications

Only notify for important events. Too many notifications can be distracting:

```typescript
// Good - notify for important events
notifyTabByPath('/patients', 'update', '5 new patients registered');

// Bad - don't notify for every minor change
notifyTabByPath('/patients', 'info', 'User scrolled the page');
```

## Accessibility

The notification system is fully accessible:

- **Visual Indicators**: Colored dots provide visual feedback
- **Tooltips**: Detailed information on hover
- **Screen Reader Announcements**: Notifications are announced to screen readers
- **ARIA Labels**: Proper ARIA labels on notification indicators

## Integration with Existing Systems

### Toast System

The notification system integrates with the existing toast system:

```typescript
import { toast } from '@/hooks/use-toast';
import { useTabNotification } from '@/hooks/useTabNotification';

// Tab notification
const { setNotification } = useTabNotification();
setNotification(tabId, 'error', 'Error message');

// Toast notification (for immediate feedback)
toast({
  variant: 'destructive',
  title: 'Error',
  description: 'Error message',
});
```

### TanStack Query

Works seamlessly with TanStack Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { useTabNotification } from '@/hooks/useTabNotification';

function DataComponent() {
  const { notifyCurrentTab } = useTabNotification();

  const { data, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    onError: (error) => {
      notifyCurrentTab('error', error.message, 'Data Fetch Error');
    },
  });

  return <div>{/* Component content */}</div>;
}
```

## API Reference

### useTabNotification Hook

```typescript
interface UseTabNotificationReturn {
  setNotification: (
    tabId: string,
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;
  
  clearNotification: (tabId: string) => void;
  
  showNotificationToast: (tabId: string) => void;
  
  notifyCurrentTab: (
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;
  
  notifyTabByPath: (
    path: string,
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;
}
```

### TabStore Actions

```typescript
interface TabState {
  setTabNotification: (
    tabId: string,
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;
  
  clearTabNotification: (tabId: string) => void;
  
  showTabNotificationToast: (tabId: string) => void;
}
```

### Types

```typescript
type TabNotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'update';

interface TabNotification {
  type: TabNotificationType;
  message: string;
  title?: string;
  timestamp: number;
}
```

## Troubleshooting

### Notification Not Showing

1. Check that the tab ID is correct
2. Ensure the tab is not currently active (notifications auto-clear on active tabs)
3. Verify the notification was set correctly

```typescript
// Debug: Log tab state
const tabs = useTabStore((state) => state.tabs);
console.log('Tabs:', tabs);
```

### Notification Not Clearing

Notifications automatically clear when a tab becomes active. To manually clear:

```typescript
const { clearNotification } = useTabNotification();
clearNotification(tabId);
```

### Multiple Notifications

Only one notification per tab is supported. Setting a new notification replaces the previous one:

```typescript
// This will replace any existing notification
setNotification(tabId, 'info', 'New message');
```
