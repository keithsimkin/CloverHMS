# Design Document

## Overview

The App Tab System transforms the Hospital Management System from a single-page navigation model to a browser-like multi-tab interface. This design enables users to open multiple pages simultaneously, switch between them efficiently, and maintain context across different workflows. The system integrates with the existing TanStack Router architecture while introducing a new tab management layer that sits between the router and the UI.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TauriTitleBar                        │
├─────────────────────────────────────────────────────────┤
│                      TabBar                             │
│  [Dashboard] [Patients*] [Appointments] [+]             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  TabContentArea                         │
│              (Active Tab Content)                       │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── TauriTitleBar (existing)
├── TabSystemProvider
│   ├── TabBar
│   │   ├── Tab (multiple instances)
│   │   │   ├── TabLabel
│   │   │   ├── TabCloseButton
│   │   │   └── TabContextMenu
│   │   └── NewTabButton
│   └── TabContentArea
│       └── TabContent (multiple instances, only active visible)
│           └── ProtectedRoute
│               └── Page Component
```

### State Management Strategy

The tab system uses Zustand for centralized state management with localStorage persistence. The store manages:
- Array of open tabs with their navigation state
- Active tab ID
- Tab order
- Tab metadata (title, icon, unsaved changes flag)


## Components and Interfaces

### 1. TabStore (Zustand Store)

**Location:** `src/stores/tabStore.ts`

**State Interface:**
```typescript
interface Tab {
  id: string;                    // Unique tab identifier (UUID)
  path: string;                  // Route path (e.g., '/patients')
  title: string;                 // Display title
  icon?: string;                 // Icon identifier
  hasUnsavedChanges: boolean;    // Unsaved changes indicator
  scrollPosition: number;        // Scroll position for restoration
  createdAt: number;             // Timestamp for tab age
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  maxTabs: number;
  
  // Actions
  openTab: (path: string, title: string, icon?: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  duplicateTab: (tabId: string) => void;
  closeOtherTabs: (tabId: string) => void;
  closeTabsToRight: (tabId: string) => void;
  updateTabMetadata: (tabId: string, updates: Partial<Tab>) => void;
  restoreTabs: () => void;
  clearAllTabs: () => void;
}
```

**Persistence Strategy:**
- Store tabs array and activeTabId in localStorage
- Restore on app initialization
- Maximum 30-day retention with timestamp validation
- Graceful fallback to default dashboard tab on corruption


### 2. TabBar Component

**Location:** `src/components/tabs/TabBar.tsx`

**Responsibilities:**
- Render all open tabs horizontally
- Handle tab selection clicks
- Manage drag-and-drop reordering
- Display new tab button
- Show tab count indicator when approaching limit

**Props:**
```typescript
interface TabBarProps {
  className?: string;
}
```

**Key Features:**
- Horizontal scrolling for overflow tabs
- Scroll buttons for navigation when tabs exceed viewport
- Visual feedback for drag operations
- Keyboard navigation (Arrow keys, Home, End)

### 3. Tab Component

**Location:** `src/components/tabs/Tab.tsx`

**Responsibilities:**
- Display individual tab with title and icon
- Show active/inactive state
- Display unsaved changes indicator
- Handle close button click
- Provide context menu on right-click
- Support drag-and-drop

**Props:**
```typescript
interface TabProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}
```

**Visual States:**
- Active: Highlighted background, bold text
- Inactive: Muted background, normal text
- Hover: Subtle background change
- Dragging: Semi-transparent with visual placeholder


### 4. TabContextMenu Component

**Location:** `src/components/tabs/TabContextMenu.tsx`

**Responsibilities:**
- Display context menu on right-click
- Provide tab management actions

**Menu Options:**
- Duplicate Tab
- Close Tab
- Close Other Tabs
- Close Tabs to the Right
- Pin Tab (future enhancement)

**Props:**
```typescript
interface TabContextMenuProps {
  tab: Tab;
  position: { x: number; y: number };
  onClose: () => void;
  onDuplicate: () => void;
  onCloseOthers: () => void;
  onCloseToRight: () => void;
}
```

### 5. TabContentArea Component

**Location:** `src/components/tabs/TabContentArea.tsx`

**Responsibilities:**
- Render content for all tabs (keep inactive tabs mounted but hidden)
- Manage scroll position restoration
- Handle tab content lifecycle

**Props:**
```typescript
interface TabContentAreaProps {
  tabs: Tab[];
  activeTabId: string | null;
}
```

**Rendering Strategy:**
- Keep all tab contents mounted in DOM but hidden with CSS
- Use `display: none` for inactive tabs
- Preserve component state and scroll position
- Lazy unmount tabs after 5 minutes of inactivity (optional optimization)


### 6. TabSystemProvider Component

**Location:** `src/components/tabs/TabSystemProvider.tsx`

**Responsibilities:**
- Wrap the entire app to provide tab system functionality
- Initialize tab store on mount
- Restore persisted tabs
- Handle global keyboard shortcuts
- Intercept navigation events to create tabs

**Props:**
```typescript
interface TabSystemProviderProps {
  children: React.ReactNode;
}
```

**Navigation Interception:**
- Listen to TanStack Router navigation events
- Create new tab or switch to existing tab based on navigation
- Handle Ctrl+Click and middle-click on links to open in new tab

### 7. useTabNavigation Hook

**Location:** `src/hooks/useTabNavigation.ts`

**Purpose:** Provide navigation utilities that work with the tab system

**Interface:**
```typescript
interface UseTabNavigationReturn {
  navigateToTab: (path: string, title: string, newTab?: boolean) => void;
  navigateInCurrentTab: (path: string) => void;
  openInNewTab: (path: string, title: string) => void;
  getCurrentTab: () => Tab | null;
}
```

**Usage Example:**
```typescript
const { navigateToTab, openInNewTab } = useTabNavigation();

