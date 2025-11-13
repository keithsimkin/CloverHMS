import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';

/**
 * Global keyboard shortcuts component
 * Handles application-wide keyboard shortcuts
 */
export function GlobalKeyboardShortcuts() {
  const navigate = useNavigate();
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);

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
    <KeyboardShortcutsDialog
      open={showShortcutsDialog}
      onOpenChange={setShowShortcutsDialog}
    />
  );
}
