# Tab System Keyboard Shortcuts

This document describes the keyboard shortcuts implemented for the tab management system.

## Implemented Shortcuts

### Tab Management

| Shortcut | Windows/Linux | macOS | Description |
|----------|--------------|-------|-------------|
| New Tab | `Ctrl+T` | `Cmd+T` | Opens a new Dashboard tab |
| Close Tab | `Ctrl+W` | `Cmd+W` | Closes the currently active tab |
| Next Tab | `Ctrl+Tab` | `Ctrl+Tab` | Switches to the next tab (cycles to first if at end) |
| Previous Tab | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` | Switches to the previous tab (cycles to last if at start) |
| Switch to Tab 1-9 | `Ctrl+1` to `Ctrl+9` | `Cmd+1` to `Cmd+9` | Switches to the tab at the specified index (1-based) |

## Implementation Details

### Location
The keyboard shortcuts are implemented in:
- **Component**: `src/components/common/GlobalKeyboardShortcuts.tsx`
- **Hook**: `src/hooks/useKeyboardShortcut.ts`
- **Documentation**: `src/components/common/KeyboardShortcutsDialog.tsx`

### How It Works

1. **Platform Detection**: The component detects whether the user is on macOS or Windows/Linux to use the appropriate modifier key (Cmd vs Ctrl).

2. **Event Prevention**: All shortcuts call `preventDefault()` to prevent default browser behavior (e.g., preventing Ctrl+W from closing the browser window).

3. **Tab Store Integration**: The shortcuts directly interact with the Zustand tab store to:
   - Open new tabs using `openTab()`
   - Close tabs using `closeTab()`
   - Switch tabs using `setActiveTab()`

4. **Helper Functions**: Three helper functions manage tab navigation:
   - `getNextTab()`: Returns the next tab in the list (cycles to first)
   - `getPreviousTab()`: Returns the previous tab (cycles to last)
   - `getTabByIndex(index)`: Returns the tab at the specified 1-based index

### Edge Cases Handled

- **No Active Tab**: If there's no active tab, navigation shortcuts do nothing
- **Single Tab**: Next/Previous shortcuts work correctly with a single tab (stays on same tab)
- **Index Out of Range**: Switching to a tab index that doesn't exist is safely ignored
- **Last Tab Closure**: Closing the last tab automatically creates a new Dashboard tab (handled by tab store)

## Usage

The shortcuts are automatically registered when the `GlobalKeyboardShortcuts` component is mounted in the application. No additional setup is required.

### Viewing All Shortcuts

Users can press `Shift+?` to open the keyboard shortcuts dialog, which displays all available shortcuts including the new tab management shortcuts.

## Testing

To test the keyboard shortcuts:

1. Open the application
2. Press `Ctrl+T` (or `Cmd+T` on macOS) to open a new tab
3. Press `Ctrl+W` (or `Cmd+W` on macOS) to close the active tab
4. Press `Ctrl+Tab` to cycle through tabs
5. Press `Ctrl+1` through `Ctrl+9` to jump to specific tabs

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 2.5**: Close active tab with Ctrl+W / Cmd+W
- **Requirement 6.1**: Open new tab with Ctrl+T / Cmd+T
- All shortcuts prevent default browser behavior
- Integration with existing GlobalKeyboardShortcuts component
- Support for both Windows/Linux (Ctrl) and macOS (Cmd) modifier keys

## Future Enhancements

Potential future improvements:
- `Ctrl+Shift+T`: Reopen last closed tab
- `Ctrl+Shift+N`: Open new tab with specific page (via command palette)
- `Alt+Left/Right`: Navigate tab history (back/forward within a tab)
