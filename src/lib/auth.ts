/**
 * Authentication helper functions
 * Provides utilities for authentication and session management
 */

import { useAuthStore, User } from '@/stores/authStore';
import { Role } from '@/types/enums';

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return useAuthStore.getState().user;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: Role): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles: Role[]): boolean => {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
};

/**
 * Get user's full name
 */
export const getUserFullName = (): string => {
  const user = getCurrentUser();
  return user ? `${user.firstName} ${user.lastName}` : '';
};

/**
 * Get user's initials
 */
export const getUserInitials = (): string => {
  const user = getCurrentUser();
  if (!user) return '';
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<void> => {
  return useAuthStore.getState().login(email, password);
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  useAuthStore.getState().logout();
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = (): void => {
  useAuthStore.getState().updateLastActivity();
};

/**
 * Check if session is still valid
 */
export const checkSession = (): boolean => {
  return useAuthStore.getState().checkSession();
};

/**
 * Check if account is locked
 */
export const isAccountLocked = (): boolean => {
  return useAuthStore.getState().isAccountLocked();
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: Role): string => {
  const roleNames: Record<Role, string> = {
    [Role.ADMIN]: 'System Administrator',
    [Role.HOSPITAL_ADMIN]: 'Hospital Administrator',
    [Role.DOCTOR]: 'Doctor',
    [Role.NURSE]: 'Nurse',
    [Role.RECEPTIONIST]: 'Receptionist',
    [Role.LAB_TECHNICIAN]: 'Lab Technician',
    [Role.PHARMACIST]: 'Pharmacist',
    [Role.ACCOUNTANT]: 'Accountant',
    [Role.INVENTORY_MANAGER]: 'Inventory Manager',
    [Role.VIEWER]: 'Viewer',
  };
  return roleNames[role] || role;
};

/**
 * Format time remaining for lockout
 */
export const getLockoutTimeRemaining = (): string => {
  const { lockoutUntil } = useAuthStore.getState();
  
  if (!lockoutUntil) {
    return '';
  }

  const now = Date.now();
  const remaining = lockoutUntil - now;

  if (remaining <= 0) {
    return '';
  }

  const minutes = Math.ceil(remaining / 60000);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};
