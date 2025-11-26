# useTabNavigation Integration Guide

## Overview

This document explains how the `useTabNavigation` hook integrates with the tab system and how it should be used in upcoming tasks.

## Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components (Sidebar, Links, Buttons, etc.)          │  │
│  │                                                       │  │
│  │  Uses: useTabNavigation()                            │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useTabNavigation Hook                               │  │
│  │  - navigateToTab()                                   │  │
│  │  - navigateInCurrentTab()                            │  │
│  │  - openInNewTab()                                    │  │
│  │  - getCurrentTab()                                   │  │
│  └──────────────┬───────────────────┬───────────────────┘  │
│                 │                   │                        │
│                 ▼                   ▼                        │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │  TabStore (Zustand)  │  │  TanStack Router         │   │
│  │  - openTab()         │  │  - useNavigate()         │   │
│  │  - setActiveTab()    │  │  - navigate()            │   │
│  │  - updateTabMetadata │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. Sidebar Navigation (Task 11)

The hook will be used in Task 11 to update sidebar navigation:

```typescript
// src/components/layout/Sidebar.tsx
import { useTabNavigation } from '@/hooks/useTabNavigation';

function SidebarLink({ path, label, icon }) {
  const { navigateToTab, openInNewTab } = useTabNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Ctrl+Click or Cmd+Click opens in new tab
    if (e.ctrlKey || e.metaKey) {
      openInNewTab(path);
    } else {
      navigateToTab(path);
    }
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    // Middle mouse button opens in new tab
    if (e.button === 1) {
      e.preventDefault();
      openInNewTab(path);
    }
  };

  return (
    <Link
      to={path}
      onClick={handleClick}
      onAuxClick={handleMiddleClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
```

### 2. Context Menu (Already Implemented)

The TabContextMenu component can use this hook for navigation:

```typescript
// src/components/tabs/TabContextMenu.tsx
import { useTabNavigation } from '@/hooks/useTabNavigation';

function TabContextMenu({ tab }) {
  const { openInNewTab } = useTabNavigation();

  const handleDuplicate = () => {
    // Open the same path in a new tab
    openInNewTab(tab.path, tab.title);
  };

  return (
    <ContextMenu>
      <MenuItem onClick={handleDuplicate}>Duplicate Tab</MenuItem>
      {/* Other menu items */}
    </ContextMenu>
  );
}
```

### 3. Keyboard Shortcuts (Already Implemented)

The GlobalKeyboardShortcuts component already uses TanStack Router's useNavigate, but could be enhanced with tab awareness:

```typescript
// src/components/common/GlobalKeyboardShortcuts.tsx
import { useTabNavigation } from '@/hooks/useTabNavigation';

function GlobalKeyboardShortcuts() {
  const { openInNewTab } = useTabNavigation();

  useKeyboardShortcut('ctrl+t', () => {
    openInNewTab('/'); // Open dashboard in new tab
  });

  // Other shortcuts...
}
```

### 4. Page Components

Page components can use the hook for internal navigation:

```typescript
// Example: Patient list navigating to patient detail
function PatientList() {
  const { navigateInCurrentTab } = useTabNavigation();

  const handlePatientClick = (patientId: string) => {
    // Navigate to patient detail in the same tab
    navigateInCurrentTab(`/patients/${patientId}`);
  };

  return (
    <div>
      {patients.map(patient => (
        <button onClick={() => handlePatientClick(patient.id)}>
          {patient.name}
        </button>
      ))}
    </div>
  );
}
```

### 5. Unsaved Changes Detection (Task 13)

The hook can be used with unsaved changes detection:

```typescript
// Example: Form with unsaved changes
function PatientForm() {
  const { getCurrentTab } = useTabNavigation();
  const { updateTabMetadata } = useTabStore();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const currentTab = getCurrentTab();
    if (currentTab) {
      updateTabMetadata(currentTab.id, { hasUnsavedChanges: isDirty });
    }
  }, [isDirty, getCurrentTab, updateTabMetadata]);

  // Form implementation...
}
```

