# Tab System Architecture

## Component Hierarchy

```
App
├── ErrorBoundary
│   └── TabSystemProvider ⭐ (NEW)
│       ├── TabBar
│       │   ├── Scroll Button (Left)
│       │   ├── Tab (multiple)
│       │   │   ├── Icon
│       │   │   ├── Title
│       │   │   ├── Unsaved Indicator
│       │   │   ├── Close Button
│       │   │   └── TabContextMenu
│       │   ├── Scroll Button (Right)
│       │   ├── Tab Count Indicator
│       │   └── New Tab Button
│       │
│       └── TabContentArea
│           └── TabContent (multiple, only active visible)
│               └── ErrorBoundary
│                   └── RouterProvider
│                       └── ProtectedRoute
│                           └── MainLayout
│                               ├── TauriTitleBar
│                               ├── AppSidebar
│                               └── Page Content
├── Toaster
└── GlobalKeyboardShortcuts
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interaction                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  TabSystemProvider                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Navigation Interception                             │  │
│  │  - Listen to router state changes                    │  │
│  │  - Detect route changes                              │  │
│  │  - Lookup route metadata                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      TabStore (Zustand)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management                                    │  │
│  │  - tabs: Tab[]                                       │  │
│  │  - activeTabId: string | null                        │  │
│  │  - maxTabs: number                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Actions                                             │  │
│  │  - openTab() → Create or switch to tab              │  │
│  │  - closeTab() → Remove tab                          │  │
│  │  - setActiveTab() → Switch active tab               │  │
│  │  - reorderTabs() → Drag and drop                    │  │
│  │  - restoreTabs() → Load from localStorage           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    localStorage                             │
│  {                                                          │
│    tabs: [...],                                             │
│    activeTabId: "...",                                      │
│    version: 1,                                              │
│    timestamp: 1234567890                                    │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Navigation Flow

```
User Action
    │
    ├─ Click Sidebar Link
    │       │
    │       ▼
    │   Router.navigate()
    │       │
    │       ▼
    │   Router State Changes
    │       │
    │       ▼
    │   TabSystemProvider Intercepts
    │       │
    │       ├─ Tab exists? → Switch to tab
    │       └─ Tab doesn't exist? → Create new tab
    │
    ├─ Click Tab
    │       │
    │       ▼
    │   setActiveTab(tabId)
    │       │
    │       ▼
    │   TabSystemProvider Syncs
    │       │
    │       ▼
    │   Router.navigate(tab.path)
    │
    ├─ Press Ctrl+T
    │       │
    │       ▼
    │   Keyboard Handler
    │       │
    │       ▼
    │   openTab('/dashboard')
    │       │
    │       ▼
    │   Router.navigate('/dashboard')
    │
    └─ Press Ctrl+W
            │
            ▼
        Keyboard Handler
            │
            ▼
        closeTab(activeTabId)
            │
            ▼
        Auto-switch to nearest tab
```

## State Synchronization

```
┌──────────────────┐         ┌──────────────────┐
│   Router State   │◄───────►│    Tab Store     │
│                  │         │                  │
│  - pathname      │         │  - tabs[]        │
│  - search        │         │  - activeTabId   │
│  - hash          │         │                  │
└──────────────────┘         └──────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│   Browser URL    │         │  localStorage    │
│                  │         │                  │
│  /patients       │         │  {tabs: [...]}   │
└──────────────────┘         └──────────────────┘

Synchronization Rules:
1. Router change → Update/create tab
2. Tab change → Navigate router
3. App start → Restore from localStorage
4. Tab close → Update localStorage
```

## Keyboard Shortcut Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Window Keydown Event                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              TabSystemProvider Event Handler                │
│                                                             │
│  if (Ctrl/Cmd + T) → openTab('/dashboard')                 │
│  if (Ctrl/Cmd + W) → closeTab(activeTabId)                 │
│  if (Ctrl/Cmd + Tab) → setActiveTab(nextTab)               │
│  if (Ctrl/Cmd + Shift + Tab) → setActiveTab(prevTab)       │
│  if (Ctrl/Cmd + 1-9) → setActiveTab(tabs[index])           │
│                                                             │
│  e.preventDefault() → Override browser defaults             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Tab Store Action                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    UI Updates (React)                       │
└─────────────────────────────────────────────────────────────┘
```

