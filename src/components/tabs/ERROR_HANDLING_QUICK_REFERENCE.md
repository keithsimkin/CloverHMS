# Tab Error Handling - Quick Reference

## For Component Developers

### Throwing Errors in Tab Content

Your components are automatically wrapped in an ErrorBoundary. Just throw errors normally:

```tsx
// In your page component
export function PatientPage() {
  const { data, error } = usePatients();
  
  if (error) {
    // This will be caught by the tab's error boundary
    throw new Error('Failed to load patient data');
  }
  
  return <div>{/* Your content */}</div>;
}
```

### Using the Tab Reload Hook

```tsx
import { useTabReload } from '@/hooks/useTabReload';

function MyComponent() {
  const { reloadCurrentTab, reloadTab, forceReload } = useTabReload();
  
  return (
    <div>
      <button onClick={reloadCurrentTab}>Reload This Tab</button>
      <button onClick={() => reloadTab('tab-id')}>Reload Specific Tab</button>
      <button onClick={forceReload}>Force Reload App</button>
    </div>
  );
}
```

### Logging Tab Errors

```tsx
import { logTabError } from '@/lib/tabErrorLogger';

try {
  // Your code
} catch (error) {
  logTabError(error, {
    tabId: currentTab.id,
    tabPath: currentTab.path,
    tabTitle: currentTab.title,
    action: 'loadData'
  });
}
```

## For Tab System Developers

### Adding Error Handling to Tab Actions

```tsx
// In tabStore.ts
myAction: () => {
  try {
    // Your action logic
  } catch (error) {
    logTabActionError('myAction', error);
    toast({
      variant: 'destructive',
      title: 'Action Failed',
      description: 'User-friendly message here',
    });
  }
}
```

### Validating Tab Data

```tsx
const isValidTab = (tab: any): tab is Tab => {
  return (
    tab &&
    typeof tab === 'object' &&
    typeof tab.id === 'string' &&
    typeof tab.path === 'string' &&
    // ... other validations
  );
};

const validTabs = tabs.filter(isValidTab);
```

## Error Types

### Tab Content Errors
- **Cause**: Component throws error during render
- **Handling**: ErrorBoundary catches and shows TabErrorFallback
- **Recovery**: Reload tab, go to dashboard, or close tab

### Storage Errors
- **Cause**: Corrupted localStorage data
- **Handling**: Validation detects and removes corrupted tabs
- **Recovery**: Keep valid tabs or create default dashboard tab

### Action Errors
- **Cause**: Tab operation fails (open, close, etc.)
- **Handling**: Try-catch in action, log error, show toast
- **Recovery**: User retries or uses alternative action

### Navigation Errors
- **Cause**: Router navigation fails
- **Handling**: Catch in navigation code, log error
- **Recovery**: Fallback to page reload

## User-Facing Error Messages

### Good Examples ✅
- "Failed to load patient data. Please try again."
- "Your previous tabs could not be restored."
- "You have reached the maximum limit of 15 tabs."

### Bad Examples ❌
- "Error: undefined is not a function"
- "PGRST116: Resource not found"
- "Network request failed with status 500"

## Testing Errors

### Manual Testing

Use the TabErrorTest component:

```tsx
import { TabErrorTest } from '@/components/tabs/TabErrorTest';

// Add to a route for testing
<Route path="/test-error" component={TabErrorTest} />
```

### Simulating Storage Corruption

```tsx
// In browser console
localStorage.setItem('tab-storage', 'invalid json{');
window.location.reload();
```

### Simulating Action Errors

```tsx
// Temporarily modify tabStore.ts
openTab: () => {
  throw new Error('Test error');
}
```

## Common Patterns

### Pattern 1: Async Error Handling

```tsx
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    logTabError(error, { action: 'loadData' });
    throw error; // Re-throw to trigger error boundary
  }
}
```

### Pattern 2: Graceful Degradation

```tsx
function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadData()
      .then(setData)
      .catch(err => {
        setError(err);
        logTabError(err);
      });
  }, []);
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  return <div>{/* Normal content */}</div>;
}
```

### Pattern 3: Validation Before Action

```tsx
function performAction(tab: Tab) {
  // Validate first
  if (!isValidTab(tab)) {
    logTabError(new Error('Invalid tab'), { tabId: tab.id });
    toast({ title: 'Invalid tab data' });
    return;
  }
  
  // Proceed with action
  try {
    // Action logic
  } catch (error) {
    logTabActionError('performAction', error, tab);
  }
}
```

## Debugging Tips

### Enable Detailed Logging

Error details are automatically shown in development mode. Check:
- Browser console for error logs
- Tab context in console groups
- Stack traces in error details

### Check localStorage

```tsx
// In browser console
JSON.parse(localStorage.getItem('tab-storage'))
```

### Monitor Error Boundary

```tsx
// Add to ErrorBoundary
componentDidCatch(error, errorInfo) {
  console.log('Error caught:', error);
  console.log('Error info:', errorInfo);
}
```

## Best Practices

1. **Always validate data** before using it
2. **Use try-catch** in all critical operations
3. **Log errors with context** for debugging
4. **Show user-friendly messages** via toast
5. **Provide recovery options** (reload, close, etc.)
6. **Test error scenarios** during development
7. **Don't expose sensitive data** in error messages
8. **Clean up resources** in error handlers

## Quick Checklist

- [ ] Component errors are caught by ErrorBoundary
- [ ] Storage errors are validated and handled
- [ ] Action errors are caught and logged
- [ ] User sees friendly error messages
- [ ] Recovery options are provided
- [ ] Other tabs remain unaffected
- [ ] Error details logged in dev mode
- [ ] No sensitive data in error messages

## Need Help?

See full documentation: `src/components/tabs/ERROR_HANDLING.md`
