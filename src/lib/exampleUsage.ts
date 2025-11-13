/**
 * Example Usage of Error Handling and Toast Utilities
 * This file demonstrates how to use the error handling and toast notification utilities
 * in various scenarios throughout the application.
 */

import {
  showSuccessToast,
  showErrorToast,
  showErrorFromException,
  showNetworkErrorToast,
  showLoadingToast,
  crudToasts,
  appointmentToasts,
  authToasts,
  clinicalToasts,
  flowToasts,
  inventoryToasts,
} from './toastUtils';
import { transformError, createValidationError, createNetworkError } from './errorUtils';

/**
 * Example 1: Basic CRUD Operations with Toast Notifications
 */
export async function exampleCreatePatient(patientData: any) {
  try {
    // Show loading toast
    const dismissLoading = showLoadingToast('Creating patient...');

    // Simulate API call
    const response = await fetch('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });

    // Dismiss loading toast
    dismissLoading();

    if (!response.ok) {
      throw new Error('Failed to create patient');
    }

    const patient = await response.json();

    // Show success toast
    crudToasts.createSuccess('Patient');

    return patient;
  } catch (error) {
    // Show error toast with transformed error
    crudToasts.createError('Patient', error);
    throw error;
  }
}

/**
 * Example 2: Update Operation with Error Handling
 */
export async function exampleUpdatePatient(patientId: string, updates: any) {
  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update patient');
    }

    crudToasts.updateSuccess('Patient');
    return await response.json();
  } catch (error) {
    crudToasts.updateError('Patient', error);
    throw error;
  }
}

/**
 * Example 3: Delete Operation
 */
export async function exampleDeletePatient(patientId: string) {
  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete patient');
    }

    crudToasts.deleteSuccess('Patient');
  } catch (error) {
    crudToasts.deleteError('Patient', error);
    throw error;
  }
}

/**
 * Example 4: Network Error Handling
 */
export async function exampleFetchWithNetworkError() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error('Network request failed');
    }

    return await response.json();
  } catch (error) {
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      showNetworkErrorToast();
    } else {
      showErrorFromException(error, 'Failed to Fetch Data');
    }
    throw error;
  }
}

/**
 * Example 5: Validation Error
 */
export function exampleValidation(formData: any) {
  if (!formData.firstName) {
    const error = createValidationError('First name is required');
    showErrorFromException(error);
    return false;
  }

  if (!formData.email || !formData.email.includes('@')) {
    const error = createValidationError('Valid email is required');
    showErrorFromException(error);
    return false;
  }

  return true;
}

/**
 * Example 6: Appointment Scheduling with Conflict Detection
 */
export async function exampleScheduleAppointment(appointmentData: any) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Check for scheduling conflict
      if (error.code === 'SCHEDULING_CONFLICT') {
        appointmentToasts.conflictError();
        throw new Error('Scheduling conflict');
      }

      throw new Error('Failed to schedule appointment');
    }

    appointmentToasts.scheduled();
    return await response.json();
  } catch (error) {
    if (!(error as Error).message.includes('conflict')) {
      showErrorFromException(error, 'Failed to Schedule Appointment');
    }
    throw error;
  }
}

/**
 * Example 7: Authentication with Toast Notifications
 */
export async function exampleLogin(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (error.code === 'ACCOUNT_LOCKED') {
        authToasts.accountLocked();
        throw new Error('Account locked');
      }

      authToasts.loginError();
      throw new Error('Login failed');
    }

    authToasts.loginSuccess();
    return await response.json();
  } catch (error) {
    // Error already handled with specific toast
    throw error;
  }
}

/**
 * Example 8: Clinical Workflow with Drug Interaction Warning
 */
export async function exampleCreatePrescription(prescriptionData: any) {
  try {
    const response = await fetch('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });

    const result = await response.json();

    // Check for drug interactions
    if (result.warnings && result.warnings.length > 0) {
      result.warnings.forEach((warning: string) => {
        clinicalToasts.drugInteractionWarning(warning);
      });
    }

    if (!response.ok) {
      throw new Error('Failed to create prescription');
    }

    clinicalToasts.prescriptionCreated();
    return result;
  } catch (error) {
    showErrorFromException(error, 'Failed to Create Prescription');
    throw error;
  }
}

/**
 * Example 9: Patient Flow Stage Transition
 */
export async function exampleTransitionFlowStage(flowId: string, toStage: string) {
  try {
    const response = await fetch(`/api/patient-flow/${flowId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ toStage }),
    });

    if (!response.ok) {
      throw new Error('Failed to transition stage');
    }

    flowToasts.stageTransition(toStage);
    return await response.json();
  } catch (error) {
    showErrorFromException(error, 'Failed to Update Stage');
    throw error;
  }
}

/**
 * Example 10: Inventory Low Stock Alert
 */
export function exampleCheckInventoryLevels(items: any[]) {
  items.forEach((item) => {
    if (item.quantity <= item.reorder_threshold) {
      inventoryToasts.lowStock(item.item_name);
    }
  });
}

/**
 * Example 11: Using Error Boundary with Custom Fallback
 * 
 * In a component file:
 * 
 * import { withErrorBoundary } from '@/components/common/ErrorBoundary';
 * 
 * function MyComponent() {
 *   // Component code that might throw errors
 *   return <div>...</div>;
 * }
 * 
 * export default withErrorBoundary(MyComponent, (error, resetError) => (
 *   <div>
 *     <h2>Custom Error UI</h2>
 *     <p>{error.message}</p>
 *     <button onClick={resetError}>Try Again</button>
 *   </div>
 * ));
 */

/**
 * Example 12: React Component with Loading and Error States
 * 
 * import { LoadingSpinner } from '@/components/common/LoadingSpinner';
 * import { TableSkeleton } from '@/components/common/SkeletonLoaders';
 * import { showErrorFromException } from '@/lib/toastUtils';
 * 
 * function PatientList() {
 *   const [patients, setPatients] = useState([]);
 *   const [isLoading, setIsLoading] = useState(true);
 *   const [error, setError] = useState(null);
 * 
 *   useEffect(() => {
 *     async function fetchPatients() {
 *       try {
 *         setIsLoading(true);
 *         const response = await fetch('/api/patients');
 *         const data = await response.json();
 *         setPatients(data);
 *       } catch (err) {
 *         setError(err);
 *         showErrorFromException(err, 'Failed to Load Patients');
 *       } finally {
 *         setIsLoading(false);
 *       }
 *     }
 *     fetchPatients();
 *   }, []);
 * 
 *   if (isLoading) {
 *     return <TableSkeleton rows={10} columns={5} />;
 *   }
 * 
 *   if (error) {
 *     return (
 *       <div className="text-center py-8">
 *         <p className="text-destructive">Failed to load patients</p>
 *         <Button onClick={() => window.location.reload()}>Retry</Button>
 *       </div>
 *     );
 *   }
 * 
 *   return (
 *     <Table>
 *       {patients.map(patient => (
 *         <TableRow key={patient.id}>...</TableRow>
 *       ))}
 *     </Table>
 *   );
 * }
 */
