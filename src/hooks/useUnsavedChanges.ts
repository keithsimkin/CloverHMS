/**
 * useUnsavedChanges Hook
 * 
 * Hook for form components to track unsaved changes and integrate with the tab system.
 * Automatically updates the tab's hasUnsavedChanges flag when the dirty state changes.
 * 
 * @example
 * ```tsx
 * function PatientForm() {
 *   const { isDirty, setIsDirty } = useUnsavedChanges();
 *   
 *   // In your form logic
 *   useEffect(() => {
 *     setIsDirty(formState.isDirty);
 *   }, [formState.isDirty, setIsDirty]);
 *   
 *   return <form>...</form>;
 * }
 * ```
 */

import { useEffect, useState, useCallback } from 'react';
import { useTabStore } from '@/stores/tabStore';
import { useTabNavigation } from './useTabNavigation';

interface UseUnsavedChangesOptions {
  /**
   * Optional callback to save changes before closing
   * Should return a promise that resolves when save is complete
   */
  onSave?: () => Promise<void>;
  
  /**
   * Optional callback when changes are discarded
   */
  onDiscard?: () => void;
}

interface UseUnsavedChangesReturn {
  /**
   * Current dirty state
   */
  isDirty: boolean;
  
  /**
   * Set the dirty state
   */
  setIsDirty: (dirty: boolean) => void;
  
  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges: boolean;
  
  /**
   * Mark changes as saved (sets isDirty to false)
   */
  markAsSaved: () => void;
  
  /**
   * Save handler (calls onSave if provided)
   */
  save: () => Promise<void>;
  
  /**
   * Discard handler (calls onDiscard if provided)
   */
  discard: () => void;
}

export function useUnsavedChanges(
  options: UseUnsavedChangesOptions = {}
): UseUnsavedChangesReturn {
  const { onSave, onDiscard } = options;
  const [isDirty, setIsDirtyState] = useState(false);
  const { updateTabMetadata } = useTabStore();
  const { getCurrentTab } = useTabNavigation();

  // Update tab metadata when dirty state changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    if (currentTab) {
      updateTabMetadata(currentTab.id, { hasUnsavedChanges: isDirty });
    }
  }, [isDirty, getCurrentTab, updateTabMetadata]);

  // Wrapper for setIsDirty to ensure it updates the tab
  const setIsDirty = useCallback((dirty: boolean) => {
    setIsDirtyState(dirty);
  }, []);

  // Mark as saved
  const markAsSaved = useCallback(() => {
    setIsDirtyState(false);
  }, []);

  // Save handler
  const save = useCallback(async () => {
    if (onSave) {
      await onSave();
    }
    markAsSaved();
  }, [onSave, markAsSaved]);

  // Discard handler
  const discard = useCallback(() => {
    if (onDiscard) {
      onDiscard();
    }
    markAsSaved();
  }, [onDiscard, markAsSaved]);

  return {
    isDirty,
    setIsDirty,
    hasUnsavedChanges: isDirty,
    markAsSaved,
    save,
    discard,
  };
}