## Usage in Upcoming Tasks

### Task 11: Update sidebar navigation for tab support

**What to do:**
1. Import `useTabNavigation` in Sidebar.tsx
2. Add click handlers for Ctrl+Click and middle-click
3. Add right-click context menu with "Open in New Tab" option
4. Use `navigateToTab` for default clicks
5. Use `openInNewTab` for Ctrl+Click and middle-click

**Files to modify:**
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/AppSidebar.tsx` (if exists)

### Task 12: Integrate TabSystem with App.tsx and router

**What to do:**
1. Ensure TabSystemProvider is wrapping the router
2. Test that navigation works correctly with tabs
3. Verify that the hook works in all page components

**Files to modify:**
- `src/App.tsx`
- Test various page components

### Task 13: Implement unsaved changes detection

**What to do:**
1. Create `useUnsavedChanges` hook that uses `getCurrentTab` and `updateTabMetadata`
2. Integrate with form components
3. Add confirmation dialog when closing tabs with unsaved changes

**Files to create:**
- `src/hooks/useUnsavedChanges.ts`

## Best Practices

### 1. Default Navigation Pattern

For most navigation, use `navigateToTab` without the `newTab` parameter:

```typescript
const { navigateToTab } = useTabNavigation();

// This will switch to existing tab or create new one
navigateToTab('/patients');
```

### 2. Forced New Tab Pattern

Only use `openInNewTab` when you explicitly want a new tab:

```typescript
const { openInNewTab } = useTabNavigation();

// Always creates a new tab
openInNewTab('/patients');
```

### 3. Same-Tab Navigation Pattern

Use `navigateInCurrentTab` for drill-down navigation:

```typescript
const { navigateInCurrentTab } = useTabNavigation();

// Navigate within the same tab (e.g., list to detail)
navigateInCurrentTab(`/patients/${patientId}`);
```

### 4. Current Tab Information Pattern

Use `getCurrentTab` to get information about the active tab:

```typescript
const { getCurrentTab } = useTabNavigation();

const currentTab = getCurrentTab();
if (currentTab?.hasUnsavedChanges) {
  // Show warning
}
```

## Testing Checklist

When implementing tasks that use this hook, verify:

- [ ] Default click navigates to tab (creates or switches)
- [ ] Ctrl+Click opens in new tab
- [ ] Cmd+Click (Mac) opens in new tab
- [ ] Middle-click opens in new tab
- [ ] Right-click shows context menu with "Open in New Tab"
- [ ] Navigation respects max tab limit
- [ ] Tab metadata (title, icon) is correctly set
- [ ] Active tab switches to newly created tabs
- [ ] `navigateInCurrentTab` updates current tab's path
- [ ] `getCurrentTab` returns correct tab information

## Requirements Mapping

This hook satisfies the following requirements:

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| 1.1 | Create new tab on navigation | `navigateToTab()` with newTab=false |
| 1.3 | Switch to existing tab | `navigateToTab()` checks for existing tabs |
| 6.3 | Middle-click opens new tab | `openInNewTab()` in onAuxClick handler |
| 6.4 | Ctrl+Click opens new tab | `openInNewTab()` in onClick with ctrlKey check |
| 6.5 | Switch to newly created tabs | `openTab()` automatically sets active tab |

## Next Steps

1. **Task 11**: Implement sidebar navigation with this hook
2. **Task 12**: Integrate with App.tsx and test end-to-end
3. **Task 13**: Create unsaved changes detection using `getCurrentTab`

## Support

For questions or issues with this hook, refer to:
- [Hook Documentation](./useTabNavigation.md)
- [Usage Examples](./useTabNavigation.example.tsx)
- [TabStore Documentation](../stores/tabStore.ts)
- [Route Metadata](../config/routeMetadata.ts)
