# useTabNavigation Hook

## Overview

The `useTabNavigation` hook provides navigation utilities that integrate TanStack Router with the tab system. It enables seamless navigation that respects tab context and user preferences, supporting both single-tab and multi-tab navigation patterns.

## Import

```typescript
import { useTabNavigation } from '@/hooks/useTabNavigation';
```

## API Reference

### Return Value

The hook returns an object with the following methods:

#### `navigateToTab(path: string, title?: string, newTab?: boolean): void`

Navigate to a path, creating a new tab or switching to an existing tab.

**Parameters:**
- `path` (string, required): The route path to navigate to (e.g., '/patients')
- `title` (string, optional): Custom title for the tab (defaults to route metadata)
- `newTab` (boolean, optional): Force creation of a new tab even if one exists (default: false)

**Behavior:**
- If `newTab` is false (default):
  - Checks if a tab already exists for the path
  - If exists: switches to that tab
  - If not: creates a new tab
- If `newTab` is true:
  - Always creates a new tab, even if one exists for the path
- Respects the maximum tab limit (won't create tab if limit reached)
- Automatically retrieves title and icon from route metadata if not provided

**Example:**
```typescript
const { navigateToTab } = useTabNavigation();

// Navigate to patients (creates or switches to existing tab)
navigateToTab('/patients');

// Navigate with custom title
navigateToTab('/patients', 'Patient List');

// Force new tab creation
navigateToTab('/patients', undefined, true);
```

---

#### `navigateInCurrentTab(path: string): void`

Navigate within the current active tab without creating a new tab.

**Parameters:**
- `path` (string, required): The route path to navigate to

**Behavior:**
- Updates the current tab's path, title, and icon
- Does not create a new tab
- If no active tab exists, creates one (fallback behavior)
- Updates the tab's `lastAccessedAt` timestamp

**Use Cases:**
- Navigating between related pages in the same workflow
- Drill-down navigation (e.g., from patient list to patient detail)
- Form wizards or multi-step processes

**Example:**
```typescript
const { navigateInCurrentTab } = useTabNavigation();

// Navigate to patient detail in current tab
navigateInCurrentTab('/patients/123');

// Navigate to settings in current tab
navigateInCurrentTab('/settings');
```

---

#### `openInNewTab(path: string, title?: string): void`

Force open a path in a new tab (always creates a new tab).

**Parameters:**
- `path` (string, required): The route path to navigate to
- `title` (string, optional): Custom title for the tab (defaults to route metadata)

**Behavior:**
- Always creates a new tab, regardless of existing tabs
- Equivalent to calling `navigateToTab(path, title, true)`
- Respects the maximum tab limit

**Use Cases:**
- Ctrl+Click or middle-click on links
- "Open in New Tab" context menu option
- Comparing multiple records side-by-side

**Example:**
```typescript
const { openInNewTab } = useTabNavigation();

// Open patients in new tab
openInNewTab('/patients');

// Open with custom title
openInNewTab('/appointments', 'My Appointments');
```

---

#### `getCurrentTab(): Tab | null`

Get the currently active tab information.

**Returns:**
- `Tab` object if a tab is active
- `null` if no tab is active

**Tab Object Properties:**
```typescript
interface Tab {
  id: string;                    // Unique tab identifier
  path: string;                  // Current route path
  title: string;                 // Tab title
  icon?: string;                 // Icon name
  hasUnsavedChanges: boolean;    // Unsaved changes flag
  scrollPosition: number;        // Scroll position
  createdAt: number;             // Creation timestamp
  lastAccessedAt: number;        // Last access timestamp
}
```

**Use Cases:**
- Checking if there are unsaved changes before navigation
- Displaying current tab information in UI
- Conditional navigation based on current tab
- Logging or analytics

**Example:**
```typescript
const { getCurrentTab } = useTabNavigation();

const currentTab = getCurrentTab();
if (currentTab) {
  console.log('Current tab:', currentTab.title);
  console.log('Has unsaved changes:', currentTab.hasUnsavedChanges);
}
```

## Usage Patterns

### Pattern 1: Basic Navigation

```typescript
function NavigationButton() {
  const { navigateToTab } = useTabNavigation();

  return (
    <Button onClick={() => navigateToTab('/patients')}>
      Go to Patients
    </Button>
  );
}
```

### Pattern 2: Ctrl+Click Support

```typescript
function SmartLink({ path, children }: { path: string; children: React.ReactNode }) {
  const { navigateToTab, openInNewTab } = useTabNavigation();

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      openInNewTab(path);
    } else {
      navigateToTab(path);
    }
  };

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}
```

### Pattern 3: Middle-Click Support

```typescript
function LinkWithMiddleClick({ path, children }: { path: string; children: React.ReactNode }) {
  const { navigateToTab, openInNewTab } = useTabNavigation();

  const handleClick = (e: React.MouseEvent) => {
    navigateToTab(path);
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      openInNewTab(path);
    }
  };

  return (
    <button onClick={handleClick} onAuxClick={handleAuxClick}>
      {children}
    </button>
  );
}
```

### Pattern 4: Context Menu

```typescript
function LinkWithContextMenu({ path, children }: { path: string; children: React.ReactNode }) {
  const { navigateToTab, openInNewTab } = useTabNavigation();
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
  };

  return (
    <>
      <button onContextMenu={handleContextMenu}>
        {children}
      </button>
      {showMenu && (
        <ContextMenu>
          <MenuItem onClick={() => navigateToTab(path)}>Open</MenuItem>
          <MenuItem onClick={() => openInNewTab(path)}>Open in New Tab</MenuItem>
        </ContextMenu>
      )}
    </>
  );
}
```

### Pattern 5: Unsaved Changes Check

```typescript
function NavigateWithCheck() {
  const { getCurrentTab, navigateToTab } = useTabNavigation();

  const handleNavigate = (path: string) => {
    const currentTab = getCurrentTab();
    
    if (currentTab?.hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Continue?');
      if (!confirmed) return;
    }
    
    navigateToTab(path);
  };

  return (
    <Button onClick={() => handleNavigate('/patients')}>
      Go to Patients
    </Button>
  );
}
```

### Pattern 6: Conditional Navigation

```typescript
function SmartNavigate() {
  const { getCurrentTab, navigateInCurrentTab, openInNewTab } = useTabNavigation();

  const handleNavigate = (path: string) => {
    const currentTab = getCurrentTab();
    
    // If on dashboard, navigate in same tab
    if (currentTab?.path === '/') {
      navigateInCurrentTab(path);
    } else {
      // Otherwise, open in new tab
      openInNewTab(path);
    }
  };

  return (
    <Button onClick={() => handleNavigate('/patients')}>
      Smart Navigate
    </Button>
  );
}
```

## Integration with Sidebar

The hook is designed to work seamlessly with sidebar navigation:

```typescript
import { Link } from '@tanstack/react-router';
import { useTabNavigation } from '@/hooks/useTabNavigation';

function SidebarLink({ path, icon, label }: SidebarLinkProps) {
  const { navigateToTab, openInNewTab } = useTabNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      openInNewTab(path);
    } else {
      navigateToTab(path);
    }
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      openInNewTab(path);
    }
  };

  return (
    <Link
      to={path}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      className="sidebar-link"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
```

## Requirements Satisfied

This hook satisfies the following requirements from the specification:

- **Requirement 1.1**: Creates new tab instances when navigating to new pages
- **Requirement 1.3**: Switches to existing tabs when clicking on tab bar
- **Requirement 6.3**: Supports middle-click to open in new tab
- **Requirement 6.4**: Supports Ctrl+Click (Cmd+Click on macOS) to open in new tab
- **Requirement 6.5**: Automatically switches active tab to newly created tabs

## Dependencies

- `@tanstack/react-router`: For navigation functionality
- `@/stores/tabStore`: For tab state management
- `@/config/routeMetadata`: For route metadata lookup
- `@/types/tab`: For Tab type definitions

## Notes

- The hook automatically retrieves route metadata (title, icon) from the centralized route registry
- Navigation respects the maximum tab limit configured in the tab store
- All navigation actions update the tab's `lastAccessedAt` timestamp for LRU tracking
- The hook uses `useCallback` for optimal performance and to prevent unnecessary re-renders
- Type safety is maintained through TypeScript, but `navigate({ to: path as any })` is used due to TanStack Router's strict typing

## See Also

- [TabStore Documentation](../stores/tabStore.ts)
- [Route Metadata Configuration](../config/routeMetadata.ts)
- [Tab System Provider](../components/tabs/TabSystemProvider.tsx)
- [Usage Examples](./useTabNavigation.example.tsx)
