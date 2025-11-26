# Tab System Accessibility Features

This document describes the accessibility features implemented in the tab system to ensure WCAG 2.1 AA compliance and excellent keyboard-only navigation support.

## ARIA Attributes

### TabBar Component
- **role="tablist"**: Identifies the container as a tab list
- **aria-label="Application tabs"**: Provides a descriptive label for screen readers
- All interactive elements have proper labels (scroll buttons, new tab button, tab count indicator)

### Tab Component
- **id="tab-{tabId}"**: Unique identifier for each tab, used for ARIA relationships
- **role="tab"**: Identifies each element as a tab
- **aria-selected**: Indicates whether the tab is currently active (true/false)
- **aria-controls="tabpanel-{tabId}"**: Links the tab to its corresponding content panel
- **aria-label**: Comprehensive label including:
  - Tab title
  - Unsaved changes status (if applicable)
  - Notification status (if applicable)
  - Active status
- **tabIndex**: 
  - Active tab: `0` (keyboard focusable)
  - Inactive tabs: `-1` (not in tab order, but can be focused programmatically)

### TabContentArea Component
- **role="tabpanel"**: Identifies the container as a tab panel
- **id="tabpanel-{tabId}"**: Unique identifier matching the tab's aria-controls
- **aria-labelledby="tab-{tabId}"**: Links the panel back to its controlling tab
- **aria-label**: Descriptive label with the tab title
- **tabIndex="0"**: Makes the content area keyboard focusable for scrolling

## Keyboard Navigation

### Tab Navigation
- **Tab**: Move focus between tabs (standard browser behavior)
- **Arrow Left**: Move focus to the previous tab
- **Arrow Right**: Move focus to the next tab
- **Home**: Move focus to the first tab
- **End**: Move focus to the last tab
- **Enter/Space**: Activate the focused tab (switch to it)
- **Delete**: Close the focused tab (with confirmation if unsaved changes)

### Global Shortcuts
- **Ctrl+T / Cmd+T**: Open new tab (Dashboard)
- **Ctrl+W / Cmd+W**: Close active tab
- **Ctrl+Tab**: Switch to next tab
- **Ctrl+Shift+Tab**: Switch to previous tab
- **Ctrl+1-9**: Switch to tab by index (1-9)

### Context Menu
- **Right-click** or **Context Menu key**: Open tab context menu
- **Arrow keys**: Navigate menu items
- **Enter**: Select menu item
- **Escape**: Close menu

## Screen Reader Announcements

The tab system provides live announcements for all tab actions using ARIA live regions:

### Tab Actions Announced
1. **Opening a new tab**: "Opened new tab: {title}. {count} tabs open"
2. **Switching to existing tab**: "Switched to {title} tab"
3. **Closing a tab**: "Closed {title} tab. Switched to {newTitle}. {count} tabs remaining"
4. **Closing last tab**: "Closed last tab. Opened Dashboard tab"
5. **Duplicating a tab**: "Duplicated {title} tab. {count} tabs open"
6. **Closing other tabs**: "Closed {count} other tabs. Only {title} tab remains"
7. **Closing tabs to right**: "Closed {count} tabs to the right. {count} tabs remaining"
8. **Switching tabs**: "Switched to {title} tab. Tab {index} of {total}"

### Implementation
- Uses `announceToScreenReader()` utility function
- Creates ARIA live region with `role="status"` and `aria-live="polite"`
- Announcements are non-intrusive and don't interrupt screen reader flow
- Can be upgraded to `aria-live="assertive"` for urgent messages

## Focus Management

### Focus Indicators
- All interactive elements have visible focus indicators using `focus-visible:ring-2`
- Focus ring color matches the theme (black in light mode, white in dark mode)
- Focus indicators are only shown for keyboard navigation, not mouse clicks

### Focus Order
1. Tab elements (left to right)
2. Scroll buttons (if visible)
3. Tab count indicator (if visible)
4. New tab button
5. Tab content area

### Focus Restoration
- When a tab is closed, focus moves to the newly active tab
- When tabs are reordered, focus follows the dragged tab
- When switching tabs, focus can optionally move to the content area

## Visual Indicators

### Unsaved Changes
- Orange dot (6px) displayed on tabs with unsaved changes
- Announced to screen readers in aria-label
- Shown in tooltip on hover

### Notifications
- Blue dot (6px) displayed on inactive tabs with notifications
- Announced to screen readers in aria-label
- Shown in tooltip on hover
- Automatically cleared when tab becomes active

### Active State
- Distinct visual styling (brighter background, border)
- Announced to screen readers via aria-selected="true"
- Higher contrast for better visibility

## Reduced Motion Support

The tab system respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This disables all animations for users who prefer reduced motion, including:
- Tab slide-in animations
- Tab slide-out animations
- Tab reordering transitions
- Fade transitions when switching tabs

## High Contrast Mode

The tab system supports high contrast mode via CSS custom properties:

```css
@media (prefers-contrast: high) {
  :root {
    --foreground: 255 255 255;
    --muted-foreground: 200 200 200;
  }
}
```

All colors are defined using CSS variables that can be overridden for high contrast mode.

## Testing Checklist

### Keyboard Navigation
- [ ] Can navigate between tabs using Arrow keys
- [ ] Can activate tabs using Enter/Space
- [ ] Can close tabs using Delete key
- [ ] Can open new tab using Ctrl+T
- [ ] Can close active tab using Ctrl+W
- [ ] Can switch tabs using Ctrl+Tab / Ctrl+Shift+Tab
- [ ] Can jump to specific tabs using Ctrl+1-9
- [ ] Focus indicators are visible for all interactive elements
- [ ] Focus order is logical and predictable

### Screen Reader Support
- [ ] Tab list is announced as "Application tabs"
- [ ] Each tab announces its title and status
- [ ] Active tab is announced as "selected"
- [ ] Tab actions are announced (open, close, switch)
- [ ] Tab count is announced when approaching limit
- [ ] Unsaved changes are announced
- [ ] Notifications are announced

### ARIA Compliance
- [ ] All tabs have role="tab"
- [ ] Tab list has role="tablist"
- [ ] Tab panels have role="tabpanel"
- [ ] aria-selected is set correctly
- [ ] aria-controls links tabs to panels
- [ ] aria-labelledby links panels to tabs
- [ ] All interactive elements have labels

### Visual Accessibility
- [ ] Focus indicators are visible and high contrast
- [ ] Active tab has sufficient contrast
- [ ] Unsaved changes indicator is visible
- [ ] Notification indicator is visible
- [ ] Text is readable at all zoom levels
- [ ] Colors meet WCAG AA contrast requirements

### Reduced Motion
- [ ] Animations are disabled when prefers-reduced-motion is set
- [ ] Tab switching still works without animations
- [ ] No jarring visual changes

## Browser Compatibility

The accessibility features are tested and supported in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Screen readers: NVDA, JAWS, VoiceOver

## Resources

- [ARIA Authoring Practices Guide - Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
