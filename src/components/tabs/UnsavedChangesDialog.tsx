/**
 * UnsavedChangesDialog Component
 * 
 * Confirmation dialog shown when attempting to close a tab with unsaved changes.
 * Provides three options: Save and Close, Discard Changes, or Cancel.
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface UnsavedChangesDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Tab title to display in the dialog
   */
  tabTitle: string;
  
  /**
   * Callback when user chooses to save and close
   * Should return a promise that resolves when save is complete
   */
  onSaveAndClose?: () => Promise<void>;
  
  /**
   * Callback when user chooses to discard changes and close
   */
  onDiscardAndClose: () => void;
  
  /**
   * Callback when user cancels (keeps tab open)
   */
  onCancel?: () => void;
  
  /**
   * Whether to show the "Save and Close" button
   * Set to false if there's no save handler available
   */
  showSaveButton?: boolean;
  
  /**
   * Whether the save operation is in progress
   */
  isSaving?: boolean;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  tabTitle,
  onSaveAndClose,
  onDiscardAndClose,
  onCancel,
  showSaveButton = true,
  isSaving = false,
}: UnsavedChangesDialogProps) {
  const handleSaveAndClose = async () => {
    if (onSaveAndClose) {
      try {
        await onSaveAndClose();
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to save changes:', error);
        // Keep dialog open on error
      }
    }
  };

  const handleDiscardAndClose = () => {
    onDiscardAndClose();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            The tab "{tabTitle}" has unsaved changes. What would you like to do?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {/* Cancel button */}
          <AlertDialogCancel onClick={handleCancel} disabled={isSaving}>
            Cancel
          </AlertDialogCancel>
          
          {/* Discard button */}
          <Button
            variant="destructive"
            onClick={handleDiscardAndClose}
            disabled={isSaving}
          >
            Discard Changes
          </Button>
          
          {/* Save and Close button (optional) */}
          {showSaveButton && onSaveAndClose && (
            <AlertDialogAction
              onClick={handleSaveAndClose}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : 'Save and Close'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
