/**
 * useTabNavigation hook
 * Provides navigation utilities that work with the tab system
 * 
 * This hook integrates TanStack Router with the tab system to provide
 * seamless navigation that respects tab context and user preferences.
 */

import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTabStore } from '@/stores/tabStore';
import { getRouteMetadata } from '@/config/routeMetadata';
import { Tab } from '@/types/tab';

export interface UseTabNavigationReturn {
  /**
   * Navigate to a path, creating a new tab or switching to existing tab
   * @param path - The route path to navigate to
   * @param title - Optional custom title (defaults to route metadata)
   * @param newTab - Force creation of a new tab even if one exists
   */
  navigateToTab: (path: string, title?: string, newTab?: boolean) => void;

  /**
   * Navigate within the current active tab (no tab switching)
   * @param path - The route path to navigate to
   */
  navigateInCurrentTab: (path: string) => void;

  /**
   * Force open a path in a new tab (always creates new tab)
   * @param path - The route path to navigate to
   * @param title - Optional custom title (defaults to route metadata)
   */
  openInNewTab: (path: string, title?: string) => void;

  /**
   * Get the currently active tab information
   * @returns The active Tab object or null if no tab is active
   */
  getCurrentTab: () => Tab | null;
}

/**
 * Hook to navigate with tab system integration
 */
export const useTabNavigation = (): UseTabNavigationReturn => {
  const navigate = useNavigate();
  const { tabs, activeTabId, openTab, setActiveTab, updateTabMetadata } = useTabStore();

  /**
   * Navigate to a tab, creating or switching as needed
   */
  const navigateToTab = useCallback(
    (path: string, title?: string, newTab: boolean = false) => {
      // Get route metadata for title and icon
      const metadata = getRouteMetadata(path);
      const tabTitle = title || metadata?.title || 'Untitled';
      const tabIcon = metadata?.icon;

      if (newTab) {
        // Force new tab creation
        const tabId = openTab(path, tabTitle, tabIcon);
        if (tabId) {
          // Navigate to the path
          navigate({ to: path as any });
        }
      } else {
        // Check if tab already exists
        const existingTab = tabs.find((tab) => tab.path === path);
        
        if (existingTab) {
          // Switch to existing tab
          setActiveTab(existingTab.id);
          navigate({ to: path as any });
        } else {
          // Create new tab
          const tabId = openTab(path, tabTitle, tabIcon);
          if (tabId) {
            // Navigate to the path
            navigate({ to: path as any });
          }
        }
      }
    },
    [navigate, tabs, openTab, setActiveTab]
  );

  /**
   * Navigate within the current tab without creating a new tab
   */
  const navigateInCurrentTab = useCallback(
    (path: string) => {
      if (!activeTabId) {
        // No active tab, create one
        navigateToTab(path);
        return;
      }

      // Get route metadata
      const metadata = getRouteMetadata(path);
      const tabTitle = metadata?.title || 'Untitled';
      const tabIcon = metadata?.icon;

      // Update current tab's path and metadata
      updateTabMetadata(activeTabId, {
        path,
        title: tabTitle,
        icon: tabIcon,
        lastAccessedAt: Date.now(),
      });

      // Navigate to the path
      navigate({ to: path as any });
    },
    [activeTabId, navigate, navigateToTab, updateTabMetadata]
  );

  /**
   * Force open in a new tab
   */
  const openInNewTab = useCallback(
    (path: string, title?: string) => {
      navigateToTab(path, title, true);
    },
    [navigateToTab]
  );

  /**
   * Get the currently active tab
   */
  const getCurrentTab = useCallback((): Tab | null => {
    if (!activeTabId) {
      return null;
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    return activeTab || null;
  }, [tabs, activeTabId]);

  return {
    navigateToTab,
    navigateInCurrentTab,
    openInNewTab,
    getCurrentTab,
  };
};
