# Drag-and-Drop Tab Reordering Implementation

## Overview
This document describes the implementation of drag-and-drop tab reordering for the tab system, completing Task 5 from the implementation plan.

## Implementation Details

### 1. Tab Component Enhancements (`src/components/tabs/Tab.tsx`)

#### Drag Event Handlers
- **onDragStart**: Initiates the drag operation
- **onDragOver**: Handles drag over events for visual feedback
- **onDragEnter**: Triggers when dragging enters a tab area
- **onDrop**: Handles the drop event
- **onDragEnd**: Cleans up drag state when drag operation ends

#### Visual Feedback
- **Cursor Changes**: 
  - `cursor-grab`: Default cursor when hovering over tabs
  - `cursor-grabbing`: Active cursor during drag operation
  
- **Opacity**: Dragged tab shows at 50% opacity during drag

#### Props Interface
```typescript
interface TabProps {
  tab: TabType;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}
```

### 2. TabBar Component Enhancements (`src/components/tabs/TabBar.tsx`)

#### State Management
- **draggedTabIndex**: Tracks the index of the tab being dragged
- **dragOverIndex**: Tracks the index of the tab being hovered over during drag

#### Drag Event Handlers

##### handleDragStart
- Sets the dragged tab index
- Creates a custom drag image (clone of the tab)
- Sets drag effect to 'move'
- Cleans up the drag image after rendering

##### handleDragOver
- Prevents default behavior to allow drop
- Sets drop effect to 'move'
- Updates visual feedback by setting dragOverIndex

##### handleDragEnter
- Triggers the actual reorder operation
- Calls `reorderTabs` from the store
- Updates the dragged tab index to the new position

##### handleDrop
- Prevents default behavior
- Cleans up drag state (draggedTabIndex and dragOverIndex)

##### handleDragEnd
- Cleans up all drag state when drag operation completes

##### handleDragLeave
- Prevents dragging outside TabBar boundaries
- Checks if cursor is outside container bounds
- Clears drag over index if outside bounds

#### Visual Feedback
- **Dragged Tab**: Shows at 50% opacity (`opacity-50`)
- **Drop Target**: Shows a ring indicator (`ring-2 ring-mint-cream/50 rounded-t-md`)
- **Smooth Transitions**: All visual changes use `transition-all duration-200`

### 3. Store Integration (`src/stores/tabStore.ts`)

The `reorderTabs` action was already implemented in the store:

```typescript
reorderTabs: (fromIndex: number, toIndex: number) => void
```

This action:
- Validates indices are within bounds
- Removes the tab from the source index
- Inserts it at the target index
- Updates the store state

## Features Implemented

### ✅ Drag Event Handlers
- All necessary drag event handlers added to Tab component
- Proper event propagation and default behavior prevention

### ✅ Visual Feedback
- Opacity change on dragged tab (50%)
- Ring indicator on drop target
- Smooth transitions (200ms)
- Custom drag image

### ✅ Cursor Changes
- `cursor-grab` on hover
- `cursor-grabbing` during active drag

### ✅ Boundary Prevention
- `handleDragLeave` checks cursor position
- Prevents dragging outside TabBar container
- Clears visual feedback when leaving bounds

### ✅ Store Integration
- Calls `reorderTabs` action on drag enter
- Updates tab order in real-time during drag
- Persists new order to localStorage

## User Experience

### How to Use
1. **Start Drag**: Click and hold on any tab
2. **Drag**: Move the cursor while holding the mouse button
3. **Visual Feedback**: 
   - Dragged tab becomes semi-transparent
   - Target position shows a ring indicator
4. **Drop**: Release the mouse button to complete the reorder
5. **Persistence**: New tab order is automatically saved

### Keyboard Accessibility
While drag-and-drop is mouse-based, keyboard users can still:
- Use Arrow keys to navigate between tabs
- Use Home/End to jump to first/last tab
- Use Delete to close tabs

## Requirements Satisfied

This implementation satisfies the following requirements from the design document:

- **Requirement 4.1**: Users can click and drag tabs to reposition them
- **Requirement 4.2**: Visual feedback shows the new position during drag
- **Requirement 4.3**: Tab order updates when drag is released
- **Requirement 4.5**: Tabs cannot be dragged outside TabBar boundaries

## Testing Recommendations

To test the drag-and-drop functionality:

1. **Basic Reordering**:
   - Open multiple tabs
   - Drag a tab to a different position
   - Verify the tab moves to the new position

2. **Visual Feedback**:
   - Verify dragged tab shows at 50% opacity
   - Verify drop target shows ring indicator
   - Verify cursor changes to grab/grabbing

3. **Boundary Prevention**:
   - Try dragging a tab outside the TabBar
   - Verify visual feedback clears when leaving bounds
   - Verify tab returns to original position if dropped outside

4. **Persistence**:
   - Reorder tabs
   - Refresh the page
   - Verify tab order is maintained

5. **Edge Cases**:
   - Drag first tab to last position
   - Drag last tab to first position
   - Drag with only 2 tabs
   - Drag with maximum tabs (15)

## Browser Compatibility

The implementation uses standard HTML5 Drag and Drop API, which is supported in:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- All modern browsers

Since this is a Tauri desktop app, it will use the system's WebView, which supports these features.

## Performance Considerations

- **Real-time Updates**: Tab order updates during drag (not just on drop)
- **Smooth Animations**: CSS transitions provide smooth visual feedback
- **Minimal Re-renders**: Only affected tabs re-render during drag
- **Efficient State Updates**: Zustand ensures optimal state management

## Future Enhancements

Potential improvements for future iterations:
- Touch screen support for drag-and-drop
- Drag preview with tab content snapshot
- Animated tab position transitions
- Drag to create tab groups
- Multi-tab selection and drag
