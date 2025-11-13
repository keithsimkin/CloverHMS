/**
 * Permission checking utilities
 * Provides functions to check user permissions based on their role
 */

import { Permission, Role } from '@/types/enums';
import { getPermissionsForRole } from '@/config/permissions';
import { getCurrentUser } from './auth';

/**
 * Get current user's permissions
 */
export const getCurrentUserPermissions = (): Permission[] => {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }
  return getPermissionsForRole(user.role);
};

/**
 * Check if current user has a specific permission
 */
export const hasPermission = (permission: Permission): boolean => {
  const permissions = getCurrentUserPermissions();
  return permissions.includes(permission);
};

/**
 * Check if current user has any of the specified permissions
 */
export const hasAnyPermission = (permissions: Permission[]): boolean => {
  const userPermissions = getCurrentUserPermissions();
  return permissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if current user has all of the specified permissions
 */
export const hasAllPermissions = (permissions: Permission[]): boolean => {
  const userPermissions = getCurrentUserPermissions();
  return permissions.every((permission) => userPermissions.includes(permission));
};

/**
 * Check if a specific role has a permission
 */
export const roleHasPermission = (role: Role, permission: Permission): boolean => {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
};

/**
 * Get permission display name
 */
export const getPermissionDisplayName = (permission: Permission): string => {
  const permissionNames: Record<Permission, string> = {
    // Patient permissions
    [Permission.PATIENT_VIEW]: 'View Patients',
    [Permission.PATIENT_CREATE]: 'Create Patients',
    [Permission.PATIENT_UPDATE]: 'Update Patients',
    [Permission.PATIENT_DELETE]: 'Delete Patients',

    // Appointment permissions
    [Permission.APPOINTMENT_VIEW]: 'View Appointments',
    [Permission.APPOINTMENT_CREATE]: 'Create Appointments',
    [Permission.APPOINTMENT_UPDATE]: 'Update Appointments',
    [Permission.APPOINTMENT_DELETE]: 'Delete Appointments',

    // Staff permissions
    [Permission.STAFF_VIEW]: 'View Staff',
    [Permission.STAFF_CREATE]: 'Create Staff',
    [Permission.STAFF_UPDATE]: 'Update Staff',
    [Permission.STAFF_DELETE]: 'Delete Staff',
    [Permission.STAFF_MANAGE]: 'Manage Staff',

    // Inventory permissions
    [Permission.INVENTORY_VIEW]: 'View Inventory',
    [Permission.INVENTORY_CREATE]: 'Create Inventory Items',
    [Permission.INVENTORY_UPDATE]: 'Update Inventory',
    [Permission.INVENTORY_DELETE]: 'Delete Inventory Items',
    [Permission.INVENTORY_MANAGE]: 'Manage Inventory',

    // Clinical permissions
    [Permission.CLINICAL_VIEW]: 'View Clinical Records',
    [Permission.CLINICAL_RECORD]: 'Record Clinical Data',
    [Permission.PRESCRIBE_MEDICINE]: 'Prescribe Medicine',
    [Permission.DIAGNOSIS_CREATE]: 'Create Diagnosis',

    // Patient Flow permissions
    [Permission.FLOW_VIEW]: 'View Patient Flow',
    [Permission.FLOW_MANAGE]: 'Manage Patient Flow',
    [Permission.TRIAGE_PERFORM]: 'Perform Triage',

    // Laboratory permissions
    [Permission.LAB_VIEW]: 'View Lab Orders',
    [Permission.LAB_ORDER]: 'Order Lab Tests',
    [Permission.LAB_MANAGE]: 'Manage Laboratory',
    [Permission.LAB_RESULTS]: 'Enter Lab Results',

    // Pharmacy permissions
    [Permission.PHARMACY_VIEW]: 'View Pharmacy',
    [Permission.PHARMACY_DISPENSE]: 'Dispense Medicine',
    [Permission.PHARMACY_MANAGE]: 'Manage Pharmacy',

    // Billing permissions
    [Permission.BILLING_VIEW]: 'View Billing',
    [Permission.BILLING_CREATE]: 'Create Bills',
    [Permission.BILLING_PROCESS]: 'Process Payments',

    // Bed Management permissions
    [Permission.BED_VIEW]: 'View Beds',
    [Permission.BED_ALLOCATE]: 'Allocate Beds',
    [Permission.BED_MANAGE]: 'Manage Beds',

    // Blood Bank permissions
    [Permission.BLOOD_BANK_VIEW]: 'View Blood Bank',
    [Permission.BLOOD_BANK_MANAGE]: 'Manage Blood Bank',
    [Permission.BLOOD_DONOR_MANAGE]: 'Manage Blood Donors',

    // Emergency Services permissions
    [Permission.EMERGENCY_VIEW]: 'View Emergency Services',
    [Permission.EMERGENCY_MANAGE]: 'Manage Emergency Services',
    [Permission.AMBULANCE_DISPATCH]: 'Dispatch Ambulances',

    // Financial permissions
    [Permission.FINANCIAL_VIEW]: 'View Financial Data',
    [Permission.FINANCIAL_MANAGE]: 'Manage Finances',
    [Permission.INSURANCE_MANAGE]: 'Manage Insurance',
    [Permission.PAYROLL_VIEW]: 'View Payroll',
    [Permission.PAYROLL_MANAGE]: 'Manage Payroll',

    // Reporting permissions
    [Permission.REPORTS_VIEW]: 'View Reports',
    [Permission.REPORTS_GENERATE]: 'Generate Reports',
    [Permission.REPORTS_EXPORT]: 'Export Reports',

    // Communication permissions
    [Permission.COMMUNICATION_VIEW]: 'View Communications',
    [Permission.COMMUNICATION_SEND]: 'Send Messages',
    [Permission.NOTICE_MANAGE]: 'Manage Notices',

    // Service Package permissions
    [Permission.PACKAGE_VIEW]: 'View Service Packages',
    [Permission.PACKAGE_MANAGE]: 'Manage Service Packages',

    // Quality Management permissions
    [Permission.INQUIRY_VIEW]: 'View Inquiries',
    [Permission.INQUIRY_MANAGE]: 'Manage Inquiries',

    // Document Management permissions
    [Permission.DOCUMENT_VIEW]: 'View Documents',
    [Permission.DOCUMENT_UPLOAD]: 'Upload Documents',
    [Permission.DOCUMENT_MANAGE]: 'Manage Documents',

    // OPD/IPD permissions
    [Permission.OPD_VIEW]: 'View OPD',
    [Permission.OPD_MANAGE]: 'Manage OPD',
    [Permission.IPD_VIEW]: 'View IPD',
    [Permission.IPD_MANAGE]: 'Manage IPD',

    // System permissions
    [Permission.SYSTEM_ADMIN]: 'System Administration',
    [Permission.USER_MANAGE]: 'Manage Users',
    [Permission.SETTINGS_VIEW]: 'View Settings',
    [Permission.SETTINGS_MANAGE]: 'Manage Settings',
    [Permission.AGENT_HOOKS_MANAGE]: 'Manage Agent Hooks',
    [Permission.STEERING_MANAGE]: 'Manage Steering Rules',
  };

  return permissionNames[permission] || permission;
};

/**
 * Group permissions by category
 */
export const groupPermissionsByCategory = (permissions: Permission[]): Record<string, Permission[]> => {
  const categories: Record<string, Permission[]> = {
    'Patient Management': [],
    'Appointments': [],
    'Staff Management': [],
    'Inventory': [],
    'Clinical': [],
    'Patient Flow': [],
    'Laboratory': [],
    'Pharmacy': [],
    'Billing': [],
    'Bed Management': [],
    'Blood Bank': [],
    'Emergency Services': [],
    'Financial': [],
    'Reporting': [],
    'Communication': [],
    'Service Packages': [],
    'Quality Management': [],
    'Document Management': [],
    'OPD/IPD': [],
    'System': [],
  };

  permissions.forEach((permission) => {
    if (permission.startsWith('patient:')) {
      categories['Patient Management'].push(permission);
    } else if (permission.startsWith('appointment:')) {
      categories['Appointments'].push(permission);
    } else if (permission.startsWith('staff:')) {
      categories['Staff Management'].push(permission);
    } else if (permission.startsWith('inventory:')) {
      categories['Inventory'].push(permission);
    } else if (permission.startsWith('clinical:')) {
      categories['Clinical'].push(permission);
    } else if (permission.startsWith('flow:') || permission.startsWith('triage:')) {
      categories['Patient Flow'].push(permission);
    } else if (permission.startsWith('lab:')) {
      categories['Laboratory'].push(permission);
    } else if (permission.startsWith('pharmacy:')) {
      categories['Pharmacy'].push(permission);
    } else if (permission.startsWith('billing:')) {
      categories['Billing'].push(permission);
    } else if (permission.startsWith('bed:')) {
      categories['Bed Management'].push(permission);
    } else if (permission.startsWith('blood_bank:')) {
      categories['Blood Bank'].push(permission);
    } else if (permission.startsWith('emergency:')) {
      categories['Emergency Services'].push(permission);
    } else if (permission.startsWith('financial:')) {
      categories['Financial'].push(permission);
    } else if (permission.startsWith('reports:')) {
      categories['Reporting'].push(permission);
    } else if (permission.startsWith('communication:')) {
      categories['Communication'].push(permission);
    } else if (permission.startsWith('package:')) {
      categories['Service Packages'].push(permission);
    } else if (permission.startsWith('inquiry:')) {
      categories['Quality Management'].push(permission);
    } else if (permission.startsWith('document:')) {
      categories['Document Management'].push(permission);
    } else if (permission.startsWith('opd:') || permission.startsWith('ipd:')) {
      categories['OPD/IPD'].push(permission);
    } else if (permission.startsWith('system:') || permission.startsWith('settings:')) {
      categories['System'].push(permission);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (routePath: string): boolean => {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }

  // Admin can access everything
  if (user.role === Role.ADMIN) {
    return true;
  }

  // Map routes to required permissions
  const routePermissions: Record<string, Permission[]> = {
    '/patients': [Permission.PATIENT_VIEW],
    '/appointments': [Permission.APPOINTMENT_VIEW],
    '/staff': [Permission.STAFF_VIEW],
    '/inventory': [Permission.INVENTORY_VIEW],
    '/clinical': [Permission.CLINICAL_VIEW],
    '/patient-flow': [Permission.FLOW_VIEW],
    '/triage': [Permission.TRIAGE_PERFORM],
    '/laboratory': [Permission.LAB_VIEW],
    '/pharmacy': [Permission.PHARMACY_VIEW],
    '/billing': [Permission.BILLING_VIEW],
    '/bed-management': [Permission.BED_VIEW],
    '/blood-donors': [Permission.BLOOD_BANK_VIEW],
    '/blood-inventory': [Permission.BLOOD_BANK_VIEW],
    '/ambulances': [Permission.EMERGENCY_VIEW],
    '/emergency-calls': [Permission.EMERGENCY_VIEW],
    '/emergency-cases': [Permission.EMERGENCY_VIEW],
    '/insurance': [Permission.FINANCIAL_VIEW],
    '/advance-payments': [Permission.FINANCIAL_VIEW],
    '/expenses': [Permission.FINANCIAL_VIEW],
    '/income': [Permission.FINANCIAL_VIEW],
    '/hospital-charges': [Permission.FINANCIAL_VIEW],
    '/payroll': [Permission.PAYROLL_VIEW],
    '/birth-reports': [Permission.REPORTS_VIEW],
    '/death-reports': [Permission.REPORTS_VIEW],
    '/operation-reports': [Permission.REPORTS_VIEW],
    '/notice-board': [Permission.COMMUNICATION_VIEW],
    '/internal-mail': [Permission.COMMUNICATION_VIEW],
    '/staff-schedules': [Permission.COMMUNICATION_VIEW],
    '/service-packages': [Permission.PACKAGE_VIEW],
    '/doctor-charges': [Permission.PACKAGE_VIEW],
    '/inquiries': [Permission.INQUIRY_VIEW],
    '/documents': [Permission.DOCUMENT_VIEW],
    '/opd': [Permission.OPD_VIEW],
    '/ipd': [Permission.IPD_VIEW],
    '/settings': [Permission.SETTINGS_VIEW],
  };

  const requiredPermissions = routePermissions[routePath];
  if (!requiredPermissions) {
    return true; // No specific permissions required
  }

  return hasAnyPermission(requiredPermissions);
};
