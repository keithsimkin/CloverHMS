# Implementation Plan

- [x] 1. Create route metadata registry and tab data models





  - Define TypeScript interfaces for Tab, RouteMetadata, and PersistedTabState
  - Create centralized ROUTE_METADATA registry mapping all application routes to their metadata (title, icon, auth requirements)
  - Add utility functions for route metadata lookup
  - _Requirements: 1.2, 3.2, 5.1_

- [x] 2. Implement TabStore with Zustand




- [x] 2.1 Create base TabStore with state interface


  - Implement Tab interface with id, path, title, icon, hasUnsavedChanges, scrollPosition, createdAt, lastAccessedAt
  - Set up Zustand store with tabs array, activeTabId, and maxTabs state
  - Configure persist middleware for localStorage with 30-day retention
  - _Requirements: 1.1, 1.4, 5.1, 5.5, 10.3_

- [x] 2.2 Implement core tab management actions

  - Write openTab action with duplicate detection and max tab limit enforcement
  - Write closeTab action with automatic active tab switching logic
  - Write setActiveTab action with validation
  - Implement clearAllTabs and default dashboard tab creation
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 10.1, 10.2_

- [x] 2.3 Implement advanced tab actions

  - Write reorderTabs action for drag-and-drop support
  - Write duplicateTab action with state copying
  - Write closeOtherTabs and closeTabsToRight actions
  - Write updateTabMetadata action for unsaved changes and notifications
  - _Requirements: 4.1, 4.3, 7.2, 7.3, 8.2, 8.5, 9.1_

- [x] 2.4 Add tab restoration and persistence logic

  - Implement restoreTabs action to load from localStorage on app start
  - Add timestamp validation for 30-day retention
  - Implement fallback to default dashboard tab on corruption
  - Add version field for future schema migrations
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [x] 3. Create Tab component





  - Build Tab component with active/inactive visual states
  - Add tab label with icon and title display
  - Implement close button with hover effects
  - Add tooltip for full title on hover
  - Style with Tailwind CSS matching design system (Prussian Blue, Gunmetal colors)
  - Add unsaved changes indicator (orange dot)
  - Add notification indicator (blue dot)
  - Implement truncation for long titles with ellipsis
  - _Requirements: 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 9.1, 9.5_


- [x] 4. Create TabBar component





  - Build TabBar container with horizontal layout
  - Render all Tab components from store state
  - Add horizontal scrolling for overflow tabs
  - Implement scroll buttons for navigation when tabs exceed viewport
  - Add new tab button (+) that opens Dashboard
  - Display tab count indicator when approaching max limit
  - Add keyboard navigation support (Arrow keys, Home, End)
  - Style with dark theme colors and proper spacing
  - _Requirements: 1.2, 2.4, 4.4, 10.5_

- [x] 5. Implement drag-and-drop tab reordering





  - Add drag event handlers to Tab component (onDragStart, onDragOver, onDrop)
  - Implement visual feedback during drag (opacity, placeholder)
  - Call reorderTabs action on drop
  - Prevent dragging outside TabBar boundaries
  - Add cursor changes (grab/grabbing)
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 6. Create TabContextMenu component





  - Build context menu component with shadcn/ui DropdownMenu
  - Add menu options: Duplicate Tab, Close Tab, Close Other Tabs, Close Tabs to the Right
  - Wire up menu actions to TabStore actions
  - Position menu at cursor location on right-click
  - Handle menu close on selection or outside click
  - _Requirements: 7.1, 8.1, 8.5_

- [x] 7. Create TabContentArea component





  - Build container that renders content for all tabs
  - Use CSS display:none to hide inactive tabs while keeping them mounted
  - Show only active tab content
  - Wrap each tab content in ErrorBoundary for isolated error handling
  - Implement scroll position save/restore on tab switch
  - _Requirements: 1.4, 1.5_

- [x] 8. Create TabSystemProvider component





  - Build provider component that wraps the entire app
  - Initialize TabStore on mount
  - Call restoreTabs on app startup
  - Render TabBar and TabContentArea
  - Set up navigation interception for tab creation
  - _Requirements: 5.2, 5.3_

- [x] 9. Implement keyboard shortcuts for tab management





  - Add Ctrl+T / Cmd+T handler to open new Dashboard tab
  - Add Ctrl+W / Cmd+W handler to close active tab
  - Add Ctrl+Tab handler to switch to next tab
  - Add Ctrl+Shift+Tab handler to switch to previous tab
  - Add Ctrl+1-9 handlers to switch to tab by index
  - Prevent default browser behavior for these shortcuts
  - Integrate with existing GlobalKeyboardShortcuts component
  - _Requirements: 2.5, 6.1_


