/**
 * Tab Settings Store using Zustand
 * Manages user preferences for the tab system
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabSystemSettings {
  enabled: boolean;
  maxTabs: number;
  persistTabs: boolean;
  showTabIcons: boolean;
  closeTabConfirmation: boolean;
}

interface TabSettingsState extends TabSystemSettings {
  // Actions
  updateSettings: (settings: Partial<TabSystemSettings>) => void;
  resetSettings: () => void;
}

// Default configuration
export const DEFAULT_TAB_SETTINGS: TabSystemSettings = {
  enabled: true,
  maxTabs: 15,
  persistTabs: true,
  showTabIcons: true,
  closeTabConfirmation: true,
};

export const useTabSettingsStore = create<TabSettingsState>()(
  persist(
    (set) => ({
      // Initial state from defaults
      ...DEFAULT_TAB_SETTINGS,

      // Update settings
      updateSettings: (settings: Partial<TabSystemSettings>) => {
        set((state) => ({
          ...state,
          ...settings,
        }));
      },

      // Reset to defaults
      resetSettings: () => {
        set(DEFAULT_TAB_SETTINGS);
      },
    }),
    {
      name: 'tab-settings-storage',
      version: 1,
    }
  )
);
