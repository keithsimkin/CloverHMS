# Tab System Quick Reference

## Import

```typescript
import { TabSystemProvider } from '@/components/tabs';
```

## Basic Usage

```tsx
<TabSystemProvider>
  <RouterProvider router={router} />
</TabSystemProvider>
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + T` | New tab (Dashboard) |
| `Ctrl/Cmd + W` | Close active tab |
| `Ctrl/Cmd + Tab` | Next tab |
| `Ctrl/Cmd + Shift + Tab` | Previous tab |
| `Ctrl/Cmd + 1-9` | Switch to tab 1-9 |

## Tab Store API

```typescript
import { useTabStore } from '@/stores/tabStore';

const {
  tabs,              // Tab[] - All open tabs
  activeTabId,       // string | null - Active tab ID
  maxTabs,           // number - Max tab limit (default: 15)
  
  // Core actions
  openTab,           // (path, title?, icon?) => string | null
  closeTab,          // (tabId) => void
  setActiveTab,      // (tabId) => void
  clearAllTabs,      // () => void
  
  // Advanced actions
  reorderTabs,       // (fromIndex, toIndex) => void
  duplicateTab,      // (tabId) => void
  closeOtherTabs,    // (tabId) => void
  closeTabsToRight,  // (tabId) => void
  updateTabMetadata, // (tabId, updates) => void
  
  // Persistence
  restoreTabs,       // () => void
} = useTabStore();
```

## Tab Interface

```typescript
interface Tab {
  id: string;                    // Unique identifier
  path: string;                  // Route path
  title: string;                 // Display title
  icon?: string;                 // Icon name
  hasUnsavedChanges: boolean;    // Unsaved indicator
  scrollPosition: number;        // Scroll position
  createdAt: number;             // Creation timestamp
  lastAccessedAt: number;        // Last access timestamp
}
```

## Route Metadata

```typescript
import { getRouteMetadata, getDefaultRoute } from '@/config/routeMetadata';

// Get metadata for a route
const metadata = getRouteMetadata('/patients');
// { path: '/patients', title: 'Patients', icon: 'UserGroupIcon', requiresAuth: true }

// Get default route (Dashboard)
const defaultRoute = getDefaultRoute();
// { path: '/', title: 'Dashboard', icon: 'HomeIcon', requiresAuth: true }
```

## Common Patterns

### Open a Tab Programmatically

```typescript
const { openTab } = useTabStore();

// With metadata lookup
const metadata = getRouteMetadata('/patients');
openTab('/patients', metadata?.title, metadata?.icon);

// With explicit title
openTab('/patients', 'Patient List');

// Simple (uses metadata registry)
openTab('/patients');
```

### Close Current Tab

```typescript
const { activeTabId, closeTab } = useTabStore();

if (activeTabId) {
  closeTab(activeTabId);
}
```

### Switch to a Specific Tab

```typescript
const { tabs, setActiveTab } = useTabStore();

// Find tab by path
const patientTab = tabs.find(tab => tab.path === '/patients');
if (patientTab) {
  setActiveTab(patientTab.id);
}

// Switch to first tab
if (tabs.length > 0) {
  setActiveTab(tabs[0].id);
}
```

### Update Tab Metadata

```typescript
const { updateTabMetadata } = useTabStore();

// Mark tab as having unsaved changes
updateTabMetadata(tabId, { hasUnsavedChanges: true });

// Update scroll position
updateTabMetadata(tabId, { scrollPosition: 500 });

// Update title
updateTabMetadata(tabId, { title: 'Patient Details - John Doe' });
```

### Check Tab Limit

```typescript
const { tabs, maxTabs } = useTabStore();

const canOpenNewTab = tabs.length < maxTabs;
const isApproachingLimit = tabs.length >= maxTabs - 3;
const isAtLimit = tabs.length >= maxTabs;
```

## Component Props

### TabSystemProvider

```typescript
interface TabSystemProviderProps {
  children: ReactNode;  // Router provider and app content
}
```

### TabBar

```typescript
interface TabBarProps {
  className?: string;  // Optional CSS classes
}
```

### TabContentArea

```typescript
interface TabContentAreaProps {
  className?: string;  // Optional CSS classes
  children?: ReactNode; // Router outlet content
}
```

### Tab

```typescript
interface TabProps {
  tab: Tab;                           // Tab data
  isActive: boolean;                  // Active state
  onSelect: () => void;               // Click handler
  onClose: () => void;                // Close handler
  onDuplicate: () => void;            // Duplicate handler
  onCloseOthers: () => void;          // Close others handler
  onCloseToRight: () => void;         // Close to right handler
  isOnlyTab: boolean;                 // Is only tab
  isRightmostTab: boolean;            // Is rightmost tab
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: () => void;
}
```

## Persistence

### Storage Key

```typescript
'tab-storage' // localStorage key
```

### Storage Format

```typescript
{
  "state": {
    "tabs": [...],
    "activeTabId": "...",
    "maxTabs": 15
  },
  "version": 1
}
```

### Retention

- **Duration**: 30 days
- **Validation**: On app start
- **Fallback**: Default Dashboard tab

## Configuration

### Change Max Tabs

```typescript
// In src/stores/tabStore.ts
const MAX_TABS_DEFAULT = 20; // Change from 15
```

### Change Retention Period

```typescript
// In src/stores/tabStore.ts
const RETENTION_DAYS = 60; // Change from 30
```

### Disable Persistence

```typescript
// In src/stores/tabStore.ts
export const useTabStore = create<TabState>()(
  // Remove persist() wrapper
  (set, get) => ({ /* ... */ })
);
```

## Troubleshooting

### Tabs Not Showing

```typescript
// Check if TabSystemProvider wraps RouterProvider
<TabSystemProvider>
  <RouterProvider router={router} />
</TabSystemProvider>
```

### Tabs Not Persisting

```typescript
// Clear localStorage and restart
localStorage.removeItem('tab-storage');
```

### Keyboard Shortcuts Not Working

```typescript
// Check if focus is on input field
// Shortcuts are disabled in input/textarea elements
```

### Navigation Not Working

```typescript
// Verify route exists in route registry
import { isValidRoute } from '@/config/routeMetadata';
console.log(isValidRoute('/patients')); // true
```

## Files

- **Provider**: `src/components/tabs/TabSystemProvider.tsx`
- **Store**: `src/stores/tabStore.ts`
- **Metadata**: `src/config/routeMetadata.ts`
- **Types**: `src/types/tab.ts`
- **Docs**: `src/components/tabs/TAB_SYSTEM_PROVIDER.md`

## Related Tasks

- ✅ Task 1-7: Core tab components
- ✅ Task 8: TabSystemProvider (current)
- ⏳ Task 9: Keyboard shortcuts (done in provider)
- ⏳ Task 10: useTabNavigation hook
- ⏳ Task 11: Sidebar navigation updates
- ⏳ Task 12: Final integration

## Support

For detailed documentation, see:
- [TAB_SYSTEM_PROVIDER.md](./TAB_SYSTEM_PROVIDER.md)
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