// Navigate in current tab
navigateToTab('/patients', 'Patients');

// Force new tab
openInNewTab('/patients', 'Patients');
```


## Data Models

### Tab Model

```typescript
interface Tab {
  id: string;                    // UUID v4
  path: string;                  // TanStack Router path
  title: string;                 // Display title (e.g., "Patients")
  icon?: string;                 // Icon name from Heroicons
  hasUnsavedChanges: boolean;    // Show dot indicator
  scrollPosition: number;        // Y-axis scroll position
  createdAt: number;             // Unix timestamp
  lastAccessedAt: number;        // Unix timestamp for LRU
}
```

### Persisted State Model

```typescript
interface PersistedTabState {
  tabs: Tab[];
  activeTabId: string | null;
  version: number;               // Schema version for migrations
  timestamp: number;             // Last save timestamp
}
```

### Route Metadata Model

```typescript
interface RouteMetadata {
  path: string;
  title: string;
  icon: string;
  requiresAuth: boolean;
  allowedRoles?: Role[];
}
```

**Route Registry:**
Maintain a centralized registry mapping paths to metadata for consistent tab creation:

```typescript
const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': { path: '/', title: 'Dashboard', icon: 'HomeIcon', requiresAuth: true },
  '/patients': { path: '/patients', title: 'Patients', icon: 'UserGroupIcon', requiresAuth: true },
  '/appointments': { path: '/appointments', title: 'Appointments', icon: 'CalendarIcon', requiresAuth: true },
  // ... all routes
};
```


## Integration with Existing Architecture

### TanStack Router Integration

**Current Flow:**
```
User clicks link → Router navigates → Page component renders
```

**New Flow with Tabs:**
```
User clicks link → TabSystem intercepts → 
  → Check if tab exists for path
    → Yes: Switch to existing tab
    → No: Create new tab → Router navigates in tab context → Page renders
```

**Implementation Strategy:**
1. Wrap router navigation with tab system logic
2. Use router's `useNavigate` hook internally within tabs
3. Each tab maintains its own router state
4. Synchronize active tab with browser history (optional)

### Layout Integration

**Current Layout Structure:**
```
App
└── ProtectedRoute
    └── MainLayout
        ├── Sidebar
        └── Page Content
```

**New Layout Structure:**
```
App
└── TauriTitleBar
└── TabSystemProvider
    ├── TabBar
    └── TabContentArea
        └── [Multiple Tab Instances]
            └── ProtectedRoute
                └── MainLayout
                    ├── Sidebar (shared)
                    └── Page Content
