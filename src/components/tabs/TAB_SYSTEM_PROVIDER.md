# TabSystemProvider Component

## Overview

The `TabSystemProvider` is the top-level component that wraps the entire application to provide browser-like tab functionality. It orchestrates the tab system by initializing the tab store, restoring persisted tabs, rendering the tab bar and content area, and intercepting navigation events.

## Features

### 1. Tab Initialization & Restoration
- Automatically calls `restoreTabs()` on mount to restore previously open tabs from localStorage
- Validates persisted data (30-day retention, schema version)
- Falls back to default dashboard tab if no valid persisted data exists

### 2. Navigation Interception
- Listens to TanStack Router navigation events
- Automatically creates tabs for new routes or switches to existing tabs
- Skips tab creation for the login page
- Uses route metadata registry for consistent tab titles and icons

### 3. Router Synchronization
- Keeps the active tab in sync with the browser URL
- Navigates the router when the active tab changes
- Ensures the displayed content matches the active tab

### 4. Global Keyboard Shortcuts

The provider registers the following keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + T` | Open new tab (Dashboard) |
| `Ctrl/Cmd + W` | Close active tab |
| `Ctrl/Cmd + Tab` | Switch to next tab |
| `Ctrl/Cmd + Shift + Tab` | Switch to previous tab |
| `Ctrl/Cmd + 1-9` | Switch to tab by index (1-9) |

**Note:** These shortcuts override browser defaults to provide app-specific behavior.

## Usage

### Basic Integration

Wrap your router provider with `TabSystemProvider`:

```tsx
import { TabSystemProvider } from '@/components/tabs';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

function App() {
  return (
    <TabSystemProvider>
      <RouterProvider router={router} />
    </TabSystemProvider>
  );
}
```

### With Additional Providers

The tab system works alongside other providers:

```tsx
import { TabSystemProvider } from '@/components/tabs';
import { RouterProvider } from '@tanstack/react-router';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <TabSystemProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TabSystemProvider>
    </ErrorBoundary>
  );
}
```

## Component Structure

```
TabSystemProvider
├── TabBar (horizontal tab strip)
│   ├── Tab (multiple instances)
│   ├── Scroll buttons (when needed)
│   ├── Tab count indicator (when approaching limit)
│   └── New tab button
└── TabContentArea (content container)
    └── TabContent (multiple instances, only active visible)
        └── ErrorBoundary
            └── Router Outlet (page content)
