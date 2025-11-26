# TabContentArea Component

## Overview

The `TabContentArea` component is responsible for rendering the content of all open tabs in the tab system. It implements a key performance optimization: keeping inactive tabs mounted in the DOM but hidden with CSS `display:none`. This approach preserves component state, form data, and scroll positions while providing instant tab switching.

## Key Features

### 1. Keep Tabs Mounted
- All tab contents remain mounted in the DOM
- Inactive tabs are hidden with CSS `display:none`
- Preserves component state, form inputs, and scroll position
- Enables instant tab switching without re-mounting overhead

### 2. Isolated Error Handling
- Each tab content is wrapped in its own `ErrorBoundary`
- Errors in one tab don't affect other tabs
- Custom error fallback UI with reload functionality
- Development mode shows detailed error information

### 3. Scroll Position Management
- Automatically saves scroll position when switching away from a tab
- Restores scroll position when switching back to a tab
- Uses `requestAnimationFrame` for smooth restoration
- Scroll position is persisted in the tab store

### 4. Accessibility
- Proper ARIA attributes (`role="tabpanel"`, `aria-hidden`, etc.)
- Each tab panel is associated with its tab via `aria-labelledby`
- Screen reader friendly with proper semantic structure

## Architecture

```
TabContentArea
├── TabContent (for each tab)
│   ├── ErrorBoundary
│   │   └── TabErrorFallback (on error)
│   └── Page Component (actual content)
```

## Component Structure

### TabContentArea (Main Component)
- Renders a container for all tab contents
- Maps over all tabs from the store
- Passes active state to each TabContent wrapper

### TabContent (Wrapper Component)
- Manages scroll position save/restore
- Handles visibility (display:none for inactive tabs)
- Wraps content in ErrorBoundary
- Provides reload functionality

### TabErrorFallback (Error UI)
- Displays user-friendly error message
- Shows error details in development mode
- Provides "Reload Tab" button
- Isolated to individual tab

## Usage

```tsx
import { TabContentArea } from '@/components/tabs';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <TabBar />
      <TabContentArea className="flex-1" />
    </div>
  );
}
```

## Props

### TabContentArea

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes for the container |

## Scroll Position Management

The component automatically manages scroll positions for each tab:

1. **Save on Tab Switch**: When a tab becomes inactive, its current scroll position is saved to the tab store
2. **Restore on Tab Activate**: When a tab becomes active, its saved scroll position is restored
3. **Smooth Restoration**: Uses `requestAnimationFrame` to ensure DOM is ready before restoring scroll

```typescript
// Save scroll position when tab becomes inactive
useEffect(() => {
  if (!isActive && contentRef.current) {
    const scrollPosition = contentRef.current.scrollTop;
    updateTabMetadata(tabId, { scrollPosition });
  }
}, [isActive, tabId, updateTabMetadata]);

// Restore scroll position when tab becomes active
useEffect(() => {
  if (isActive && contentRef.current && tab) {
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = tab.scrollPosition;
      }
    });
  }
}, [isActive, tab]);
```

## Error Handling

Each tab has isolated error handling:

### Error Boundary Per Tab
- Errors in one tab don't crash other tabs
- Custom fallback UI specific to tab errors
- Reload functionality to recover from errors

### Error Fallback UI
- User-friendly error message
- Reload button to retry
- Development mode shows detailed error information
- Maintains tab system functionality

```tsx
<ErrorBoundary
  fallback={(error, resetError) => (
    <TabErrorFallback 
      error={error} 
      onReload={() => {
        resetError();
        onReload();
      }} 
    />
  )}
>
  {children}
</ErrorBoundary>
```

## Performance Considerations

### Why Keep Tabs Mounted?

**Advantages:**
- ✅ Instant tab switching (no re-mount)
- ✅ Preserves component state
- ✅ Maintains form inputs
- ✅ Keeps scroll position
- ✅ Better user experience

**Trade-offs:**
- ⚠️ Higher memory usage
- ⚠️ All tabs consume resources

**Mitigation:**
- Maximum tab limit (15 by default)
- Future: Lazy unmounting after inactivity period

### Memory Management

For desktop applications, keeping 10-15 tabs mounted is acceptable:
- Modern systems have sufficient memory
- Desktop apps can use more resources than web apps
- User experience benefits outweigh memory cost

