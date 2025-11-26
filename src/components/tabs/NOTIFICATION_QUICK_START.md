# Tab Notification System - Quick Start Guide

## 5-Minute Quick Start

### 1. Import the Hook

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';
```

### 2. Use in Your Component

```typescript
function MyComponent() {
  const { notifyCurrentTab } = useTabNotification();

  const handleSuccess = () => {
    notifyCurrentTab('success', 'Operation completed!', 'Success');
  };

  return <button onClick={handleSuccess}>Do Something</button>;
}
```

### 3. See the Result

Switch to another tab and you'll see a colored dot indicator on the tab you just notified!

## Common Patterns

### Pattern 1: Notify After API Call

```typescript
const { notifyCurrentTab } = useTabNotification();

const mutation = useMutation({
  mutationFn: saveData,
  onSuccess: () => {
    notifyCurrentTab('success', 'Data saved successfully');
  },
  onError: (error) => {
    notifyCurrentTab('error', error.message, 'Save Failed');
  },
});
```

### Pattern 2: Notify Another Tab

```typescript
const { notifyTabByPath } = useTabNotification();

// Notify the patients tab about new data
notifyTabByPath('/patients', 'update', '5 new patients registered');
```

### Pattern 3: Background Updates

```typescript
const { notifyTabByPath } = useTabNotification();

useEffect(() => {
  const subscription = dataService.onUpdate((data) => {
    notifyTabByPath(
      data.path,
      'update',
      `${data.count} records updated`
    );
  });

  return () => subscription.unsubscribe();
}, []);
```

## Notification Types

| Type | Color | Use Case |
|------|-------|----------|
| `info` | Blue | General information |
| `success` | Green | Successful operations |
| `warning` | Yellow | Warnings, attention needed |
| `error` | Red | Errors, failures |
| `update` | Purple | Content updates, data changes |

## API Cheat Sheet

```typescript
const {
  // Notify a specific tab by ID
  setNotification,
  
  // Clear notification from a tab
  clearNotification,
  
  // Show toast for a notification
  showNotificationToast,
  
  // Notify the currently active tab
  notifyCurrentTab,
  
  // Notify a tab by its route path
  notifyTabByPath,
} = useTabNotification();
```

## Tips

1. **Auto-Clear**: Notifications automatically clear when you switch to that tab
2. **Inactive Only**: Notifications only show on inactive tabs
3. **One Per Tab**: Each tab can have one notification at a time
4. **Tooltips**: Hover over a notified tab to see details
5. **Screen Readers**: Notifications are announced automatically

## Full Documentation

For complete documentation, see [TAB_NOTIFICATIONS.md](./TAB_NOTIFICATIONS.md)

## Demo

Try the interactive demo:
```typescript
import { TabNotificationDemo } from '@/components/tabs/TabNotificationDemo';
```
