/**
 * Role-based permission configuration
 * Maps each user role to their allowed permissions
 */

import { Role, Permission } from '@/types/enums';

/**
 * Role to permissions mapping
 * Defines what permissions each role has access to
 */
export const rolePermissions: Record<Role, Permission[]> = {
  // System Administrator - Full access to everything
  [Role.ADMIN]: [
    // All permissions
    Permission.PATIENT_VIEW,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.PATIENT_DELETE,
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_UPDATE,
    Permission.APPOINTMENT_DELETE,
    Permission.STAFF_VIEW,
    Permission.STAFF_CREATE,
    Permission.STAFF_UPDATE,
    Permission.STAFF_DELETE,
    Permission.STAFF_MANAGE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_CREATE,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_DELETE,
    Permission.INVENTORY_MANAGE,
    Permission.CLINICAL_VIEW,
    Permission.CLINICAL_RECORD,
    Permission.PRESCRIBE_MEDICINE,
    Permission.DIAGNOSIS_CREATE,
    Permission.FLOW_VIEW,
    Permission.FLOW_MANAGE,
    Permission.TRIAGE_PERFORM,
    Permission.LAB_VIEW,
    Permission.LAB_ORDER,
    Permission.LAB_MANAGE,
    Permission.LAB_RESULTS,
    Permission.PHARMACY_VIEW,
    Permission.PHARMACY_DISPENSE,
    Permission.PHARMACY_MANAGE,
    Permission.BILLING_VIEW,
    Permission.BILLING_CREATE,
    Permission.BILLING_PROCESS,
    Permission.BED_VIEW,
    Permission.BED_ALLOCATE,
    Permission.BED_MANAGE,
    Permission.BLOOD_BANK_VIEW,
    Permission.BLOOD_BANK_MANAGE,
    Permission.BLOOD_DONOR_MANAGE,
    Permission.EMERGENCY_VIEW,
    Permission.EMERGENCY_MANAGE,
    Permission.AMBULANCE_DISPATCH,
    Permission.FINANCIAL_VIEW,
    Permission.FINANCIAL_MANAGE,
    Permission.INSURANCE_MANAGE,
    Permission.PAYROLL_VIEW,
    Permission.PAYROLL_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_GENERATE,
    Permission.REPORTS_EXPORT,
    Permission.COMMUNICATION_VIEW,
    Permission.COMMUNICATION_SEND,
    Permission.NOTICE_MANAGE,
    Permission.PACKAGE_VIEW,
    Permission.PACKAGE_MANAGE,
    Permission.INQUIRY_VIEW,
    Permission.INQUIRY_MANAGE,
    Permission.DOCUMENT_VIEW,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_MANAGE,
    Permission.OPD_VIEW,
    Permission.OPD_MANAGE,
    Permission.IPD_VIEW,
    Permission.IPD_MANAGE,
    Permission.SYSTEM_ADMIN,
    Permission.USER_MANAGE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_MANAGE,
    Permission.AGENT_HOOKS_MANAGE,
    Permission.STEERING_MANAGE,
  ],

  // Hospital Administrator - Hospital-wide management excluding system configuration
  [Role.HOSPITAL_ADMIN]: [
    Permission.PATIENT_VIEW,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_UPDATE,
    Permission.STAFF_VIEW,
    Permission.STAFF_CREATE,
    Permission.STAFF_UPDATE,
    Permission.STAFF_MANAGE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_MANAGE,
    Permission.CLINICAL_VIEW,
    Permission.FLOW_VIEW,
    Permission.FLOW_MANAGE,
    Permission.LAB_VIEW,
    Permission.PHARMACY_VIEW,
    Permission.BILLING_VIEW,
    Permission.BILLING_CREATE,
    Permission.BILLING_PROCESS,
    Permission.BED_VIEW,
    Permission.BED_ALLOCATE,
    Permission.BED_MANAGE,
    Permission.BLOOD_BANK_VIEW,
    Permission.BLOOD_BANK_MANAGE,
    Permission.EMERGENCY_VIEW,
    Permission.EMERGENCY_MANAGE,
    Permission.FINANCIAL_VIEW,
    Permission.FINANCIAL_MANAGE,
    Permission.INSURANCE_MANAGE,
    Permission.PAYROLL_VIEW,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_GENERATE,
    Permission.REPORTS_EXPORT,
    Permission.COMMUNICATION_VIEW,
    Permission.COMMUNICATION_SEND,
    Permission.NOTICE_MANAGE,
    Permission.PACKAGE_VIEW,
    Permission.PACKAGE_MANAGE,
    Permission.INQUIRY_VIEW,
    Permission.INQUIRY_MANAGE,
    Permission.DOCUMENT_VIEW,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_MANAGE,
    Permission.OPD_VIEW,
    Permission.OPD_MANAGE,
    Permission.IPD_VIEW,
    Permission.IPD_MANAGE,
    Permission.SETTINGS_VIEW,
  ],

  // Doctor - Patient care, clinical documentation, prescriptions
  [Role.DOCTOR]: [
    Permission.PATIENT_VIEW,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_VIEW,
    Permission.CLINICAL_VIEW,
    Permission.CLINICAL_RECORD,
    Permission.PRESCRIBE_MEDICINE,
    Permission.DIAGNOSIS_CREATE,
    Permission.FLOW_VIEW,
    Permission.LAB_VIEW,
    Permission.LAB_ORDER,
    Permission.PHARMACY_VIEW,
    Permission.BED_VIEW,
    Permission.OPD_VIEW,
    Permission.OPD_MANAGE,
    Permission.IPD_VIEW,
    Permission.IPD_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.COMMUNICATION_VIEW,
    Permission.COMMUNICATION_SEND,
    Permission.DOCUMENT_VIEW,
  ],

  // Nurse - Patient care, vital signs, bed management
  [Role.NURSE]: [
    Permission.PATIENT_VIEW,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_VIEW,
    Permission.CLINICAL_VIEW,
    Permission.CLINICAL_RECORD,
    Permission.FLOW_VIEW,
    Permission.FLOW_MANAGE,
    Permission.TRIAGE_PERFORM,
    Permission.LAB_VIEW,
    Permission.PHARMACY_VIEW,
    Permission.BED_VIEW,
    Permission.BED_ALLOCATE,
    Permission.BED_MANAGE,
    Permission.OPD_VIEW,
    Permission.IPD_VIEW,
    Permission.COMMUNICATION_VIEW,
    Permission.COMMUNICATION_SEND,
    Permission.DOCUMENT_VIEW,
  ],

  // Receptionist - Patient registration, appointment scheduling
  [Role.RECEPTIONIST]: [
    Permission.PATIENT_VIEW,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_UPDATE,
    Permission.FLOW_VIEW,
    Permission.FLOW_MANAGE,
    Permission.BILLING_VIEW,
    Permission.BILLING_CREATE,
    Permission.OPD_VIEW,
    Permission.OPD_MANAGE,
    Permission.IPD_VIEW,
    Permission.COMMUNICATION_VIEW,
    Permission.DOCUMENT_VIEW,
  ],

  // Lab Technician - Laboratory test management
  [Role.LAB_TECHNICIAN]: [
    Permission.PATIENT_VIEW,
    Permission.LAB_VIEW,
    Permission.LAB_MANAGE,
    Permission.LAB_RESULTS,
    Permission.FLOW_VIEW,
    Permission.REPORTS_VIEW,
    Permission.COMMUNICATION_VIEW,
    Permission.DOCUMENT_VIEW,
  ],

  // Pharmacist - Pharmacy and medicine dispensing
  [Role.PHARMACIST]: [
    Permission.PATIENT_VIEW,
    Permission.CLINICAL_VIEW,
    Permission.PHARMACY_VIEW,
    Permission.PHARMACY_DISPENSE,
    Permission.PHARMACY_MANAGE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_UPDATE,
    Permission.FLOW_VIEW,
    Permission.REPORTS_VIEW,
    Permission.COMMUNICATION_VIEW,
    Permission.DOCUMENT_VIEW,
  ],

  // Accountant - Financial management and billing
  [Role.ACCOUNTANT]: [
    Permission.PATIENT_VIEW,
    Permission.BILLING_VIEW,
    Permission.BILLING_CREATE,
    Permission.BILLING_PROCESS,
    Permission.FINANCIAL_VIEW,
    Permission.FINANCIAL_MANAGE,
    Permission.INSURANCE_MANAGE,
    Permission.PAYROLL_VIEW,
    Permission.PAYROLL_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_GENERATE,
    Permission.REPORTS_EXPORT,
    Permission.COMMUNICATION_VIEW,
    Permission.DOCUMENT_VIEW,
    Permission.DOCUMENT_UPLOAD,
  ],

  // Inventory Manager - Supply management
  [Role.INVENTORY_MANAGER]: [
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_CREATE,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_DELETE,
    Permission.INVENTORY_MANAGE,
    Permission.PHARMACY_VIEW,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_GENERATE,
    Permission.COMMUNICATION_VIEW,
    Permission.DOCUMENT_VIEW,
  ],

  // Viewer - Read-only access
  [Role.VIEWER]: [
    Permission.PATIENT_VIEW,
    Permission.APPOINTMENT_VIEW,
    Permission.STAFF_VIEW,
    Permission.INVENTORY_VIEW,
    Permission.CLINICAL_VIEW,
    Permission.FLOW_VIEW,
    Permission.LAB_VIEW,
    Permission.PHARMACY_VIEW,
    Permission.BILLING_VIEW,
    Permission.BED_VIEW,
    Permission.BLOOD_BANK_VIEW,
    Permission.EMERGENCY_VIEW,
    Permission.FINANCIAL_VIEW,
    Permission.REPORTS_VIEW,
    Permission.COMMUNICATION_VIEW,
    Permission.PACKAGE_VIEW,
    Permission.INQUIRY_VIEW,
    Permission.DOCUMENT_VIEW,
    Permission.OPD_VIEW,
    Permission.IPD_VIEW,
  ],
};

/**
 * Get permissions for a specific role
 */
export const getPermissionsForRole = (role: Role): Permission[] => {
  return rolePermissions[role] || [];
};

/**
 * Check if a role has a specific permission
 */
export const roleHasPermission = (role: Role, permission: Permission): boolean => {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
};

/**
 * Check if a role has any of the specified permissions
 */
export const roleHasAnyPermission = (role: Role, permissions: Permission[]): boolean => {
  const rolePerms = getPermissionsForRole(role);
  return permissions.some((permission) => rolePerms.includes(permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const roleHasAllPermissions = (role: Role, permissions: Permission[]): boolean => {
  const rolePerms = getPermissionsForRole(role);
  return permissions.every((permission) => rolePerms.includes(permission));
};