```

**Optimization:** Share Sidebar component across tabs to avoid re-rendering


### Keyboard Shortcuts Integration

**Global Shortcuts (handled by TabSystemProvider):**
- `Ctrl+T` / `Cmd+T`: Open new tab (Dashboard)
- `Ctrl+W` / `Cmd+W`: Close active tab
- `Ctrl+Tab`: Switch to next tab
- `Ctrl+Shift+Tab`: Switch to previous tab
- `Ctrl+1-9`: Switch to tab by index (1-9)
- `Ctrl+Shift+T`: Reopen last closed tab

**Implementation:**
- Extend existing `GlobalKeyboardShortcuts` component
- Add tab-specific shortcuts
- Prevent conflicts with existing shortcuts
- Use `event.preventDefault()` to override browser defaults

### Sidebar Navigation Integration

**Current Behavior:**
- Sidebar links use TanStack Router's `Link` component
- Navigation replaces current page

**New Behavior:**
- Default click: Navigate in current tab
- Ctrl+Click / Cmd+Click: Open in new tab
- Middle-click: Open in new tab
- Right-click: Show context menu with "Open in New Tab" option

**Implementation:**
```typescript
<Link
  to="/patients"
  onClick={(e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      openInNewTab('/patients', 'Patients');
    }
  }}
  onAuxClick={(e) => {
    if (e.button === 1) { // Middle click
      e.preventDefault();
      openInNewTab('/patients', 'Patients');
    }
  }}
>
  Patients
</Link>
```


## Error Handling

### Tab Creation Errors

**Scenario:** Maximum tab limit reached
- **Handling:** Display toast notification with error message
- **User Action:** Close existing tabs or increase limit in settings

**Scenario:** Invalid route path
- **Handling:** Log error, don't create tab, show error toast
- **Fallback:** Keep user on current tab

### Tab Restoration Errors

**Scenario:** Corrupted localStorage data
- **Handling:** Clear corrupted data, log error
- **Fallback:** Open single dashboard tab

**Scenario:** Route no longer exists
- **Handling:** Skip that tab during restoration
- **User Notification:** Show toast indicating some tabs couldn't be restored

### Tab Content Errors

**Scenario:** Page component throws error
- **Handling:** Use React Error Boundary per tab
- **Display:** Show error UI in that tab only
- **Recovery:** Provide "Reload Tab" button

**Error Boundary Implementation:**
```typescript
<TabContent>
  <ErrorBoundary
    fallback={<TabErrorFallback onReload={() => reloadTab(tabId)} />}
  >
    <PageComponent />
  </ErrorBoundary>
</TabContent>
```


### Unsaved Changes Handling

**Scenario:** User tries to close tab with unsaved changes
- **Handling:** Show confirmation dialog
- **Options:** "Save and Close", "Discard Changes", "Cancel"
- **Implementation:** Use `beforeunload` pattern per tab

**Integration with Forms:**
```typescript
// In form components
const { updateTabMetadata } = useTabStore();
const { getCurrentTab } = useTabNavigation();

useEffect(() => {
  const currentTab = getCurrentTab();
  if (currentTab) {
    updateTabMetadata(currentTab.id, { hasUnsavedChanges: isDirty });
  }
}, [isDirty]);
```

## Testing Strategy

### Unit Tests

**TabStore Tests:**
- Test all store actions (openTab, closeTab, reorderTabs, etc.)
- Test persistence logic
- Test maximum tab limit enforcement
- Test tab deduplication logic

**Component Tests:**
- Tab component rendering and interactions
- TabBar scrolling and overflow behavior
- Context menu functionality
- Drag-and-drop reordering

**Hook Tests:**
- useTabNavigation navigation logic
- Keyboard shortcut handling

### Integration Tests

**Tab Lifecycle:**
- Open tab → Navigate → Close tab flow
- Multiple tabs with different content
- Tab switching preserves state
- Tab restoration after app restart

**Navigation Integration:**
- Sidebar navigation creates/switches tabs correctly
- Ctrl+Click opens new tab
- Middle-click opens new tab
- Browser back/forward button behavior (if implemented)


### E2E Tests

**User Workflows:**
- User opens multiple patient records in tabs
- User switches between tabs while editing forms
- User closes tabs and reopens application
- User reorders tabs via drag-and-drop
- User uses keyboard shortcuts to manage tabs

**Performance Tests:**
- Measure tab switching latency
- Test with maximum number of tabs open
- Memory usage with multiple tabs
- Scroll position restoration accuracy

## Performance Considerations

### Memory Management

**Challenge:** Multiple mounted page components consume memory

**Strategies:**
1. **Lazy Unmounting:** Unmount inactive tabs after 5 minutes
2. **Component Memoization:** Use React.memo for tab components
3. **Virtual Scrolling:** For tab bar with many tabs
4. **State Cleanup:** Clear unnecessary data when tabs close

### Rendering Optimization

**Tab Switching Performance:**
- Use CSS `display: none` instead of conditional rendering
- Avoid re-rendering inactive tabs
- Memoize tab content components
- Use `useCallback` for event handlers

**Tab Bar Scrolling:**
- Implement virtual scrolling for 20+ tabs
- Debounce scroll events
- Use `IntersectionObserver` for tab visibility


### State Synchronization

**Challenge:** Keep router state in sync with tab state

**Solution:**
- Single source of truth: TabStore
- Router follows tab state, not vice versa
- Update browser URL to match active tab (optional)
- Use router's programmatic navigation within tabs

## UI/UX Design

### Visual Design

**Tab Appearance:**
- Height: 32px
- Min Width: 120px
- Max Width: 200px
- Border radius: 6px 6px 0 0
- Active tab: Elevated with shadow, brighter background
- Inactive tab: Flat, muted background

**Color Scheme (Dark Theme):**
- Active tab background: `#273043` (Prussian Blue)
- Inactive tab background: `#232c3d` (Gunmetal)
- Tab hover: Lighten by 5%
- Tab text: `#eff6ee` (Mint Cream)
- Close button hover: `#f02d3a` (Imperial Red)