```

## Navigation Interception Logic

### How It Works

1. **Route Change Detection**: The provider listens to `routerState.location.pathname`
2. **Metadata Lookup**: Retrieves route metadata (title, icon) from the route registry
3. **Tab Creation/Switching**: 
   - If a tab already exists for the path → switches to it
   - If no tab exists → creates a new tab (respecting max limit)
4. **Router Sync**: When active tab changes, navigates the router to match

### Special Cases

- **Login Page**: No tab is created for `/login` route
- **Unknown Routes**: Routes without metadata still create tabs with fallback titles
- **Max Tab Limit**: Shows warning toast when limit is reached

## Keyboard Shortcut Implementation

### Platform Detection

The provider detects the user's platform to use the correct modifier key:
- **macOS**: Uses `Cmd` key (`metaKey`)
- **Windows/Linux**: Uses `Ctrl` key (`ctrlKey`)

### Event Handling

All keyboard shortcuts:
- Call `e.preventDefault()` to override browser defaults
- Are registered on the `window` object for global access
- Clean up event listeners on unmount

### Shortcut Behavior

**Open New Tab (Ctrl/Cmd + T)**:
- Always opens the Dashboard route
- Switches to existing Dashboard tab if one exists
- Respects max tab limit

**Close Tab (Ctrl/Cmd + W)**:
- Closes the currently active tab
- Automatically switches to the nearest remaining tab
- Creates default Dashboard tab if closing the last tab

**Tab Navigation (Ctrl/Cmd + Tab)**:
- Cycles through tabs in order
- Wraps around from last to first tab
- Updates `lastAccessedAt` timestamp

**Tab by Index (Ctrl/Cmd + 1-9)**:
- Switches to tab at the specified index (0-based)
- Ignores if index is out of bounds
- Provides quick access to first 9 tabs

## State Management

### Tab Store Integration

The provider uses the following tab store actions:

- `restoreTabs()`: Initialize tabs from localStorage
- `openTab(path, title, icon)`: Create or switch to a tab
- `closeTab(tabId)`: Close a specific tab
- `setActiveTab(tabId)`: Switch to a different tab

### State Synchronization

The provider maintains synchronization between:
1. **Tab Store**: Source of truth for open tabs
2. **Router State**: Current URL and navigation
3. **Browser History**: Back/forward navigation (optional)

## Error Handling

### Tab Restoration Errors

If persisted tab data is corrupted or expired:
- Logs error to console
- Clears corrupted data
- Creates default Dashboard tab
- User sees no error UI (graceful fallback)

### Navigation Errors

If navigation to a tab's path fails:
- Error is caught by the tab's ErrorBoundary
- Only the affected tab shows error UI
- Other tabs remain functional
- User can reload the tab or close it

## Performance Considerations

### Optimization Strategies

1. **Selective Re-rendering**: Only active tab content is visible (CSS `display: none`)
2. **Event Listener Cleanup**: All event listeners are properly cleaned up
3. **Debounced Navigation**: Navigation events are handled efficiently
4. **Memoization**: Tab components use React.memo to prevent unnecessary re-renders

### Memory Management

- Inactive tabs remain mounted to preserve state
- Scroll positions are saved/restored automatically
- Form state is maintained across tab switches
- Optional: Implement lazy unmounting for tabs inactive > 5 minutes

## Integration with Existing Features

### TauriTitleBar

The tab bar is positioned below the Tauri title bar:
- Title bar height: 32px
- Tab bar height: 40px
- Content area: Remaining viewport height

### ProtectedRoute

The tab system works seamlessly with authentication:
- Protected routes are checked before tab creation
- Unauthorized access redirects to login (no tab created)
- Tab permissions are validated on tab switch

### GlobalKeyboardShortcuts

Tab shortcuts are registered separately from global shortcuts:
- No conflicts with existing shortcuts
- Tab shortcuts take precedence when applicable
- Both systems can coexist

## Testing

### Unit Tests

Test the provider's core functionality:
- Tab initialization and restoration
- Navigation interception
- Keyboard shortcut handling
- Router synchronization

### Integration Tests

Test the provider with the full app:
- Tab creation from sidebar navigation
- Tab switching with keyboard shortcuts
- Tab persistence across app restarts
- Error handling in tabs

### E2E Tests

Test real user workflows:
- Open multiple pages in tabs
- Switch between tabs while editing forms
- Close tabs and reopen application
- Use keyboard shortcuts for tab management

## Troubleshooting

### Tabs Not Restoring

**Problem**: Tabs don't restore after app restart

**Solutions**:
1. Check browser console for localStorage errors
2. Verify `restoreTabs()` is called on mount
3. Check if persisted data is within 30-day retention
4. Clear localStorage and restart app

### Navigation Not Working

**Problem**: Clicking tabs doesn't navigate

**Solutions**:
1. Verify router is properly configured
2. Check if routes exist in route registry
3. Ensure ProtectedRoute is not blocking navigation
4. Check browser console for navigation errors

### Keyboard Shortcuts Not Working

**Problem**: Shortcuts don't respond

**Solutions**:
1. Check if another element has focus and is capturing events
2. Verify event listeners are registered (check in React DevTools)
3. Test with different modifier keys (Ctrl vs Cmd)
4. Check for conflicts with browser shortcuts

### Memory Issues

**Problem**: App becomes slow with many tabs

**Solutions**:
1. Reduce max tab limit in settings
2. Close unused tabs
3. Implement lazy unmounting for inactive tabs
4. Profile with Chrome DevTools to identify memory leaks

## Future Enhancements

Potential improvements for the tab system:

1. **Tab Pinning**: Pin frequently used tabs to prevent closure
2. **Tab Groups**: Organize related tabs into collapsible groups
3. **Tab Search**: Quick search/filter through open tabs
4. **Split View**: View two tabs side-by-side
5. **Tab Sync**: Sync open tabs across devices (requires backend)
6. **Custom Tab Colors**: Color-code tabs by category
7. **Tab Bookmarks**: Save tab sessions for later restoration
8. **Lazy Unmounting**: Automatically unmount inactive tabs after timeout

## API Reference

### Props

```typescript
interface TabSystemProviderProps {
  children: ReactNode;  // Router provider and app content
}
```

### Dependencies

- `@tanstack/react-router`: For navigation and routing
- `zustand`: For tab state management
- `@/stores/tabStore`: Tab store with persistence
- `@/config/routeMetadata`: Route metadata registry

### Exports

```typescript
export { TabSystemProvider } from './TabSystemProvider';
```

## Related Components

- **TabBar**: Horizontal tab strip with scroll and new tab button
- **Tab**: Individual tab component with drag-and-drop
- **TabContentArea**: Container for tab content with error boundaries
- **TabContextMenu**: Right-click context menu for tab actions

## Related Documentation

- [Tab Store](../../stores/tabStore.ts) - State management
- [Route Metadata](../../config/routeMetadata.ts) - Route registry
- [Design Document](../../../.kiro/specs/app-tab-system/design.md) - Architecture
- [Requirements](../../../.kiro/specs/app-tab-system/requirements.md) - Feature requirements