## Persistence Flow

```
App Start
    │
    ▼
TabSystemProvider mounts
    │
    ▼
restoreTabs() called
    │
    ▼
Read from localStorage
    │
    ├─ Data valid? → Restore tabs
    │       │
    │       ▼
    │   Validate timestamps (30-day retention)
    │       │
    │       ▼
    │   Validate activeTabId exists
    │       │
    │       ▼
    │   Set tabs and activeTabId
    │
    └─ Data invalid? → Create default tab
            │
            ▼
        openTab('/dashboard')

─────────────────────────────────────────────

Tab Changes
    │
    ▼
TabStore updates
    │
    ▼
Zustand persist middleware
    │
    ▼
Write to localStorage
    │
    ▼
{
  "tab-storage": {
    "state": {
      "tabs": [...],
      "activeTabId": "...",
      "maxTabs": 15
    },
    "version": 1
  }
}
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                      Error Occurs                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  ErrorBoundary (Per Tab)                    │
│                                                             │
│  Catches errors in tab content only                         │
│  Other tabs remain functional                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   TabErrorFallback                          │
│                                                             │
│  - Display error message                                    │
│  - Show error details (dev mode)                            │
│  - Provide "Reload Tab" button                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    User Action                              │
│                                                             │
│  - Reload tab → Re-navigate to tab.path                     │
│  - Close tab → closeTab(tabId)                              │
│  - Switch tab → setActiveTab(otherTabId)                    │
└─────────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    TabSystemProvider                        │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  TabStore    │   │   Router     │   │  Metadata    │
│  (Zustand)   │   │  (TanStack)  │   │  Registry    │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ localStorage │   │ Browser URL  │   │ Route Config │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                    Rendering Strategy                       │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  All Tabs    │   │  Active Tab  │   │ Inactive Tabs│
│  Mounted     │   │  Visible     │   │  Hidden      │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Preserve     │   │ display:     │   │ display:     │
│ State        │   │ block        │   │ none         │
└──────────────┘   └──────────────┘   └──────────────┘

Benefits:
- Fast tab switching (no re-mount)
- State preservation (forms, scroll)
- Scroll position maintained
- No loading states

Trade-offs:
- Higher memory usage
- More DOM nodes
- Acceptable for desktop app
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Route Access Check                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ProtectedRoute                           │
│                                                             │
│  - Check authentication                                     │
│  - Validate session                                         │
│  - Verify role permissions                                  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Authorized   │   │ Unauthorized │   │ Session      │
│              │   │              │   │ Expired      │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Render Page  │   │ Redirect to  │   │ Redirect to  │
│              │   │ Login        │   │ Login        │
└──────────────┘   └──────────────┘   └──────────────┘

Persistence Security:
- No sensitive data in localStorage
- Only route paths stored
- No user data or tokens
- Validation on restoration
```

## Summary

The TabSystemProvider acts as the orchestration layer for the entire tab system:

1. **Initialization**: Restores tabs from localStorage on mount
2. **Navigation**: Intercepts router changes to manage tabs
3. **Synchronization**: Keeps router and tab state in sync
4. **Keyboard**: Handles global shortcuts for tab management
5. **Rendering**: Provides structure for TabBar and TabContentArea
6. **Persistence**: Automatically saves tab state via Zustand middleware

The architecture is designed to be:
- **Modular**: Each component has a single responsibility
- **Maintainable**: Clear separation of concerns
- **Performant**: Efficient rendering and state updates
- **Secure**: Respects authentication and authorization
- **Resilient**: Graceful error handling and recovery
