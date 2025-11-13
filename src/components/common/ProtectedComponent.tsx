/**
 * ProtectedComponent wrapper
 * Conditionally renders children based on user permissions
 */

import { ReactNode } from 'react';
import { Permission } from '@/types/enums';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedComponentProps {
  /**
   * Children to render if user has permission
   */
  children: ReactNode;

  /**
   * Required permission (single)
   */
  permission?: Permission;

  /**
   * Required permissions (any of these)
   */
  anyPermission?: Permission[];

  /**
   * Required permissions (all of these)
   */
  allPermissions?: Permission[];

  /**
   * Fallback content to render if user doesn't have permission
   */
  fallback?: ReactNode;

  /**
   * If true, renders nothing when permission is denied (default behavior)
   * If false, renders fallback content
   */
  hideOnDenied?: boolean;
}

/**
 * Component that conditionally renders children based on permissions
 * 
 * @example
 * // Single permission
 * <ProtectedComponent permission={Permission.PATIENT_CREATE}>
 *   <Button>Create Patient</Button>
 * </ProtectedComponent>
 * 
 * @example
 * // Any of multiple permissions
 * <ProtectedComponent anyPermission={[Permission.PATIENT_VIEW, Permission.PATIENT_UPDATE]}>
 *   <PatientDetails />
 * </ProtectedComponent>
 * 
 * @example
 * // All of multiple permissions
 * <ProtectedComponent allPermissions={[Permission.PATIENT_DELETE, Permission.SYSTEM_ADMIN]}>
 *   <Button variant="destructive">Delete Patient</Button>
 * </ProtectedComponent>
 * 
 * @example
 * // With fallback
 * <ProtectedComponent 
 *   permission={Permission.PATIENT_CREATE}
 *   fallback={<p>You don't have permission to create patients</p>}
 *   hideOnDenied={false}
 * >
 *   <Button>Create Patient</Button>
 * </ProtectedComponent>
 */
export const ProtectedComponent = ({
  children,
  permission,
  anyPermission,
  allPermissions,
  fallback = null,
  hideOnDenied = true,
}: ProtectedComponentProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = true;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // Check any of multiple permissions
  if (anyPermission && anyPermission.length > 0) {
    hasAccess = hasAnyPermission(anyPermission);
  }

  // Check all of multiple permissions
  if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAllPermissions(allPermissions);
  }

  if (!hasAccess) {
    return hideOnDenied ? null : <>{fallback}</>;
  }

  return <>{children}</>;
};
