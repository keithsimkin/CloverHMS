import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';
import { useTabStore } from '@/stores/tabStore';
import { useTabClose } from '@/hooks/useTabClose';
import { UnsavedChangesDialog } from '@/components/tabs/UnsavedChangesDialog';

/**
 * Global keyboard shortcuts component
 * Handles application-wide keyboard shortcuts including tab management
 */
export function GlobalKeyboardShortcuts() {
  const navigate = useNavigate();
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  
  // Tab store actions
  const { tabs, activeTabId, openTab, setActiveTab } = useTabStore();
  
  // Tab close with unsaved changes confirmation
  const { 
    closeTab, 
    dialogOpen, 
    setDialogOpen, 
    pendingCloseTab, 
    confirmClose, 
    cancelClose 
  } = useTabClose();

  // Helper to get next tab
  const getNextTab = () => {
    if (tabs.length === 0 || !activeTabId) return null;
    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    const nextIndex = (currentIndex + 1) % tabs.length;
    return tabs[nextIndex];
  };

  // Helper to get previous tab
  const getPreviousTab = () => {
    if (tabs.length === 0 || !activeTabId) return null;
    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    return tabs[prevIndex];
  };

  // Helper to get tab by index (1-based)
  const getTabByIndex = (index: number) => {
    if (index < 1 || index > tabs.length) return null;
    return tabs[index - 1];
  };

  // Detect if we're on macOS
  const isMac = typeof navigator !== 'undefined' && 
    (navigator.userAgent.toUpperCase().indexOf('MAC') >= 0 || 
     navigator.userAgent.toUpperCase().indexOf('DARWIN') >= 0);

  // Register global shortcuts
  useKeyboardShortcuts([
    {
      // Show keyboard shortcuts help
      options: { key: '?', shift: true },
      callback: () => setShowShortcutsDialog(true),
    },
    {
      // Close dialogs with Escape (handled by dialog components)
      options: { key: 'Escape' },
      callback: () => {
        // This is handled by individual dialog components
        // but we register it here for documentation
      },
    },
    // Tab Management Shortcuts
    {
      // Open new Dashboard tab (Ctrl+T / Cmd+T)
      options: { key: 't', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        openTab('/', 'Dashboard');
      },
    },
    {
      // Close active tab (Ctrl+W / Cmd+W)
      options: { key: 'w', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        if (activeTabId) {
          closeTab(activeTabId);
        }
      },
    },
    {
      // Switch to next tab (Ctrl+Tab)
      options: { key: 'Tab', ctrl: true },
      callback: () => {
        const nextTab = getNextTab();
        if (nextTab) {
          setActiveTab(nextTab.id);
        }
      },
    },
    {
      // Switch to previous tab (Ctrl+Shift+Tab)
      options: { key: 'Tab', ctrl: true, shift: true },
      callback: () => {
        const prevTab = getPreviousTab();
        if (prevTab) {
          setActiveTab(prevTab.id);
        }
      },
    },
    // Switch to tab by index (Ctrl+1 through Ctrl+9)
    {
      options: { key: '1', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(1);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '2', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(2);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '3', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(3);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '4', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(4);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '5', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(5);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '6', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(6);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '7', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(7);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '8', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(8);
        if (tab) setActiveTab(tab.id);
      },
    },
    {
      options: { key: '9', ...(isMac ? { meta: true } : { ctrl: true }) },
      callback: () => {
        const tab = getTabByIndex(9);
        if (tab) setActiveTab(tab.id);
      },
    },
    // Navigation shortcuts (existing)
    {
      // Navigate to Dashboard
      options: { key: 'h', ctrl: true },
      callback: () => navigate({ to: '/' }),
    },
    {
      // Navigate to Patients
      options: { key: 'p', ctrl: true },
      callback: () => navigate({ to: '/patients' }),
    },
    {
      // Navigate to Appointments
      options: { key: 'a', ctrl: true },
      callback: () => navigate({ to: '/appointments' }),
    },
  ]);

  // Close shortcuts dialog with Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showShortcutsDialog) {
        setShowShortcutsDialog(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showShortcutsDialog]);

  return (
    <>
      <KeyboardShortcutsDialog
        open={showShortcutsDialog}
        onOpenChange={setShowShortcutsDialog}
      />
      
      {/* Unsaved changes confirmation dialog for keyboard shortcuts */}
      {pendingCloseTab && (
        <UnsavedChangesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          tabTitle={pendingCloseTab.title}
          onDiscardAndClose={confirmClose}
          onCancel={cancelClose}
          showSaveButton={false}
        />
      )}
    </>
  );
}
