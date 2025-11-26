/**
 * TabCloseHandler Component
 * 
 * Wrapper component that handles tab closing with unsaved changes confirmation.
 * This component manages the dialog state and coordinates between the tab system
 * and the unsaved changes dialog.
 */

import { useState, useCallback, ReactNode } from 'react';
import { useTabStore } from '@/stores/tabStore';
import { useTabSettingsStore } from '@/stores/tabSettingsStore';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface TabCloseHandlerProps {
  children: (closeTab: (tabId: string) => void) => ReactNode;
}

/**
 * Context for managing tab close operations with unsaved changes confirmation
 */
export function TabCloseHandler({ children }: TabCloseHandlerProps) {
  const { tabs, closeTab: closeTabStore } = useTabStore();
  const { closeTabConfirmation } = useTabSettingsStore();
  const [pendingCloseTabId, setPendingCloseTabId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get the tab that's pending close
  const pendingTab = tabs.find((tab) => tab.id === pendingCloseTabId);

  /**
   * Handle tab close request
   * If tab has unsaved changes and confirmation is enabled, show confirmation dialog
   * Otherwise, close immediately
   */
  const handleCloseTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      
      if (!tab) {
        return;
      }

      // If tab has unsaved changes and confirmation is enabled, show confirmation dialog
      if (tab.hasUnsavedChanges && closeTabConfirmation) {
        setPendingCloseTabId(tabId);
        setDialogOpen(true);
      } else {
        // No unsaved changes or confirmation disabled, close immediately
        closeTabStore(tabId);
      }
    },
    [tabs, closeTabStore, closeTabConfirmation]
  );

  /**
   * Handle discard changes and close
   */
  const handleDiscardAndClose = useCallback(() => {
    if (pendingCloseTabId) {
      closeTabStore(pendingCloseTabId);
      setPendingCloseTabId(null);
    }
  }, [pendingCloseTabId, closeTabStore]);

  /**
   * Handle cancel (keep tab open)
   */
  const handleCancel = useCallback(() => {
    setPendingCloseTabId(null);
  }, []);

  return (
    <>
      {children(handleCloseTab)}
      
      {/* Unsaved changes confirmation dialog */}
      {pendingTab && (
        <UnsavedChangesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          tabTitle={pendingTab.title}
          onDiscardAndClose={handleDiscardAndClose}
          onCancel={handleCancel}
          showSaveButton={false}
        />
      )}
    </>
  );
}
