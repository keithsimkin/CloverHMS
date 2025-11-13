import { useEffect, useCallback } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
}

/**
 * Hook to register keyboard shortcuts
 * @param options - Keyboard shortcut configuration
 * @param callback - Function to call when shortcut is triggered
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void
) {
  const { key, ctrl, shift, alt, meta, preventDefault = true, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the shortcut matches
      const isMatch =
        event.key.toLowerCase() === key.toLowerCase() &&
        (ctrl === undefined || event.ctrlKey === ctrl) &&
        (shift === undefined || event.shiftKey === shift) &&
        (alt === undefined || event.altKey === alt) &&
        (meta === undefined || event.metaKey === meta);

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    },
    [key, ctrl, shift, alt, meta, preventDefault, callback]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

/**
 * Hook to register multiple keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcut configurations
 */
export function useKeyboardShortcuts(
  shortcuts: Array<{
    options: KeyboardShortcutOptions;
    callback: () => void;
  }>
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const { options, callback } of shortcuts) {
        const { key, ctrl, shift, alt, meta, preventDefault = true, enabled = true } = options;

        if (!enabled) {
          continue;
        }

        const isMatch =
          event.key.toLowerCase() === key.toLowerCase() &&
          (ctrl === undefined || event.ctrlKey === ctrl) &&
          (shift === undefined || event.shiftKey === shift) &&
          (alt === undefined || event.altKey === alt) &&
          (meta === undefined || event.metaKey === meta);

        if (isMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback();
          break; // Only trigger the first matching shortcut
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Format keyboard shortcut for display
 * @param options - Keyboard shortcut configuration
 * @returns Formatted shortcut string (e.g., "Ctrl+S", "Esc")
 */
export function formatShortcut(options: KeyboardShortcutOptions): string {
  const parts: string[] = [];

  if (options.ctrl) parts.push('Ctrl');
  if (options.shift) parts.push('Shift');
  if (options.alt) parts.push('Alt');
  if (options.meta) parts.push('⌘');

  // Capitalize first letter of key
  const keyDisplay = options.key.charAt(0).toUpperCase() + options.key.slice(1);
  parts.push(keyDisplay);

  return parts.join('+');
}
