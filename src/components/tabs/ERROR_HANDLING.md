# Tab System Error Handling

This document describes the comprehensive error handling and recovery system implemented for the tab system.

## Overview

The tab system includes robust error handling at multiple levels:
- **Tab Content Errors**: Individual tab errors are isolated using React Error Boundaries
- **Storage Errors**: Corrupted localStorage data is detected and handled gracefully
- **Action Errors**: Tab operations (open, close, reorder) include error handling
- **Navigation Errors**: Failed navigation attempts are caught and logged

## Components

### 1. TabErrorFallback Component

**Location**: `src/components/tabs/TabErrorFallback.tsx`

A specialized error fallback UI for tab content errors. Provides:
- User-friendly error messages
- Reload button to retry loading the tab
- Go to Dashboard button as a safe fallback
- Close Tab button to remove the problematic tab
- Technical details in development mode

**Usage**:
```tsx
<ErrorBoundary
  fallback={(error, resetError) => (
    <TabErrorFallback 
      error={error}
      tabId={tabId}
      onReload={() => {
        resetError();
        reloadTab(tabId);
      }} 
    />
  )}
>
  {children}
</ErrorBoundary>
```

### 2. TabContentArea Component

**Location**: `src/components/tabs/TabContentArea.tsx`

Wraps all tab content in an ErrorBoundary to isolate errors to individual tabs. Features:
- Each tab has its own error boundary
- Errors in one tab don't affect other tabs
- Automatic error recovery with reload functionality
- Preserves scroll position and state of other tabs

## Hooks

### useTabReload Hook

**Location**: `src/hooks/useTabReload.ts`

Provides tab reload functionality:

```tsx
const { reloadTab, reloadCurrentTab, forceReload } = useTabReload();

// Reload a specific tab
reloadTab(tabId);

// Reload the currently active tab
reloadCurrentTab();

// Force reload the entire application (last resort)
forceReload();
```

## Error Logging

### Tab Error Logger

**Location**: `src/lib/tabErrorLogger.ts`

Specialized logging for tab-related errors:

```tsx
import { logTabError, logTabRestorationError, logTabActionError } from '@/lib/tabErrorLogger';

// Log a tab error with context
logTabError(error, {
  tabId: 'tab-123',
  tabPath: '/patients',
  tabTitle: 'Patients',
  activeTabId: 'tab-456',
  totalTabs: 5,
  action: 'openTab'
});

// Log tab restoration errors
logTabRestorationError(error, corruptedData);

// Log tab action errors
logTabActionError('closeTab', error, tab);
```

### Error Types Logged

1. **Tab Content Errors**: Errors thrown by page components
2. **Tab Restoration Errors**: Corrupted localStorage data
3. **Tab Action Errors**: Failed tab operations (open, close, reorder)
4. **Tab Navigation Errors**: Failed route navigation
5. **Tab Persistence Errors**: Failed save/load operations

## Storage Error Handling

### Corrupted Data Detection

The `restoreTabs` action in `tabStore.ts` includes comprehensive validation:

```typescript
// Validate tab structure
const isValidTab = (tab: any): tab is Tab => {
  return (
    tab &&
    typeof tab === 'object' &&
    typeof tab.id === 'string' &&
    typeof tab.path === 'string' &&
    typeof tab.title === 'string' &&
    typeof tab.hasUnsavedChanges === 'boolean' &&
    typeof tab.scrollPosition === 'number' &&
    typeof tab.createdAt === 'number' &&
    typeof tab.lastAccessedAt === 'number'
  );
};

// Filter out invalid tabs
const validTabs = state.tabs.filter(isValidTab);
```

### Recovery Strategies

1. **Partial Corruption**: Remove corrupted tabs, keep valid ones
2. **Complete Corruption**: Clear storage and create default Dashboard tab
3. **Expired Data**: Clear tabs older than 30 days
4. **Missing Active Tab**: Set first tab as active

### User Notifications

