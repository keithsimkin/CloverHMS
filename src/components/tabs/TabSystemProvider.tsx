/**
 * TabSystemProvider Component
 * 
 * Wraps the entire app to provide tab system functionality.
 * - Initializes TabStore on mount
 * - Calls restoreTabs on app startup
 * - Renders TabBar and TabContentArea
 * - Sets up navigation interception for tab creation
 * - Handles keyboard shortcuts for tab management
 */

import { useEffect, ReactNode } from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { TabBar } from './TabBar';
import { TabContentArea } from './TabContentArea';
import { TauriTitleBar } from '@/components/layout/TauriTitleBar';
import { useTabStore } from '@/stores/tabStore';
import { useTabSettingsStore } from '@/stores/tabSettingsStore';
import { getRouteMetadata } from '@/config/routeMetadata';

interface TabSystemProviderProps {
  children: ReactNode;
}

export function TabSystemProvider({ children }: TabSystemProviderProps) {
  const router = useRouter();
  const routerState = useRouterState();
  const { restoreTabs, openTab, closeTab, setActiveTab, tabs, activeTabId } = useTabStore();
  const { enabled: tabSystemEnabled, persistTabs } = useTabSettingsStore();

  // Initialize tab system on mount
  useEffect(() => {
    // Only restore tabs if tab system is enabled and persistence is enabled
    if (tabSystemEnabled && persistTabs) {
      restoreTabs();
    }
  }, [restoreTabs, tabSystemEnabled, persistTabs]);

  // Intercept navigation to create/switch tabs
  useEffect(() => {
    const currentPath = routerState.location.pathname;
    
    // Skip login page - don't create tabs for it
    if (currentPath === '/login') {
      return;
    }

    // Get route metadata
    const metadata = getRouteMetadata(currentPath);
    
    // Open tab for current route (will switch to existing or create new)
    if (metadata) {
      openTab(currentPath, metadata.title, metadata.icon);
    } else {
      // Fallback for routes without metadata
      openTab(currentPath);
    }
  }, [routerState.location.pathname, openTab]);

  // Sync router navigation with active tab
  useEffect(() => {
    if (!activeTabId) return;

    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const currentPath = routerState.location.pathname;
    
    // If active tab path doesn't match current route, navigate to it
    if (activeTab.path !== currentPath && activeTab.path !== '/login') {
      router.navigate({ to: activeTab.path as any });
    }
  }, [activeTabId, tabs, router, routerState.location.pathname]);

  // Global keyboard shortcuts for tab management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + T: Open new tab (Dashboard)
      if (modKey && e.key === 't') {
        e.preventDefault();
        const metadata = getRouteMetadata('/');
        if (metadata) {
          openTab('/', metadata.title, metadata.icon);
        }
        return;
      }

      // Ctrl/Cmd + W: Close active tab
      if (modKey && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
        return;
      }

      // Ctrl/Cmd + Tab: Switch to next tab
      if (modKey && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
        if (currentIndex !== -1 && tabs.length > 1) {
          const nextIndex = (currentIndex + 1) % tabs.length;
          setActiveTab(tabs[nextIndex].id);
        }
        return;
      }

      // Ctrl/Cmd + Shift + Tab: Switch to previous tab
      if (modKey && e.shiftKey && e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
        if (currentIndex !== -1 && tabs.length > 1) {
          const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          setActiveTab(tabs[prevIndex].id);
        }
        return;
      }

      // Ctrl/Cmd + 1-9: Switch to tab by index
      if (modKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < tabs.length) {
          setActiveTab(tabs[index].id);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTabId, openTab, closeTab, setActiveTab]);

  // Check if we're on the login page
  const isLoginPage = routerState.location.pathname === '/login';

  // If on login page or tab system is disabled, just render children without tab system
  if (isLoginPage || !tabSystemEnabled) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Tauri Title Bar (only shows in Tauri) */}
      <TauriTitleBar />
      
      {/* Tab Bar */}
      <TabBar />
      
      {/* Tab Content Area */}
      <TabContentArea>
        {children}
      </TabContentArea>
    </div>
  );
}