**Indicators:**
- Unsaved changes: Orange dot (6px) on left side of tab
- Notification: Blue dot (6px) on right side of tab
- Loading: Subtle spinner replacing icon

### Animations

**Tab Transitions:**
- Tab switch: Fade in/out (150ms)
- Tab open: Slide in from right (200ms)
- Tab close: Slide out and collapse (200ms)
- Tab reorder: Smooth position transition (250ms)

**Interaction Feedback:**
- Hover: Background color transition (100ms)
- Click: Subtle scale down (50ms)
- Drag: Opacity 0.7, cursor changes to grab


### Accessibility

**Keyboard Navigation:**
- Tab key: Navigate between tabs
- Enter/Space: Activate focused tab
- Arrow keys: Move focus between tabs
- Delete: Close focused tab (with confirmation)
- Escape: Close context menu

**Screen Reader Support:**
- ARIA labels for all interactive elements
- Announce tab count and active tab
- Announce when tabs open/close
- Describe unsaved changes indicator

**ARIA Attributes:**
```html
<div role="tablist" aria-label="Application tabs">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="tabpanel-1"
    aria-label="Dashboard tab, active"
  >
    Dashboard
  </button>
</div>
<div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1">
  <!-- Tab content -->
</div>
```

## Security Considerations

### Route Access Control

**Requirement:** Tabs must respect role-based access control

**Implementation:**
- Check permissions before creating tab
- Re-validate permissions when switching tabs
- Close tabs if user loses access (role change)
- Show error message for unauthorized access attempts

### Data Isolation

**Requirement:** Prevent data leakage between tabs

**Implementation:**
- Each tab has isolated component state
- No shared mutable state between tabs
- Clear sensitive data when tab closes
- Validate data access on tab switch


### Persistence Security

**Requirement:** Secure tab state in localStorage

**Implementation:**
- Don't persist sensitive data (patient IDs, form data)
- Only persist route paths and metadata
- Validate restored data before use
- Clear old persisted data (30-day retention)

## Migration Strategy

### Phase 1: Core Infrastructure
- Implement TabStore with Zustand
- Create basic Tab and TabBar components
- Add TabSystemProvider wrapper
- Implement tab creation and switching

### Phase 2: Navigation Integration
- Integrate with TanStack Router
- Update sidebar links for tab support
- Add keyboard shortcuts
- Implement tab persistence

### Phase 3: Advanced Features
- Add drag-and-drop reordering
- Implement context menu
- Add unsaved changes detection
- Implement tab duplication

### Phase 4: Polish & Optimization
- Add animations and transitions
- Optimize performance for many tabs
- Implement lazy unmounting
- Add comprehensive error handling

### Backward Compatibility

**Consideration:** Users upgrading from non-tab version

**Strategy:**
- Tab system is opt-in initially (feature flag)
- Graceful fallback to single-page mode if disabled
- Migrate existing navigation patterns gradually
- Provide user preference to disable tabs


## Configuration

### Settings Integration