Users are informed about storage issues:
- "Tab Restoration Failed" - All tabs corrupted
- "Some Tabs Could Not Be Restored" - Partial corruption
- "Tabs Expired" - Data older than 30 days

## Error Recovery Flow

### Tab Content Error

```
1. Component throws error
   ↓
2. ErrorBoundary catches error
   ↓
3. TabErrorFallback displays
   ↓
4. User clicks "Reload Tab"
   ↓
5. Error boundary resets
   ↓
6. Router navigates to tab path
   ↓
7. Component re-renders
```

### Storage Corruption

```
1. App starts
   ↓
2. restoreTabs() called
   ↓
3. Validation detects corruption
   ↓
4. Log error with details
   ↓
5. Show toast notification
   ↓
6. Clear corrupted data
   ↓
7. Create default Dashboard tab
```

### Action Error

```
1. User performs action (e.g., openTab)
   ↓
2. Try-catch wraps operation
   ↓
3. Error occurs
   ↓
4. Log error with context
   ↓
5. Show toast notification
   ↓
6. Return null/early exit
   ↓
7. App remains stable
```

## Best Practices

### For Component Developers

1. **Throw meaningful errors**:
   ```tsx
   if (!data) {
     throw new Error('Failed to load patient data');
   }
   ```

2. **Use error boundaries**:
   - Tab content is automatically wrapped
   - Add additional boundaries for complex components

3. **Handle async errors**:
   ```tsx
   try {
     await fetchData();
   } catch (error) {
     // Handle or re-throw
     throw new Error('Data fetch failed');
   }
   ```

### For Tab System Developers

1. **Always use try-catch** in tab actions
2. **Log errors** with appropriate context
3. **Show user-friendly messages** via toast
4. **Validate data** before using it
5. **Provide recovery options** (reload, close, go home)

## Testing Error Handling

### Manual Testing

1. **Test tab content errors**:
   - Throw an error in a page component
   - Verify TabErrorFallback displays
   - Click "Reload Tab" and verify recovery

2. **Test storage corruption**:
   - Manually corrupt localStorage data
   - Reload app
   - Verify graceful recovery

3. **Test action errors**:
   - Simulate max tab limit
   - Verify error message displays
   - Verify app remains stable

### Automated Testing

```tsx
describe('Tab Error Handling', () => {
  it('should catch and display tab content errors', () => {
    // Test error boundary
  });

  it('should handle corrupted localStorage data', () => {
    // Test storage validation
  });

  it('should recover from tab action errors', () => {
    // Test action error handling
  });
});
```

## Error Messages

### User-Facing Messages

- **Tab Error**: "An error occurred while loading [tab name]."
- **Restoration Failed**: "Your previous tabs could not be restored."
- **Some Tabs Lost**: "[N] tab(s) were corrupted and have been removed."
- **Tabs Expired**: "Your previous tabs were older than 30 days."
- **Max Tabs**: "You have reached the maximum limit of [N] tabs."
- **Action Failed**: "An error occurred while [action]. Please try again."

### Developer Messages (Console)

- Detailed error information
- Stack traces
- Tab context (ID, path, title)
- Storage data snapshots
- Action details

## Future Enhancements

1. **Error Reporting Service**: Send errors to external service
2. **Error Analytics**: Track error frequency and patterns
3. **Automatic Recovery**: Retry failed operations automatically
4. **Error History**: Show recent errors to users
5. **Custom Error Pages**: Different fallbacks for different error types

## Related Files

- `src/components/tabs/TabErrorFallback.tsx` - Error fallback UI
- `src/components/tabs/TabContentArea.tsx` - Error boundary wrapper
- `src/components/common/ErrorBoundary.tsx` - Base error boundary
- `src/hooks/useTabReload.ts` - Tab reload functionality
- `src/lib/tabErrorLogger.ts` - Error logging utilities
- `src/lib/errorUtils.ts` - General error utilities
- `src/stores/tabStore.ts` - Tab state with error handling
