/**
 * Tab Store using Zustand
 * Manages browser-like tab system with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tab, TabNotification, TabNotificationType } from '@/types/tab';
import { getRouteMetadata, getDefaultRoute } from '@/config/routeMetadata';
import { toast } from '@/hooks/use-toast';
import { announceToScreenReader } from '@/hooks/useScreenReaderAnnouncement';
import { logTabRestorationError, logTabActionError } from '@/lib/tabErrorLogger';
import { useTabSettingsStore } from '@/stores/tabSettingsStore';

// Constants
const MAX_TABS_DEFAULT = 15;
const RETENTION_DAYS = 30;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const STORAGE_VERSION = 1;

interface TabState {
  // State
  tabs: Tab[];
  activeTabId: string | null;
  maxTabs: number;

  // Core Actions
  openTab: (path: string, title?: string, icon?: string) => string | null;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  clearAllTabs: () => void;

  // Advanced Actions
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  duplicateTab: (tabId: string) => void;
  closeOtherTabs: (tabId: string) => void;
  closeTabsToRight: (tabId: string) => void;
  updateTabMetadata: (tabId: string, updates: Partial<Tab>) => void;

  // Notification Actions
  setTabNotification: (tabId: string, type: TabNotificationType, message: string, title?: string) => void;
  clearTabNotification: (tabId: string) => void;
  showTabNotificationToast: (tabId: string) => void;

  // Persistence Actions
  restoreTabs: () => void;

  // Internal helpers
  _createDefaultTab: () => void;
  _generateTabId: () => string;
}

/**
 * Generate a unique tab ID (simple UUID v4)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      // Initial State
      tabs: [],
      activeTabId: null,
      maxTabs: MAX_TABS_DEFAULT,

      // Internal helper to generate tab ID
      _generateTabId: () => generateUUID(),

      // Internal helper to create default dashboard tab
      _createDefaultTab: () => {
        const defaultRoute = getDefaultRoute();
        const tabId = get()._generateTabId();
        const now = Date.now();

        const defaultTab: Tab = {
          id: tabId,
          path: defaultRoute.path,
          title: defaultRoute.title,
          icon: defaultRoute.icon,
          hasUnsavedChanges: false,
          scrollPosition: 0,
          createdAt: now,
          lastAccessedAt: now,
        };

        set({
          tabs: [defaultTab],
          activeTabId: tabId,
        });
      },

      // Core Action: Open a new tab or switch to existing
      openTab: (path: string, title?: string, icon?: string) => {
        try {
          const state = get();
          const settings = useTabSettingsStore.getState();

          // Check if tab already exists for this path
          const existingTab = state.tabs.find((tab) => tab.path === path);
          if (existingTab) {
            // Switch to existing tab
            set({
              activeTabId: existingTab.id,
              tabs: state.tabs.map((tab) =>
                tab.id === existingTab.id
                  ? { ...tab, lastAccessedAt: Date.now() }
                  : tab
              ),
            });
            
            // Announce to screen reader
            announceToScreenReader(`Switched to ${existingTab.title} tab`);
            
            return existingTab.id;
          }

          // Get max tabs from settings
          const maxTabs = settings.maxTabs;

          // Check max tab limit
          if (state.tabs.length >= maxTabs) {
            console.warn(`Maximum tab limit (${maxTabs}) reached`);
            
            // Display toast notification with actionable guidance
            toast({
              variant: 'destructive',
              title: 'Maximum Tab Limit Reached',
              description: `You have reached the maximum limit of ${maxTabs} tabs. Please close some tabs before opening new ones.`,
            });
            
            return null;
          }

          // Get metadata from route registry
          const metadata = getRouteMetadata(path);
          const tabTitle = title || metadata?.title || 'Untitled';
          const tabIcon = icon || metadata?.icon;

          // Create new tab
          const tabId = state._generateTabId();
          const now = Date.now();

          const newTab: Tab = {
            id: tabId,
            path,
            title: tabTitle,
            icon: tabIcon,
            hasUnsavedChanges: false,
            scrollPosition: 0,
            createdAt: now,
            lastAccessedAt: now,
          };

          set({
            tabs: [...state.tabs, newTab],
            activeTabId: tabId,
          });

          // Announce to screen reader
          announceToScreenReader(`Opened new tab: ${tabTitle}. ${state.tabs.length + 1} tabs open`);

          return tabId;
        } catch (error) {
          logTabActionError('openTab', error);
          toast({
            variant: 'destructive',
            title: 'Failed to Open Tab',
            description: 'An error occurred while opening the tab. Please try again.',
          });
          return null;
        }
      },

      // Core Action: Close a tab
      closeTab: (tabId: string) => {
        try {
          const state = get();
          const tabIndex = state.tabs.findIndex((tab) => tab.id === tabId);

          if (tabIndex === -1) {
            console.warn(`Attempted to close non-existent tab: ${tabId}`);
            return;
          }

          const closedTab = state.tabs[tabIndex];
          const newTabs = state.tabs.filter((tab) => tab.id !== tabId);

          // If closing the last tab, create default dashboard tab
          if (newTabs.length === 0) {
            get()._createDefaultTab();
            announceToScreenReader('Closed last tab. Opened Dashboard tab');
            return;
          }

          // Determine new active tab if we closed the active one
          let newActiveTabId = state.activeTabId;
          let newActiveTab = null;
          if (state.activeTabId === tabId) {
            // Switch to the tab to the left, or the first tab if closing the first tab
            const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
            newActiveTabId = newTabs[newActiveIndex].id;
            newActiveTab = newTabs[newActiveIndex];
          }

          set({
            tabs: newTabs,
            activeTabId: newActiveTabId,
          });

          // Announce to screen reader
          if (newActiveTab) {
            announceToScreenReader(`Closed ${closedTab.title} tab. Switched to ${newActiveTab.title}. ${newTabs.length} tabs remaining`);
          } else {
            announceToScreenReader(`Closed ${closedTab.title} tab. ${newTabs.length} tabs remaining`);
          }
        } catch (error) {
          logTabActionError('closeTab', error);
          toast({
            variant: 'destructive',
            title: 'Failed to Close Tab',
            description: 'An error occurred while closing the tab.',
          });
        }
      },

      // Core Action: Set active tab
      setActiveTab: (tabId: string) => {
        const state = get();
        const tab = state.tabs.find((t) => t.id === tabId);

        if (!tab) {
          console.warn(`Tab with id ${tabId} not found`);
          return;
        }

        // Only announce if switching to a different tab
        const isChangingTab = state.activeTabId !== tabId;

        set({
          activeTabId: tabId,
          tabs: state.tabs.map((t) =>
            t.id === tabId 
              ? { 
                  ...t, 
                  lastAccessedAt: Date.now(),
                  // Clear notification when tab becomes active
                  hasNotification: false,
                  notification: undefined,
                } 
              : t
          ),
        });

        // Announce to screen reader
        if (isChangingTab) {
          const tabIndex = state.tabs.findIndex((t) => t.id === tabId);
          announceToScreenReader(`Switched to ${tab.title} tab. Tab ${tabIndex + 1} of ${state.tabs.length}`);
        }
      },

      // Core Action: Clear all tabs and create default
      clearAllTabs: () => {
        get()._createDefaultTab();
      },

      // Advanced Action: Reorder tabs (for drag-and-drop)
      reorderTabs: (fromIndex: number, toIndex: number) => {
        const state = get();

        if (
          fromIndex < 0 ||
          fromIndex >= state.tabs.length ||
          toIndex < 0 ||
          toIndex >= state.tabs.length
        ) {
          return;
        }

        const newTabs = [...state.tabs];
        const [movedTab] = newTabs.splice(fromIndex, 1);
        newTabs.splice(toIndex, 0, movedTab);

        set({ tabs: newTabs });
      },

      // Advanced Action: Duplicate a tab
      duplicateTab: (tabId: string) => {
        const state = get();
        const settings = useTabSettingsStore.getState();
        const sourceTab = state.tabs.find((tab) => tab.id === tabId);

        if (!sourceTab) {
          return;
        }

        // Get max tabs from settings
        const maxTabs = settings.maxTabs;

        // Check max tab limit
        if (state.tabs.length >= maxTabs) {
          console.warn(`Maximum tab limit (${maxTabs}) reached`);
          
          // Display toast notification with actionable guidance
          toast({
            variant: 'destructive',
            title: 'Maximum Tab Limit Reached',
            description: `You have reached the maximum limit of ${maxTabs} tabs. Please close some tabs before duplicating.`,
          });
          
          return;
        }

        const sourceIndex = state.tabs.findIndex((tab) => tab.id === tabId);
        const newTabId = state._generateTabId();
        const now = Date.now();

        const duplicatedTab: Tab = {
          ...sourceTab,
          id: newTabId,
          createdAt: now,
          lastAccessedAt: now,
          hasUnsavedChanges: false, // Don't copy unsaved changes
        };

        // Insert duplicated tab right after the source tab
        const newTabs = [...state.tabs];
        newTabs.splice(sourceIndex + 1, 0, duplicatedTab);

        set({
          tabs: newTabs,
          activeTabId: newTabId,
        });

        // Announce to screen reader
        announceToScreenReader(`Duplicated ${sourceTab.title} tab. ${newTabs.length} tabs open`);
      },

      // Advanced Action: Close all tabs except the specified one
      closeOtherTabs: (tabId: string) => {
        const state = get();
        const tab = state.tabs.find((t) => t.id === tabId);

        if (!tab) {
          return;
        }

        const closedCount = state.tabs.length - 1;

        set({
          tabs: [tab],
          activeTabId: tabId,
        });

        // Announce to screen reader
        if (closedCount > 0) {
          announceToScreenReader(`Closed ${closedCount} other ${closedCount === 1 ? 'tab' : 'tabs'}. Only ${tab.title} tab remains`);
        }
      },

      // Advanced Action: Close all tabs to the right of the specified tab
      closeTabsToRight: (tabId: string) => {
        const state = get();
        const tabIndex = state.tabs.findIndex((tab) => tab.id === tabId);

        if (tabIndex === -1) {
          return;
        }

        const newTabs = state.tabs.slice(0, tabIndex + 1);
        const closedCount = state.tabs.length - newTabs.length;

        // If active tab was closed, switch to the specified tab
        const activeTabStillExists = newTabs.some(
          (tab) => tab.id === state.activeTabId
        );

        set({
          tabs: newTabs,
          activeTabId: activeTabStillExists ? state.activeTabId : tabId,
        });

        // Announce to screen reader
        if (closedCount > 0) {
          announceToScreenReader(`Closed ${closedCount} ${closedCount === 1 ? 'tab' : 'tabs'} to the right. ${newTabs.length} tabs remaining`);
        }
      },

      // Advanced Action: Update tab metadata
      updateTabMetadata: (tabId: string, updates: Partial<Tab>) => {
        const state = get();

        set({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, ...updates } : tab
          ),
        });
      },

      // Notification Action: Set a notification on a tab
      setTabNotification: (tabId: string, type: TabNotificationType, message: string, title?: string) => {
        const state = get();
        const tab = state.tabs.find((t) => t.id === tabId);

        if (!tab) {
          console.warn(`Tab with id ${tabId} not found`);
          return;
        }

        const notification: TabNotification = {
          type,
          message,
          title,
          timestamp: Date.now(),
        };

        set({
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? { ...t, hasNotification: true, notification }
              : t
          ),
        });

        // Announce to screen reader if tab is not active
        if (state.activeTabId !== tabId) {
          announceToScreenReader(`Notification in ${tab.title} tab: ${message}`);
        }
      },

      // Notification Action: Clear notification from a tab
      clearTabNotification: (tabId: string) => {
        const state = get();

        set({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId
              ? { ...tab, hasNotification: false, notification: undefined }
              : tab
          ),
        });
      },

      // Notification Action: Show toast for tab notification
      showTabNotificationToast: (tabId: string) => {
        const state = get();
        const tab = state.tabs.find((t) => t.id === tabId);

        if (!tab || !tab.notification) {
          return;
        }

        const { type, message, title } = tab.notification;

        // Map notification type to toast variant
        const variant = type === 'error' ? 'destructive' : 'default';

        toast({
          variant,
          title: title || `Notification in ${tab.title}`,
          description: message,
        });
      },

      // Persistence Action: Restore tabs from localStorage
      restoreTabs: () => {
        try {
          const state = get();

          // If tabs already exist (from persistence), validate them
          if (state.tabs.length > 0) {
            // Validate tab structure
            const isValidTab = (tab: any): tab is Tab => {
              return (
                tab &&
                typeof tab === 'object' &&
                typeof tab.id === 'string' &&
                typeof tab.path === 'string' &&
                typeof tab.title === 'string' &&
                typeof tab.hasUnsavedChanges === 'boolean' &&
                typeof tab.scrollPosition === 'number' &&
                typeof tab.createdAt === 'number' &&
                typeof tab.lastAccessedAt === 'number'
              );
            };

            // Filter out invalid tabs
            const validTabs = state.tabs.filter(isValidTab);

            if (validTabs.length === 0) {
              // All tabs are corrupted, create default
              logTabRestorationError(
                new Error('All persisted tabs are corrupted'),
                state.tabs
              );
              toast({
                variant: 'destructive',
                title: 'Tab Restoration Failed',
                description: 'Your previous tabs could not be restored. Starting with a fresh Dashboard tab.',
              });
              get()._createDefaultTab();
              return;
            }

            if (validTabs.length < state.tabs.length) {
              // Some tabs were corrupted
              const corruptedCount = state.tabs.length - validTabs.length;
              console.warn(`${corruptedCount} corrupted tab(s) removed during restoration`);
              toast({
                title: 'Some Tabs Could Not Be Restored',
                description: `${corruptedCount} tab(s) were corrupted and have been removed.`,
              });
            }

            // Check if persisted data is within retention period
            const oldestTab = validTabs.reduce((oldest, tab) =>
              tab.createdAt < oldest.createdAt ? tab : oldest
            );

            const age = Date.now() - oldestTab.createdAt;

            if (age > RETENTION_MS) {
              // Data is too old, clear and create default
              console.log('Persisted tabs expired (older than 30 days), creating default tab');
              toast({
                title: 'Tabs Expired',
                description: 'Your previous tabs were older than 30 days and have been cleared.',
              });
              get()._createDefaultTab();
              return;
            }

            // Validate active tab exists
            const activeTabExists = validTabs.some(
              (tab) => tab.id === state.activeTabId
            );

            if (!activeTabExists && validTabs.length > 0) {
              // Set first tab as active
              console.warn('Active tab not found in persisted tabs, setting first tab as active');
              set({ 
                tabs: validTabs,
                activeTabId: validTabs[0].id 
              });
              return;
            }

            // Update state with valid tabs if any were filtered out
            if (validTabs.length < state.tabs.length) {
              set({ tabs: validTabs });
            }

            return;
          }

          // No persisted tabs, create default
          get()._createDefaultTab();
        } catch (error) {
          // Handle any unexpected errors during restoration
          const rawData = (() => {
            try {
              return localStorage.getItem('tab-storage');
            } catch {
              return null;
            }
          })();

          logTabRestorationError(error, rawData);

          // Show user-friendly error message
          toast({
            variant: 'destructive',
            title: 'Tab Restoration Failed',
            description: 'An error occurred while restoring your tabs. Starting with a fresh Dashboard tab.',
          });

          // Clear corrupted data and create default tab
          try {
            localStorage.removeItem('tab-storage');
          } catch (clearError) {
            console.error('Failed to clear corrupted tab storage:', clearError);
          }

          get()._createDefaultTab();
        }
      },
    }),
    {
      name: 'tab-storage',
      version: STORAGE_VERSION,
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        maxTabs: state.maxTabs,
      }),
    }
  )
);
