/**
 * useTabReload Hook
 * 
 * Provides functionality to reload the current tab or a specific tab.
 * Useful for error recovery and manual refresh operations.
 */

import { useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useTabStore } from '@/stores/tabStore';
import { toast } from '@/hooks/use-toast';

export function useTabReload() {
  const router = useRouter();
  const { tabs, activeTabId } = useTabStore();

  /**
   * Reload a specific tab by ID
   */
  const reloadTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    
    if (!tab) {
      console.error(`Tab with id ${tabId} not found`);
      toast({
        variant: 'destructive',
        title: 'Reload Failed',
        description: 'The tab could not be found.',
      });
      return;
    }

    try {
      // Navigate to the tab's path to trigger a fresh render
      router.navigate({ to: tab.path as any });
      
      toast({
        title: 'Tab Reloaded',
        description: `${tab.title} has been reloaded.`,
      });
    } catch (error) {
      console.error('Error reloading tab:', error);
      
      toast({
        variant: 'destructive',
        title: 'Reload Failed',
        description: 'An error occurred while reloading the tab.',
      });
    }
  }, [tabs, router]);

  /**
   * Reload the currently active tab
   */
  const reloadCurrentTab = useCallback(() => {
    if (!activeTabId) {
      console.warn('No active tab to reload');
      return;
    }

    reloadTab(activeTabId);
  }, [activeTabId, reloadTab]);

  /**
   * Force reload the entire application
   * Use as a last resort when tab reload doesn't work
   */
  const forceReload = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    reloadTab,
    reloadCurrentTab,
    forceReload,
  };
}
