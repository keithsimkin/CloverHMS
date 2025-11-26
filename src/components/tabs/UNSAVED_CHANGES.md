# Unsaved Changes Detection

This document describes the unsaved changes detection system for the tab system.

## Overview

The unsaved changes detection system prevents users from accidentally losing work by:
1. Tracking when forms or pages have unsaved changes
2. Showing a visual indicator (orange dot) on tabs with unsaved changes
3. Displaying a confirmation dialog when attempting to close tabs with unsaved changes
4. Providing options to save, discard, or cancel the close operation

## Components

### 1. `useUnsavedChanges` Hook

A React hook that form components use to track and report unsaved changes to the tab system.

**Location:** `src/hooks/useUnsavedChanges.ts`

**Usage:**
```tsx
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

function MyForm() {
  const { isDirty, setIsDirty, markAsSaved, save } = useUnsavedChanges({
    onSave: async () => {
      // Save logic here
      await saveFormData();
    },
    onDiscard: () => {
      // Reset form to original state
      resetForm();
    },
  });

  // Update dirty state when form changes
  useEffect(() => {
    setIsDirty(formHasChanges);
  }, [formHasChanges, setIsDirty]);

  return <form>...</form>;
}
```

**API:**
- `isDirty`: Boolean indicating if there are unsaved changes
- `setIsDirty(dirty: boolean)`: Set the dirty state
- `hasUnsavedChanges`: Alias for `isDirty`
- `markAsSaved()`: Mark changes as saved (sets isDirty to false)
- `save()`: Call the onSave callback and mark as saved
- `discard()`: Call the onDiscard callback and mark as saved

### 2. `UnsavedChangesDialog` Component

A confirmation dialog shown when attempting to close a tab with unsaved changes.

**Location:** `src/components/tabs/UnsavedChangesDialog.tsx`

**Props:**
- `open`: Whether the dialog is open
- `onOpenChange`: Callback when dialog open state changes
- `tabTitle`: Tab title to display in the dialog
- `onSaveAndClose`: Optional callback when user chooses to save and close
- `onDiscardAndClose`: Callback when user chooses to discard changes and close
- `onCancel`: Optional callback when user cancels
- `showSaveButton`: Whether to show the "Save and Close" button (default: true)
- `isSaving`: Whether the save operation is in progress (default: false)

**Dialog Options:**
1. **Save and Close** (optional): Calls `onSaveAndClose`, waits for completion, then closes
2. **Discard Changes**: Calls `onDiscardAndClose` and closes immediately
3. **Cancel**: Calls `onCancel` and keeps the tab open

### 3. `TabCloseHandler` Component

A wrapper component that handles tab closing with unsaved changes confirmation.

**Location:** `src/components/tabs/TabCloseHandler.tsx`

**Usage:**
```tsx
<TabCloseHandler>
  {(closeTab) => (
    <div>
      <button onClick={() => closeTab(tabId)}>Close Tab</button>
    </div>
  )}
</TabCloseHandler>
```

This component is used internally by `TabBar` to wrap the tab close logic.

### 4. `useTabClose` Hook

A hook that provides a safe tab close function with unsaved changes confirmation.

**Location:** `src/hooks/useTabClose.ts`

**Usage:**
```tsx
import { useTabClose } from '@/hooks/useTabClose';

function MyComponent() {
  const { 
    closeTab, 
    dialogOpen, 
    setDialogOpen, 
    pendingCloseTab, 
    confirmClose, 
    cancelClose 
  } = useTabClose();

  return (
    <>
      <button onClick={() => closeTab(tabId)}>Close Tab</button>
      
      {pendingCloseTab && (
        <UnsavedChangesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          tabTitle={pendingCloseTab.title}
          onDiscardAndClose={confirmClose}
          onCancel={cancelClose}
        />
      )}
    </>
  );
}
```

This hook is used by `GlobalKeyboardShortcuts` to handle Ctrl+W keyboard shortcut.

## Integration Points

### TabBar Component

The `TabBar` component uses `TabCloseHandler` to wrap the tab close logic. When a user clicks the close button on a tab:

1. `TabCloseHandler` checks if the tab has unsaved changes
2. If yes, shows the confirmation dialog
3. If no, closes the tab immediately

### GlobalKeyboardShortcuts Component

The `GlobalKeyboardShortcuts` component uses `useTabClose` hook to handle the Ctrl+W keyboard shortcut with unsaved changes confirmation.

### Tab Component

The `Tab` component displays a visual indicator (orange dot) when `tab.hasUnsavedChanges` is true.

