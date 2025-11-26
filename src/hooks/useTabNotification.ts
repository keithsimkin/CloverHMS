/**
 * useTabNotification Hook
 * 
 * Provides utilities for managing tab notifications.
 * Allows components to set, clear, and show notifications on tabs.
 */

import { useCallback } from 'react';
import { useTabStore } from '@/stores/tabStore';
import { TabNotificationType } from '@/types/tab';

export interface UseTabNotificationReturn {
  /**
   * Set a notification on a specific tab
   * @param tabId - ID of the tab to notify
   * @param type - Type of notification
   * @param message - Notification message
   * @param title - Optional notification title
   */
  setNotification: (
    tabId: string,
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;

  /**
   * Clear notification from a specific tab
   * @param tabId - ID of the tab to clear notification from
   */
  clearNotification: (tabId: string) => void;

  /**
   * Show a toast for a tab's notification
   * @param tabId - ID of the tab whose notification to show
   */
  showNotificationToast: (tabId: string) => void;

  /**
   * Set a notification on the current active tab
   * @param type - Type of notification
   * @param message - Notification message
   * @param title - Optional notification title
   */
  notifyCurrentTab: (
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;

  /**
   * Set a notification on a tab by path (finds tab with matching path)
   * @param path - Route path of the tab
   * @param type - Type of notification
   * @param message - Notification message
   * @param title - Optional notification title
   */
  notifyTabByPath: (
    path: string,
    type: TabNotificationType,
    message: string,
    title?: string
  ) => void;
}

/**
 * Hook for managing tab notifications
 */
export function useTabNotification(): UseTabNotificationReturn {
  const setTabNotification = useTabStore((state) => state.setTabNotification);
  const clearTabNotification = useTabStore((state) => state.clearTabNotification);
  const showTabNotificationToast = useTabStore((state) => state.showTabNotificationToast);
  const activeTabId = useTabStore((state) => state.activeTabId);
  const tabs = useTabStore((state) => state.tabs);

  const setNotification = useCallback(
    (tabId: string, type: TabNotificationType, message: string, title?: string) => {
      setTabNotification(tabId, type, message, title);
    },
    [setTabNotification]
  );

  const clearNotification = useCallback(
    (tabId: string) => {
      clearTabNotification(tabId);
    },
    [clearTabNotification]
  );

  const showNotificationToast = useCallback(
    (tabId: string) => {
      showTabNotificationToast(tabId);
    },
    [showTabNotificationToast]
  );

  const notifyCurrentTab = useCallback(
    (type: TabNotificationType, message: string, title?: string) => {
      if (activeTabId) {
        setTabNotification(activeTabId, type, message, title);
      }
    },
    [activeTabId, setTabNotification]
  );

  const notifyTabByPath = useCallback(
    (path: string, type: TabNotificationType, message: string, title?: string) => {
      const tab = tabs.find((t) => t.path === path);
      if (tab) {
        setTabNotification(tab.id, type, message, title);
      }
    },
    [tabs, setTabNotification]
  );

  return {
    setNotification,
    clearNotification,
    showNotificationToast,
    notifyCurrentTab,
    notifyTabByPath,
  };
}
