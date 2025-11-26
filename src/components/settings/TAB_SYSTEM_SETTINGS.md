# Tab System Settings

## Overview

The Tab System Settings component provides a user interface for configuring the browser-like tab system behavior and preferences. All settings are stored in localStorage and persist across application sessions.

## Location

Settings can be accessed from:
- **Settings Page** → **System Tab** → **Tab System Section**

## Available Settings

### 1. Enable Tab System
- **Type:** Toggle (Switch)
- **Default:** Enabled
- **Description:** Turn the browser-like tab system on or off
- **Effect:** When disabled, the application reverts to single-page navigation without tabs

### 2. Maximum Tabs
- **Type:** Slider (5-20 range)
- **Default:** 15 tabs
- **Description:** Set the maximum number of tabs that can be open simultaneously
- **Effect:** 
  - Prevents opening more tabs than the configured limit
  - Shows warning toast when limit is reached
  - Tab count indicator appears when within 3 tabs of the limit

### 3. Tab Persistence
- **Type:** Toggle (Switch)
- **Default:** Enabled
- **Description:** Restore open tabs when the application restarts
- **Effect:** 
  - When enabled, tabs are saved to localStorage and restored on app startup
  - When disabled, app always starts with a single Dashboard tab
  - Persisted data has a 30-day retention period

### 4. Show Tab Icons
- **Type:** Toggle (Switch)
- **Default:** Enabled
- **Description:** Display icons in tab labels for better visual identification
- **Effect:** 
  - When enabled, shows route-specific icons in each tab
  - When disabled, only shows tab titles (saves horizontal space)

### 5. Close Confirmation
- **Type:** Toggle (Switch)
- **Default:** Enabled
- **Description:** Show confirmation dialog when closing tabs with unsaved changes
- **Effect:** 
  - When enabled, shows "Discard Changes" dialog before closing tabs with unsaved changes
  - When disabled, tabs close immediately without confirmation (data may be lost)

## Reset to Defaults

The "Reset to Defaults" button restores all settings to their default values:
- Enable Tab System: ✓ Enabled
- Maximum Tabs: 15
- Tab Persistence: ✓ Enabled
- Show Tab Icons: ✓ Enabled
- Close Confirmation: ✓ Enabled

## Technical Implementation

### Storage
- Settings are stored using Zustand with persist middleware
- Storage key: `tab-settings-storage`
- Storage location: localStorage
- Schema version: 1

### Store Location
- **Store:** `src/stores/tabSettingsStore.ts`
- **Component:** `src/components/settings/TabSystemSettings.tsx`

### Integration Points

1. **TabStore** (`src/stores/tabStore.ts`)
   - Reads `maxTabs` from settings for limit enforcement
   - Uses settings in `openTab` and `duplicateTab` actions

2. **Tab Component** (`src/components/tabs/Tab.tsx`)
   - Reads `showTabIcons` to conditionally render icons

3. **TabCloseHandler** (`src/components/tabs/TabCloseHandler.tsx`)
   - Reads `closeTabConfirmation` to show/hide unsaved changes dialog

4. **TabBar** (`src/components/tabs/TabBar.tsx`)
   - Reads `maxTabs` for tab count indicator display

5. **TabSystemProvider** (`src/components/tabs/TabSystemProvider.tsx`)
   - Reads `enabled` to enable/disable entire tab system
   - Reads `persistTabs` to control tab restoration on startup

## User Experience

### Immediate Effect
All settings changes take effect immediately without requiring an app restart:
- Toggling "Show Tab Icons" instantly shows/hides icons in all tabs
- Changing "Maximum Tabs" immediately updates the limit
- Disabling "Tab System" instantly switches to single-page mode

### Feedback
- Toast notifications confirm each setting change
- Visual indicators show current state (switch on/off, slider position)
- Info box explains the purpose of the settings section

### Accessibility
- All controls have proper labels and descriptions
- Settings are keyboard accessible
- Screen reader friendly with ARIA attributes
- Disabled state when tab system is off (dependent settings)

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 10.3:** Maximum tab limit configuration (5-20 range)
- **Requirement 10.4:** Administrator configuration of tab limits
- Settings stored in localStorage for persistence
- All toggles and sliders work as specified
- Reset to defaults functionality included

## Usage Example

```typescript
import { useTabSettingsStore } from '@/stores/tabSettingsStore';

function MyComponent() {
  const { 
    enabled, 
    maxTabs, 
    persistTabs, 
    showTabIcons, 
    closeTabConfirmation,
    updateSettings,
    resetSettings 
  } = useTabSettingsStore();

  // Update a single setting
  const handleToggle = () => {
    updateSettings({ enabled: !enabled });
  };

  // Reset all settings
  const handleReset = () => {
    resetSettings();
  };

  return (
    <div>
      <p>Tab System: {enabled ? 'Enabled' : 'Disabled'}</p>
      <p>Max Tabs: {maxTabs}</p>
      <button onClick={handleToggle}>Toggle Tab System</button>
      <button onClick={handleReset}>Reset Settings</button>
    </div>
  );
}
```

## Future Enhancements

Potential additions for future versions:
- Tab position configuration (top/bottom)
- Custom keyboard shortcuts configuration
- Tab animation speed settings
- Tab width preferences (fixed/flexible)
- Color-coding options for tabs
- Tab grouping preferences
