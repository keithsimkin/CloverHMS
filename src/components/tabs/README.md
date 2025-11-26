# Tab System Components

Browser-like tab system for the Hospital Management System, enabling users to open multiple pages simultaneously and switch between them efficiently.

## Components

### TabBar

The main container component that displays all open tabs with horizontal scrolling, keyboard navigation, and a new tab button.

#### Features

- **Horizontal Layout**: Displays tabs in a horizontal row with proper spacing
- **Scrolling Support**: Automatically shows scroll buttons when tabs overflow the viewport
- **Keyboard Navigation**: Full keyboard support for accessibility
  - `Arrow Left/Right`: Navigate between tabs
  - `Home/End`: Jump to first/last tab
  - `Delete`: Close focused tab
- **Drag and Drop**: Reorder tabs by dragging them
- **Tab Count Indicator**: Shows current/max tab count when approaching limit (within 3 tabs)
- **New Tab Button**: Opens a new Dashboard tab (disabled at max limit)
- **Visual Feedback**: Smooth animations and transitions for all interactions

#### Usage

```tsx
import { TabBar } from '@/components/tabs';

function App() {
  return (
    <div>
      <TabBar />
      {/* Rest of your app */}
    </div>
  );
}
```

#### Props

```typescript
interface TabBarProps {
  className?: string; // Optional additional CSS classes
}
```

### Tab

Individual tab component with active/inactive states, close button, and indicators.

#### Features

- **Active/Inactive States**: Clear visual distinction between active and inactive tabs
- **Close Button**: Appears on hover with smooth transition
- **Unsaved Changes Indicator**: Orange dot when tab has unsaved changes
- **Notification Indicator**: Colored dot when tab has notifications (only on inactive tabs)
  - Blue: Info notifications
  - Green: Success notifications
  - Yellow: Warning notifications
  - Red: Error notifications
  - Purple: Update notifications
- **Tooltip**: Shows full title, status, and notification details on hover
- **Drag Support**: Can be dragged to reorder
- **Truncation**: Long titles are truncated with ellipsis

#### Usage

```tsx
import { Tab } from '@/components/tabs';

function MyComponent() {
  const tab = {
    id: '1',
    path: '/patients',
    title: 'Patients',
    icon: 'Users',
    hasUnsavedChanges: false,
    scrollPosition: 0,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  };

  return (
    <Tab
      tab={tab}
      isActive={true}
      onSelect={() => console.log('Tab selected')}
      onClose={() => console.log('Tab closed')}
    />
  );
}
```

#### Props

```typescript
interface TabProps {
  tab: Tab;                                    // Tab data
  isActive: boolean;                           // Whether this tab is active
  onSelect: () => void;                        // Called when tab is clicked
  onClose: () => void;                         // Called when close button is clicked
  onDragStart?: (e: React.DragEvent) => void; // Optional drag start handler
  onDragOver?: (e: React.DragEvent) => void;  // Optional drag over handler
  onDrop?: (e: React.DragEvent) => void;      // Optional drop handler
}
```

## State Management

The tab system uses Zustand for state management. See `src/stores/tabStore.ts` for the full API.

### Key Actions

```typescript
import { useTabStore } from '@/stores/tabStore';

function MyComponent() {
  const {
    tabs,           // Array of all open tabs
    activeTabId,    // ID of the currently active tab
    maxTabs,        // Maximum number of tabs allowed (default: 15)
    openTab,        // Open a new tab or switch to existing
    closeTab,       // Close a tab by ID
    setActiveTab,   // Set the active tab
    reorderTabs,    // Reorder tabs (for drag-and-drop)
    updateTabMetadata, // Update tab properties
    setTabNotification, // Set a notification on a tab
    clearTabNotification, // Clear notification from a tab
  } = useTabStore();

  // Open a new tab
  const handleOpenTab = () => {
    openTab('/patients', 'Patients', 'Users');
  };

  // Close a tab
  const handleCloseTab = (tabId: string) => {
    closeTab(tabId);
  };

  // Mark tab as having unsaved changes
  const handleMarkUnsaved = (tabId: string) => {
    updateTabMetadata(tabId, { hasUnsavedChanges: true });
  };

  // Set a notification on a tab
  const handleNotify = (tabId: string) => {
    setTabNotification(tabId, 'info', 'New data available', 'Update');
  };

  return (
    <div>
      {/* Your component */}
    </div>
  );
}
```

