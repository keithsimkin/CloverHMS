# TabSystemProvider Integration Guide

## Quick Start

This guide shows how to integrate the TabSystemProvider into your application.

## Step 1: Update App.tsx

Replace the current App.tsx with the tab-enabled version:

```tsx
import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalKeyboardShortcuts } from '@/components/common/GlobalKeyboardShortcuts';
import { TabSystemProvider } from '@/components/tabs';
import { useThemeStore } from '@/stores/themeStore';

function App() {
  const { theme } = useThemeStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <TabSystemProvider>
        <RouterProvider router={router} />
      </TabSystemProvider>
      <Toaster />
      <GlobalKeyboardShortcuts />
    </ErrorBoundary>
  );
}

export default App;
```

## Step 2: Update MainLayout (Optional)

If you want the tab bar to be part of the main layout, you can adjust the MainLayout component:

```tsx
import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { TauriTitleBar } from './TauriTitleBar';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MainLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function MainLayout({ children, breadcrumbs, className }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <TauriTitleBar />
      {/* Adjust padding-top to account for both title bar and tab bar */}
      <div className="pt-20"> {/* 32px title bar + 40px tab bar */}
        <AppSidebar />
      </div>
      <SidebarInset className="pt-20">
        <Header breadcrumbs={breadcrumbs} />
        <main className={cn('flex-1 overflow-y-auto p-4 sm:p-6', className)}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## Step 3: Test the Integration

1. **Start the app**: Run `pnpm tauri:dev`
2. **Open a tab**: Navigate to any page (e.g., Patients)
3. **Open another tab**: Use `Ctrl+T` or click a different sidebar link
4. **Switch tabs**: Click on tabs or use `Ctrl+Tab`
5. **Close a tab**: Click the X button or use `Ctrl+W`
6. **Restart the app**: Your tabs should be restored

## Keyboard Shortcuts

Once integrated, these shortcuts will be available:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + T` | Open new Dashboard tab |
| `Ctrl/Cmd + W` | Close active tab |
| `Ctrl/Cmd + Tab` | Next tab |
| `Ctrl/Cmd + Shift + Tab` | Previous tab |
| `Ctrl/Cmd + 1-9` | Switch to tab 1-9 |

## Navigation Behavior

### Default Click
- Clicking a sidebar link navigates in the current tab
- If a tab already exists for that route, it switches to it
- If no tab exists, it creates a new one (up to max limit)

### Ctrl/Cmd + Click (Future Enhancement)
- Opens the link in a new tab
- Requires updating sidebar Link components (Task 11)

### Middle Click (Future Enhancement)
- Opens the link in a new tab
- Requires updating sidebar Link components (Task 11)

## Troubleshooting

### Tabs Not Appearing

**Problem**: Tab bar doesn't show up

**Solution**: 
- Verify TabSystemProvider wraps RouterProvider
- Check browser console for errors
- Ensure tab store is initialized

### Content Not Rendering

**Problem**: Tab content is blank

**Solution**:
- Verify RouterProvider is inside TabSystemProvider
- Check that routes are properly configured
- Ensure ProtectedRoute is working correctly

### Keyboard Shortcuts Not Working

**Problem**: Shortcuts don't respond

**Solution**:
- Check if focus is on an input field (shortcuts are disabled in inputs)
- Verify no browser extensions are intercepting shortcuts
- Test with different modifier keys (Ctrl vs Cmd)

### Tabs Not Persisting

**Problem**: Tabs don't restore after restart

**Solution**:
- Check localStorage is enabled in browser
- Verify no errors in console during restoration
- Clear localStorage and restart: `localStorage.clear()`

## Advanced Configuration

### Changing Max Tabs

Update the tab store default:

```typescript
// In src/stores/tabStore.ts
const MAX_TABS_DEFAULT = 20; // Change from 15 to 20
```

### Changing Retention Period

Update the retention constant:

```typescript
// In src/stores/tabStore.ts
const RETENTION_DAYS = 60; // Change from 30 to 60 days
```

### Disabling Tab Persistence

Remove the persist middleware from the tab store:

```typescript
// In src/stores/tabStore.ts
export const useTabStore = create<TabState>()(
  // Remove persist() wrapper
  (set, get) => ({
    // ... store implementation
  })
);
```

## Next Steps

After integrating the TabSystemProvider, you can:

1. **Task 9**: Implement keyboard shortcuts for tab management (already done in provider)
2. **Task 10**: Create useTabNavigation hook for programmatic navigation
3. **Task 11**: Update sidebar navigation for Ctrl+Click and middle-click support
4. **Task 12**: Final integration with App.tsx and router

## Related Documentation

- [TabSystemProvider Documentation](./TAB_SYSTEM_PROVIDER.md)
- [Tab Store Documentation](../../stores/tabStore.ts)
- [Design Document](../../../.kiro/specs/app-tab-system/design.md)
