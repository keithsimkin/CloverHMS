/**
 * useTabClose Hook
 * 
 * Hook that provides a safe tab close function that checks for unsaved changes
 * and shows a confirmation dialog if needed.
 */

import { useState, useCallback } from 'react';
import { useTabStore } from '@/stores/tabStore';

interface UseTabCloseReturn {
  /**
   * Close a tab with unsaved changes confirmation
   */
  closeTab: (tabId: string) => void;
  
  /**
   * Dialog state
   */
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  
  /**
   * Pending close tab info
   */
  pendingCloseTab: { id: string; title: string } | null;
  
  /**
   * Confirm close (discard changes)
   */
  confirmClose: () => void;
  
  /**
   * Cancel close
   */
  cancelClose: () => void;
}

export function useTabClose(): UseTabCloseReturn {
  const { tabs, closeTab: closeTabStore } = useTabStore();
  const [pendingCloseTabId, setPendingCloseTabId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get the tab that's pending close
  const pendingCloseTab = pendingCloseTabId
    ? tabs.find((tab) => tab.id === pendingCloseTabId)
    : null;

  /**
   * Handle tab close request
   * If tab has unsaved changes, show confirmation dialog
   * Otherwise, close immediately
   */
  const closeTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      
      if (!tab) {
        return;
      }

      // If tab has unsaved changes, show confirmation dialog
      if (tab.hasUnsavedChanges) {
        setPendingCloseTabId(tabId);
        setDialogOpen(true);
      } else {
        // No unsaved changes, close immediately
        closeTabStore(tabId);
      }
    },
    [tabs, closeTabStore]
  );

  /**
   * Confirm close (discard changes)
   */
  const confirmClose = useCallback(() => {
    if (pendingCloseTabId) {
      closeTabStore(pendingCloseTabId);
      setPendingCloseTabId(null);
      setDialogOpen(false);
    }
  }, [pendingCloseTabId, closeTabStore]);

  /**
   * Cancel close
   */
  const cancelClose = useCallback(() => {
    setPendingCloseTabId(null);
    setDialogOpen(false);
  }, []);

  return {
    closeTab,
    dialogOpen,
    setDialogOpen,
    pendingCloseTab: pendingCloseTab
      ? { id: pendingCloseTab.id, title: pendingCloseTab.title }
      : null,
    confirmClose,
    cancelClose,
  };
}