- [x] 10. Create useTabNavigation hook





  - Implement navigateToTab function that creates or switches to tab
  - Implement navigateInCurrentTab function for same-tab navigation
  - Implement openInNewTab function that forces new tab creation
  - Implement getCurrentTab function to get active tab info
  - Use TabStore and TanStack Router internally
  - _Requirements: 1.1, 1.3, 6.3, 6.4, 6.5_

- [x] 11. Update sidebar navigation for tab support





  - Modify sidebar Link components to support Ctrl+Click for new tab
  - Add middle-click (auxClick) handler to open in new tab
  - Add right-click context menu with "Open in New Tab" option
  - Use useTabNavigation hook for navigation logic
  - Maintain default click behavior (navigate in current tab)
  - _Requirements: 6.3, 6.4_

- [x] 12. Integrate TabSystem with App.tsx and router





  - Wrap RouterProvider with TabSystemProvider in App.tsx
  - Update TauriTitleBar positioning to accommodate TabBar
  - Ensure ProtectedRoute works within tab context
  - Test that all existing routes work with tab system
  - Verify theme and authentication integration
  - _Requirements: 1.1, 1.2_

- [x] 13. Implement unsaved changes detection





  - Create useUnsavedChanges hook for form components
  - Hook into TabStore to update hasUnsavedChanges flag
  - Add confirmation dialog when closing tab with unsaved changes
  - Provide "Save and Close", "Discard Changes", "Cancel" options
  - Update Tab component to show unsaved changes indicator
  - _Requirements: 3.3_

- [x] 14. Add tab animations and transitions





  - Implement fade in/out transition for tab switching (150ms)
  - Add slide in animation for new tabs (200ms)
  - Add slide out and collapse animation for closing tabs (200ms)
  - Add smooth position transition for reordering (250ms)
  - Add hover and click interaction feedback
  - Use Tailwind CSS transitions and animations
  - _Requirements: 3.1_

- [x] 15. Implement tab limit enforcement and warnings





  - Add max tab limit check in openTab action
  - Display toast notification when limit reached
  - Show tab count indicator in TabBar when approaching limit (within 3 of max)
  - Prevent new tab creation at limit
  - Add clear error message with actionable guidance
  - _Requirements: 10.1, 10.2, 10.5_


- [x] 16. Add accessibility features





  - Add ARIA attributes to TabBar (role="tablist")
  - Add ARIA attributes to Tab (role="tab", aria-selected, aria-controls)
  - Add ARIA attributes to TabContentArea (role="tabpanel")
  - Implement keyboard navigation (Tab, Enter, Space, Arrow keys, Delete)
  - Add screen reader announcements for tab actions
  - Ensure all interactive elements have proper labels
  - Test with keyboard-only navigation
  - _Requirements: 1.3, 2.1, 3.1_

- [x] 17. Implement error handling and recovery





  - Add ErrorBoundary wrapper for each tab content
  - Create TabErrorFallback component with reload button
  - Handle corrupted localStorage data gracefully
  - Add error logging for debugging
  - Show user-friendly error messages
  - Implement tab reload functionality
  - _Requirements: 5.4_

- [x] 18. Add tab notification system





  - Implement notification indicator display on tabs
  - Add different indicator styles for update types
  - Clear notification when tab becomes active
  - Add tooltip describing notification on hover
  - Integrate with existing toast/notification system
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 19. Create settings UI for tab system configuration





  - Add Tab System section to Settings page
  - Add toggle for enabling/disabling tab system
  - Add slider for max tabs configuration (5-20 range)
  - Add toggle for tab persistence
  - Add toggle for showing tab icons
  - Add toggle for close confirmation with unsaved changes
  - Store settings in localStorage or user preferences
  - _Requirements: 10.3, 10.4_

- [-] 20. Performance optimization and testing



  - Implement React.memo for Tab components
  - Add useCallback for event handlers
  - Profile tab switching performance
  - Test with maximum number of tabs (20)
  - Monitor memory usage with multiple tabs open
  - Optimize re-renders using Zustand selectors
  - Test scroll position restoration accuracy
  - Verify tab persistence across app restarts
  - _Requirements: 1.4, 1.5, 4.4, 5.2, 5.3, 10.1_