## Tab Notifications

The tab system includes a comprehensive notification system for alerting users about events in background tabs. See [TAB_NOTIFICATIONS.md](./TAB_NOTIFICATIONS.md) for detailed documentation.

### Quick Start

```typescript
import { useTabNotification } from '@/hooks/useTabNotification';

function MyComponent() {
  const { setNotification, notifyCurrentTab, notifyTabByPath } = useTabNotification();

  // Notify a specific tab
  const handleNotify = (tabId: string) => {
    setNotification(tabId, 'success', 'Data saved successfully', 'Success');
  };

  // Notify the current tab
  const handleCurrentTabNotify = () => {
    notifyCurrentTab('info', 'Processing complete', 'Info');
  };

  // Notify a tab by its path
  const handlePathNotify = () => {
    notifyTabByPath('/patients', 'update', 'Patient records updated', 'Update');
  };

  return (
    <div>
      {/* Your component */}
    </div>
  );
}
```

### Notification Types

- **info** (Blue): General information updates
- **success** (Green): Successful operations
- **warning** (Yellow): Warnings or attention needed
- **error** (Red): Errors that occurred
- **update** (Purple): Content updates

### Features

- **Visual Indicators**: Colored dots on tabs based on notification type
- **Auto-Clear**: Notifications automatically clear when tab becomes active
- **Tooltips**: Detailed notification information on hover
- **Toast Integration**: Optional toast notifications for critical updates
- **Screen Reader Support**: Notifications are announced to screen readers

## Styling

The TabBar uses the application's dark theme with the following color scheme:

- **Active Tab**: `bg-prussian-blue` (#273043) with `text-mint-cream` (#eff6ee)
- **Inactive Tab**: `bg-gunmetal` (#232c3d) with `text-cool-gray` (#9197ae)
- **Hover State**: Lightened background with smooth transition
- **Close Button Hover**: `bg-imperial-red/20` with `text-imperial-red`

### Customization

You can customize the TabBar appearance by passing a `className` prop:

```tsx
<TabBar className="border-t-2 border-primary" />
```

## Accessibility

The TabBar component follows WCAG 2.1 Level AA guidelines:

- **ARIA Attributes**: Proper `role="tablist"` and `role="tab"` attributes
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Descriptive labels and announcements
- **High Contrast**: Meets AAA contrast ratio requirements

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **1.2**: Display all open tabs in the Tab Bar with visible labels
- **2.4**: Display close button on each tab
- **4.4**: Maintain tab order across navigation actions
- **10.5**: Display tab count and maximum limit when approaching the limit

## Demo

To see the TabBar in action, run the demo page:

```tsx
import { TabBarDemo } from '@/pages/TabBarDemo';

// Add to your router or render directly
<TabBarDemo />
```

The demo page includes:
- Interactive controls to open/close tabs
- Buttons to test various states (unsaved changes, notifications)
- Current state display
- List of all open tabs

## Performance

The TabBar is optimized for performance:

- **Efficient Re-renders**: Uses Zustand selectors to minimize re-renders
- **Smooth Animations**: CSS transitions for all visual changes
- **Scroll Optimization**: Debounced scroll event handlers
- **Memory Management**: Proper cleanup of event listeners and observers

## Browser Support

The TabBar component works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

Potential features for future iterations:
- Tab context menu (right-click)
- Tab pinning
- Tab groups
- Tab search/filter
- Split view
- Custom tab colors
