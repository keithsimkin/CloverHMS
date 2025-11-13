/**
 * usePermissions hook
 * Provides permission checking functionality for components
 */

import { useMemo } from 'react';
import { Permission, Role } from '@/types/enums';
import { useAuthStore } from '@/stores/authStore';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getCurrentUserPermissions,
  canAccessRoute,
} from '@/lib/permissions';

export interface UsePermissionsReturn {
  /**
   * Check if user has a specific permission
   */
  hasPermission: (permission: Permission) => boolean;

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission: (permissions: Permission[]) => boolean;

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions: (permissions: Permission[]) => boolean;

  /**
   * Get all permissions for current user
   */
  permissions: Permission[];

  /**
   * Check if user can access a specific route
   */
  canAccessRoute: (routePath: string) => boolean;

  /**
   * Check if user is admin
   */
  isAdmin: boolean;

  /**
   * Check if user is hospital admin
   */
  isHospitalAdmin: boolean;

  /**
   * Check if user is doctor
   */
  isDoctor: boolean;

  /**
   * Check if user is nurse
   */
  isNurse: boolean;

  /**
   * Check if user is receptionist
   */
  isReceptionist: boolean;

  /**
   * Check if user is lab technician
   */
  isLabTechnician: boolean;

  /**
   * Check if user is pharmacist
   */
  isPharmacist: boolean;

  /**
   * Check if user is accountant
   */
  isAccountant: boolean;

  /**
   * Check if user is inventory manager
   */
  isInventoryManager: boolean;

  /**
   * Check if user is viewer
   */
  isViewer: boolean;

  /**
   * Current user role
   */
  role: Role | null;
}

/**
 * Hook to check user permissions
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuthStore();

  const permissions = useMemo(() => {
    return getCurrentUserPermissions();
  }, [user]);

  const role = user?.role || null;

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    canAccessRoute,
    isAdmin: role === Role.ADMIN,
    isHospitalAdmin: role === Role.HOSPITAL_ADMIN,
    isDoctor: role === Role.DOCTOR,
    isNurse: role === Role.NURSE,
    isReceptionist: role === Role.RECEPTIONIST,
    isLabTechnician: role === Role.LAB_TECHNICIAN,
    isPharmacist: role === Role.PHARMACIST,
    isAccountant: role === Role.ACCOUNTANT,
    isInventoryManager: role === Role.INVENTORY_MANAGER,
    isViewer: role === Role.VIEWER,
    role,
  };
};

/**
 * Hook to check a specific permission
 * Useful for conditional rendering
 */
export const useHasPermission = (permission: Permission): boolean => {
  const { user } = useAuthStore();

  return useMemo(() => {
    return hasPermission(permission);
  }, [user, permission]);
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: Permission[]): boolean => {
  const { user } = useAuthStore();

  return useMemo(() => {
    return hasAnyPermission(permissions);
  }, [user, permissions]);
};

/**
 * Hook to check if user has all of the specified permissions
 */
export const useHasAllPermissions = (permissions: Permission[]): boolean => {
  const { user } = useAuthStore();

  return useMemo(() => {
    return hasAllPermissions(permissions);
  }, [user, permissions]);
};