**User Preferences (in Settings page):**
```typescript
interface TabSystemSettings {
  enabled: boolean;              // Enable/disable tab system
  maxTabs: number;               // Maximum concurrent tabs (5-20)
  persistTabs: boolean;          // Restore tabs on startup
  showTabIcons: boolean;         // Show icons in tabs
  tabPosition: 'top' | 'bottom'; // Tab bar position
  closeTabConfirmation: boolean; // Confirm before closing with unsaved changes
  keyboardShortcuts: {
    newTab: string;              // Default: 'Ctrl+T'
    closeTab: string;            // Default: 'Ctrl+W'
    nextTab: string;             // Default: 'Ctrl+Tab'
    prevTab: string;             // Default: 'Ctrl+Shift+Tab'
  };
}
```

**Default Configuration:**
```typescript
const DEFAULT_TAB_SETTINGS: TabSystemSettings = {
  enabled: true,
  maxTabs: 15,
  persistTabs: true,
  showTabIcons: true,
  tabPosition: 'top',
  closeTabConfirmation: true,
  keyboardShortcuts: {
    newTab: 'Ctrl+T',
    closeTab: 'Ctrl+W',
    nextTab: 'Ctrl+Tab',
    prevTab: 'Ctrl+Shift+Tab',
  },
};
```

## Future Enhancements

### Potential Features (Not in Initial Implementation)

1. **Tab Pinning:** Pin frequently used tabs to prevent accidental closure
2. **Tab Groups:** Organize related tabs into collapsible groups
3. **Tab Search:** Quick search/filter through open tabs
4. **Tab History:** View and restore recently closed tabs
5. **Split View:** View two tabs side-by-side
6. **Tab Sync:** Sync open tabs across devices (with backend)
7. **Custom Tab Colors:** Color-code tabs by category
8. **Tab Bookmarks:** Save tab sessions for later restoration


## Technical Decisions & Rationale

### Why Keep Tabs Mounted?

**Decision:** Keep inactive tab content mounted but hidden

**Rationale:**
- Preserves component state (form inputs, scroll position)
- Faster tab switching (no re-mount overhead)
- Better user experience (no loading states)
- Trade-off: Higher memory usage, but acceptable for desktop app

**Alternative Considered:** Unmount inactive tabs and restore state
- **Rejected:** Complex state serialization, slower switching, potential data loss

### Why Zustand Over Context API?

**Decision:** Use Zustand for tab state management

**Rationale:**
- Better performance (no unnecessary re-renders)
- Built-in persistence middleware
- Simpler API than Redux
- Already used in project (authStore, themeStore)
- Easy to test

### Why Not Use Browser Tabs?

**Decision:** Implement custom tab system instead of browser tabs

**Rationale:**
- Tauri desktop app has limited browser tab support
- Need full control over tab behavior and persistence
- Custom UI matches application design
- Can implement app-specific features (unsaved changes, notifications)

### Why TanStack Router Integration?

**Decision:** Integrate with existing TanStack Router instead of replacing it

**Rationale:**
- Leverage existing routing infrastructure
- Type-safe routing already configured
- Minimal breaking changes to existing code
- Router handles navigation, tabs handle presentation


## Implementation Notes

### Critical Path Items

1. **TabStore must be initialized before router:** Ensure tab state is ready before any navigation occurs
2. **Prevent duplicate tabs for same route:** Check existing tabs before creating new ones
3. **Handle tab closure edge cases:** Last tab, active tab, tabs with unsaved changes
4. **Synchronize active tab with router:** Keep URL in sync with active tab (optional but recommended)
5. **Memory leak prevention:** Clean up event listeners and timers when tabs close

### Common Pitfalls to Avoid

1. **Don't re-render all tabs on state change:** Use proper memoization and selectors
2. **Don't lose scroll position:** Save and restore scroll position on tab switch
3. **Don't ignore unsaved changes:** Always check before closing tabs
4. **Don't exceed max tabs silently:** Show clear feedback when limit reached
5. **Don't persist sensitive data:** Only persist route paths and safe metadata

### Development Guidelines

**Component Structure:**
- Keep tab components small and focused
- Extract reusable logic into hooks
- Use TypeScript strict mode
- Follow existing project patterns (shadcn/ui, Tailwind)

**State Management:**
- Use Zustand selectors to prevent unnecessary re-renders
- Keep tab state minimal (only what needs to persist)
- Derive computed values instead of storing them

**Testing:**
- Write unit tests for TabStore actions
- Test keyboard shortcuts thoroughly
- Test edge cases (max tabs, last tab, etc.)
- Test persistence and restoration

**Performance:**
- Profile tab switching performance
- Monitor memory usage with many tabs
- Optimize re-renders with React DevTools
- Use Chrome DevTools Performance tab