Future optimization (not in initial implementation):
- Unmount tabs inactive for > 5 minutes
- Serialize and restore state on demand
- Configurable in settings

## Integration with Router

The TabContentArea is designed to work with TanStack Router:

```tsx
// Current placeholder implementation
<TabContent>
  <div className="p-4">
    <h2>{tab.title}</h2>
    <p>Content for {tab.path}</p>
  </div>
</TabContent>

// Future implementation (Task 8: TabSystemProvider)
<TabContent>
  <RouterOutlet path={tab.path} />
</TabContent>
```

## Accessibility

The component follows WCAG 2.1 guidelines:

### ARIA Attributes
- `role="tabpanel"` - Identifies the content area
- `id="tabpanel-{tabId}"` - Unique identifier
- `aria-labelledby="tab-{tabId}"` - Associates with tab
- `aria-hidden={!isActive}` - Indicates visibility state

### Keyboard Navigation
- Tab switching handled by TabBar component
- Content area is scrollable with keyboard
- Focus management preserved per tab

## Testing

### Manual Testing
1. Open multiple tabs
2. Scroll down in a tab
3. Switch to another tab
4. Switch back - scroll position should be restored
5. Trigger an error in one tab - other tabs should work
6. Reload errored tab - should recover

### Automated Testing
```typescript
describe('TabContentArea', () => {
  it('renders all tabs but only shows active tab', () => {
    // Test visibility logic
  });

  it('preserves scroll position on tab switch', () => {
    // Test scroll restoration
  });

  it('isolates errors to individual tabs', () => {
    // Test error boundaries
  });
});
```

## Future Enhancements

### Lazy Unmounting (Not in Initial Implementation)
- Unmount tabs inactive for > 5 minutes
- Serialize state before unmounting
- Restore state on tab activation
- Configurable timeout in settings

### State Persistence
- Save form state to localStorage
- Restore on app restart
- Configurable per page type

### Performance Monitoring
- Track memory usage per tab
- Monitor tab switching performance
- Alert on excessive resource usage

## Related Components

- **TabBar**: Displays tabs and handles tab selection
- **Tab**: Individual tab component
- **TabStore**: Manages tab state and metadata
- **ErrorBoundary**: Catches and handles React errors

## Requirements Satisfied

This component satisfies the following requirements from the spec:

- **Requirement 1.4**: Maintains state of inactive tabs while other tabs are active
- **Requirement 1.5**: Supports minimum of 10 concurrent tab instances

## Design Decisions

### Why CSS display:none Instead of Conditional Rendering?

**Option 1: Conditional Rendering**
```tsx
{isActive && <PageComponent />}
```
- ❌ Re-mounts component on every tab switch
- ❌ Loses component state
- ❌ Loses scroll position
- ❌ Slower tab switching

**Option 2: CSS display:none (Chosen)**
```tsx
<div style={{ display: isActive ? 'block' : 'none' }}>
  <PageComponent />
</div>
```
- ✅ Keeps component mounted
- ✅ Preserves state
- ✅ Maintains scroll position
- ✅ Instant tab switching

### Why Error Boundary Per Tab?

- Isolates errors to individual tabs
- Prevents one broken tab from crashing the app
- Provides better user experience
- Allows recovery without losing other tabs

## Example: Complete Tab System

```tsx
import { TabBar, TabContentArea } from '@/components/tabs';

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Title bar */}
      <TauriTitleBar />
      
      {/* Tab bar */}
      <TabBar />
      
      {/* Tab content area */}
      <TabContentArea className="flex-1" />
    </div>
  );
}
```

## Troubleshooting

### Scroll Position Not Restoring
- Check that `contentRef` is properly attached
- Verify `requestAnimationFrame` is being used
- Ensure scroll position is being saved to store

### Tabs Not Hiding
- Verify `isActive` prop is correct
- Check CSS classes are applied
- Ensure `display:none` is in the className

### Error Boundary Not Catching Errors
- Verify ErrorBoundary is wrapping the content
- Check that errors are being thrown in render
- Ensure fallback component is provided

## Notes

- The current implementation uses placeholder content
- Task 8 (TabSystemProvider) will integrate with TanStack Router
- Task 8 will handle actual page rendering per tab
- This component focuses on the container and lifecycle management