## Visual Indicators

### Tab Indicator

Tabs with unsaved changes show an orange dot (6px) on the left side of the tab label.

**CSS:**
```tsx
{tab.hasUnsavedChanges && (
  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
)}
```

### Tooltip

When hovering over a tab with unsaved changes, the tooltip shows "Unsaved changes" in orange text.

## User Flow

### Closing a Tab with Unsaved Changes

1. User clicks the close button (X) on a tab or presses Ctrl+W
2. System checks if `tab.hasUnsavedChanges` is true
3. If true, shows confirmation dialog with three options:
   - **Save and Close**: Saves changes, then closes the tab (if onSave is provided)
   - **Discard Changes**: Closes the tab without saving
   - **Cancel**: Keeps the tab open
4. If false, closes the tab immediately

### Form Editing Flow

1. User opens a page with a form in a tab
2. Form component uses `useUnsavedChanges` hook
3. User edits form fields
4. Form component calls `setIsDirty(true)`
5. Hook updates tab metadata: `updateTabMetadata(tabId, { hasUnsavedChanges: true })`
6. Tab shows orange dot indicator
7. User saves the form
8. Form component calls `markAsSaved()` or `save()`
9. Hook updates tab metadata: `updateTabMetadata(tabId, { hasUnsavedChanges: false })`
10. Orange dot disappears

## Example Implementation

See `src/components/tabs/UnsavedChangesExample.tsx` for a complete example of a form component with unsaved changes detection.

## Best Practices

### For Form Components

1. **Track form state**: Use a form library (React Hook Form, Formik) or manual state tracking
2. **Compare with original values**: Determine if form has been modified
3. **Update dirty state**: Call `setIsDirty()` when form state changes
4. **Provide save handler**: Implement `onSave` callback for "Save and Close" option
5. **Provide discard handler**: Implement `onDiscard` callback to reset form state
6. **Mark as saved**: Call `markAsSaved()` after successful save

### For Page Components

1. **Use the hook early**: Call `useUnsavedChanges` at the top level of your component
2. **Don't overuse**: Only use for pages with forms or editable content
3. **Clear on navigation**: Ensure dirty state is cleared when navigating away
4. **Handle errors**: If save fails, keep the dialog open and show an error message

### For Dialog Implementation

1. **Show save button conditionally**: Only show "Save and Close" if `onSave` is provided
2. **Disable during save**: Disable all buttons while `isSaving` is true
3. **Handle save errors**: Catch errors in `onSaveAndClose` and keep dialog open
4. **Provide clear messaging**: Use descriptive text in the dialog

## Testing

### Manual Testing

1. Open the TabBarDemo page (`/tab-bar-demo`)
2. Click "Mark Unsaved Changes (First 2)" button
3. Try to close one of the marked tabs
4. Verify confirmation dialog appears
5. Test all three options: Save and Close, Discard Changes, Cancel

### Automated Testing

Test cases should cover:
- Hook updates tab metadata when dirty state changes
- Dialog shows when closing tab with unsaved changes
- Dialog doesn't show when closing tab without unsaved changes
- "Discard Changes" closes the tab
- "Cancel" keeps the tab open
- Keyboard shortcut (Ctrl+W) respects unsaved changes

## Troubleshooting

### Orange dot doesn't appear

- Verify `setIsDirty(true)` is being called
- Check that `useTabNavigation().getCurrentTab()` returns the correct tab
- Ensure tab metadata is being updated in the store

### Dialog doesn't show

- Verify `tab.hasUnsavedChanges` is true in the tab store
- Check that `TabCloseHandler` is wrapping the close logic
- Ensure `useTabClose` hook is being used for keyboard shortcuts

### Save button doesn't work

- Verify `onSave` callback is provided to `useUnsavedChanges`
- Check that the save function returns a Promise
- Ensure errors are caught and handled

### Form state not resetting

- Verify `onDiscard` callback is provided to `useUnsavedChanges`
- Check that the discard function resets form state to original values
- Ensure `markAsSaved()` is called after reset

## Future Enhancements

Potential improvements for the unsaved changes system:

1. **Auto-save**: Automatically save changes periodically
2. **Save on tab switch**: Option to auto-save when switching tabs
3. **Dirty state persistence**: Persist dirty state across app restarts
4. **Multiple forms**: Support multiple forms in a single tab
5. **Custom save handlers**: Allow pages to provide custom save logic
6. **Undo/Redo**: Integrate with undo/redo system
7. **Conflict resolution**: Handle conflicts when multiple tabs edit the same data
