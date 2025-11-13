import { useKeyboardShortcuts } from './useKeyboardShortcut';

interface UseFormKeyboardShortcutsOptions {
  onSave?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

/**
 * Hook to add keyboard shortcuts to forms
 * @param options - Form keyboard shortcut options
 */
export function useFormKeyboardShortcuts(options: UseFormKeyboardShortcutsOptions) {
  const { onSave, onSubmit, onCancel, enabled = true } = options;

  useKeyboardShortcuts([
    {
      // Save form with Ctrl+S
      options: { key: 's', ctrl: true, enabled: enabled && !!onSave },
      callback: () => onSave?.(),
    },
    {
      // Submit form with Ctrl+Enter
      options: { key: 'Enter', ctrl: true, enabled: enabled && !!onSubmit },
      callback: () => onSubmit?.(),
    },
    {
      // Cancel/close with Escape
      options: { key: 'Escape', enabled: enabled && !!onCancel },
      callback: () => onCancel?.(),
    },
  ]);
}
