/**
 * Toast notification utilities
 * Provides common toast notification patterns
 */

import { toast } from '@/hooks/use-toast';
import { transformError, getUserFriendlyMessage, logError } from './errorUtils';

/**
 * Show a success toast notification
 */
export function showSuccessToast(title: string, description?: string) {
  toast({
    title,
    description,
    variant: 'default',
  });
}

/**
 * Show an error toast notification
 */
export function showErrorToast(title: string, description?: string) {
  toast({
    title,
    description,
    variant: 'destructive',
  });
}

/**
 * Show an error toast from an error object
 */
export function showErrorFromException(error: unknown, fallbackTitle = 'Error') {
  const appError = transformError(error);
  logError(appError);

  toast({
    title: fallbackTitle,
    description: getUserFriendlyMessage(appError),
    variant: 'destructive',
  });
}

/**
 * Show a network error toast
 */
export function showNetworkErrorToast() {
  toast({
    title: 'Network Error',
    description: 'Unable to connect to the server. Please check your internet connection and try again.',
    variant: 'destructive',
  });
}

/**
 * Show an authorization error toast
 */
export function showAuthorizationErrorToast() {
  toast({
    title: 'Permission Denied',
    description: 'You do not have permission to perform this action.',
    variant: 'destructive',
  });
}

/**
 * Show a validation error toast
 */
export function showValidationErrorToast(message?: string) {
  toast({
    title: 'Validation Error',
    description: message || 'Please check your input and try again.',
    variant: 'destructive',
  });
}

/**
 * Show a loading toast (returns dismiss function)
 */
export function showLoadingToast(message: string) {
  const { dismiss } = toast({
    title: message,
    description: 'Please wait...',
    duration: Infinity, // Don't auto-dismiss
  });
  return dismiss;
}

/**
 * CRUD operation toast notifications
 */
export const crudToasts = {
  createSuccess: (entityName: string) =>
    showSuccessToast('Created Successfully', `${entityName} has been created.`),
  
  createError: (entityName: string, error?: unknown) => {
    if (error) {
      showErrorFromException(error, `Failed to Create ${entityName}`);
    } else {
      showErrorToast(`Failed to Create ${entityName}`, 'An error occurred while creating the record.');
    }
  },

  updateSuccess: (entityName: string) =>
    showSuccessToast('Updated Successfully', `${entityName} has been updated.`),
  
  updateError: (entityName: string, error?: unknown) => {
    if (error) {
      showErrorFromException(error, `Failed to Update ${entityName}`);
    } else {
      showErrorToast(`Failed to Update ${entityName}`, 'An error occurred while updating the record.');
    }
  },

  deleteSuccess: (entityName: string) =>
    showSuccessToast('Deleted Successfully', `${entityName} has been deleted.`),
  
  deleteError: (entityName: string, error?: unknown) => {
    if (error) {
      showErrorFromException(error, `Failed to Delete ${entityName}`);
    } else {
      showErrorToast(`Failed to Delete ${entityName}`, 'An error occurred while deleting the record.');
    }
  },

  saveSuccess: () =>
    showSuccessToast('Saved Successfully', 'Your changes have been saved.'),
  
  saveError: (error?: unknown) => {
    if (error) {
      showErrorFromException(error, 'Failed to Save');
    } else {
      showErrorToast('Failed to Save', 'An error occurred while saving your changes.');
    }
  },
};

/**
 * Appointment-specific toast notifications
 */
export const appointmentToasts = {
  scheduled: () =>
    showSuccessToast('Appointment Scheduled', 'The appointment has been scheduled successfully.'),
  
  cancelled: () =>
    showSuccessToast('Appointment Cancelled', 'The appointment has been cancelled.'),
  
  rescheduled: () =>
    showSuccessToast('Appointment Rescheduled', 'The appointment has been rescheduled successfully.'),
  
  conflictError: () =>
    showErrorToast('Scheduling Conflict', 'This time slot is already booked. Please choose a different time.'),
};

/**
 * Patient flow toast notifications
 */
export const flowToasts = {
  stageTransition: (stage: string) =>
    showSuccessToast('Stage Updated', `Patient moved to ${stage}.`),
  
  registrationComplete: () =>
    showSuccessToast('Registration Complete', 'Patient has been registered successfully.'),
  
  dischargeComplete: () =>
    showSuccessToast('Discharge Complete', 'Patient has been discharged successfully.'),
};

/**
 * Inventory toast notifications
 */
export const inventoryToasts = {
  lowStock: (itemName: string) =>
    toast({
      title: 'Low Stock Alert',
      description: `${itemName} is running low. Please reorder soon.`,
      variant: 'destructive',
    }),
  
  transactionRecorded: () =>
    showSuccessToast('Transaction Recorded', 'Inventory transaction has been recorded.'),
};

/**
 * Clinical workflow toast notifications
 */
export const clinicalToasts = {
  visitSaved: () =>
    showSuccessToast('Visit Saved', 'Patient visit has been saved successfully.'),
  
  prescriptionCreated: () =>
    showSuccessToast('Prescription Created', 'Prescription has been created successfully.'),
  
  drugInteractionWarning: (message: string) =>
    toast({
      title: 'Drug Interaction Warning',
      description: message,
      variant: 'destructive',
      duration: 10000, // Show longer for important warnings
    }),
};

/**
 * Authentication toast notifications
 */
export const authToasts = {
  loginSuccess: () =>
    showSuccessToast('Welcome Back', 'You have been logged in successfully.'),
  
  loginError: () =>
    showErrorToast('Login Failed', 'Invalid email or password. Please try again.'),
  
  logoutSuccess: () =>
    showSuccessToast('Logged Out', 'You have been logged out successfully.'),
  
  sessionExpired: () =>
    toast({
      title: 'Session Expired',
      description: 'Your session has expired. Please log in again.',
      variant: 'destructive',
    }),
  
  accountLocked: () =>
    toast({
      title: 'Account Locked',
      description: 'Too many failed login attempts. Your account has been locked for 15 minutes.',
      variant: 'destructive',
      duration: 10000,
    }),
};
