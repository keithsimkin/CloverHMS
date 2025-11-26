/**
 * Centralized Route Metadata Registry
 * 
 * Maps all application routes to their metadata (title, icon, auth requirements).
 * Used by the tab system for consistent tab creation and display.
 */

import { RouteMetadata } from '../types/tab';
import { Role } from '../types/enums';

/**
 * Complete registry of all application routes with their metadata
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  // Overview
  '/': {
    path: '/',
    title: 'Dashboard',
    icon: 'HomeIcon',
    requiresAuth: true,
  },

  // Core Modules
  '/patients': {
    path: '/patients',
    title: 'Patients',
    icon: 'UserGroupIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/appointments': {
    path: '/appointments',
    title: 'Appointments',
    icon: 'CalendarIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/staff': {
    path: '/staff',
    title: 'Staff',
    icon: 'UsersIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.VIEWER,
    ],
  },
  '/inventory': {
    path: '/inventory',
    title: 'Inventory',
    icon: 'CubeIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.INVENTORY_MANAGER,
      Role.VIEWER,
    ],
  },

  // Clinical
  '/clinical': {
    path: '/clinical',
    title: 'Clinical',
    icon: 'ClipboardDocumentListIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.VIEWER,
    ],
  },
  '/patient-flow': {
    path: '/patient-flow',
    title: 'Patient Flow',
    icon: 'ArrowPathIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/triage': {
    path: '/triage',
    title: 'Triage',
    icon: 'ExclamationTriangleIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.VIEWER,
    ],
  },
  '/laboratory': {
    path: '/laboratory',
    title: 'Laboratory',
    icon: 'BeakerIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.LAB_TECHNICIAN,
      Role.VIEWER,
    ],
  },
  '/pharmacy': {
    path: '/pharmacy',
    title: 'Pharmacy',
    icon: 'ShoppingBagIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.PHARMACIST,
      Role.VIEWER,
    ],
  },
  '/billing': {
    path: '/billing',
    title: 'Billing',
    icon: 'CurrencyDollarIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },

  // Extended Services
  '/beds': {
    path: '/beds',
    title: 'Bed Management',
    icon: 'HomeModernIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.NURSE,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/blood-donors': {
    path: '/blood-donors',
    title: 'Blood Donors',
    icon: 'HeartIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.LAB_TECHNICIAN,
      Role.VIEWER,
    ],
  },
  '/blood-bank': {
    path: '/blood-bank',
    title: 'Blood Bank',
    icon: 'BeakerIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.LAB_TECHNICIAN,
      Role.VIEWER,
    ],
  },
  '/ambulances': {
    path: '/ambulances',
    title: 'Ambulances',
    icon: 'TruckIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/emergency-calls': {
    path: '/emergency-calls',
    title: 'Emergency Calls',
    icon: 'PhoneIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/emergency-cases': {
    path: '/emergency-cases',
    title: 'Emergency Cases',
    icon: 'ExclamationCircleIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.VIEWER,
    ],
  },
  '/opd': {
    path: '/opd',
    title: 'OPD',
    icon: 'BuildingOffice2Icon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/ipd': {
    path: '/ipd',
    title: 'IPD',
    icon: 'BuildingOfficeIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.NURSE,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },

  // Financial
  '/insurance': {
    path: '/insurance',
    title: 'Insurance',
    icon: 'ShieldCheckIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.VIEWER,
    ],
  },
  '/advance-payments': {
    path: '/advance-payments',
    title: 'Advance Payments',
    icon: 'BanknotesIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.RECEPTIONIST,
      Role.VIEWER,
    ],
  },
  '/expenses': {
    path: '/expenses',
    title: 'Expenses',
    icon: 'ArrowTrendingDownIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.VIEWER,
    ],
  },
  '/income': {
    path: '/income',
    title: 'Income',
    icon: 'ArrowTrendingUpIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.VIEWER,
    ],
  },
  '/hospital-charges': {
    path: '/hospital-charges',
    title: 'Hospital Charges',
    icon: 'ReceiptPercentIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.VIEWER,
    ],
  },
  '/payroll': {
    path: '/payroll',
    title: 'Payroll',
    icon: 'CreditCardIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
    ],
  },

  // Reports
  '/birth-reports': {
    path: '/birth-reports',
    title: 'Birth Reports',
    icon: 'DocumentTextIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.VIEWER,
    ],
  },
  '/death-reports': {
    path: '/death-reports',
    title: 'Death Reports',
    icon: 'DocumentTextIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.VIEWER,
    ],
  },
  '/operation-reports': {
    path: '/operation-reports',
    title: 'Operation Reports',
    icon: 'DocumentChartBarIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.DOCTOR,
      Role.VIEWER,
    ],
  },

  // Communication
  '/notice-board': {
    path: '/notice-board',
    title: 'Notice Board',
    icon: 'MegaphoneIcon',
    requiresAuth: true,
  },
  '/internal-mail': {
    path: '/internal-mail',
    title: 'Internal Mail',
    icon: 'EnvelopeIcon',
    requiresAuth: true,
  },
  '/staff-schedules': {
    path: '/staff-schedules',
    title: 'Staff Schedules',
    icon: 'CalendarDaysIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.VIEWER,
    ],
  },

  // Service Packages
  '/packages': {
    path: '/packages',
    title: 'Service Packages',
    icon: 'ArchiveBoxIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.VIEWER,
    ],
  },
  '/doctor-charges': {
    path: '/doctor-charges',
    title: 'Doctor Charges',
    icon: 'CurrencyDollarIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.ACCOUNTANT,
      Role.VIEWER,
    ],
  },

  // Quality Management
  '/quality': {
    path: '/quality',
    title: 'Quality Management',
    icon: 'StarIcon',
    requiresAuth: true,
    allowedRoles: [
      Role.ADMIN,
      Role.HOSPITAL_ADMIN,
      Role.VIEWER,
    ],
  },

  // Document Management
  '/documents': {
    path: '/documents',
    title: 'Documents',
    icon: 'FolderIcon',
    requiresAuth: true,
  },

  // System
  '/settings': {
    path: '/settings',
    title: 'Settings',
    icon: 'Cog6ToothIcon',
    requiresAuth: true,
  },

  // Public
  '/login': {
    path: '/login',
    title: 'Login',
    icon: 'ArrowRightOnRectangleIcon',
    requiresAuth: false,
  },
};

/**
 * Utility function to get route metadata by path
 * @param path - The route path to lookup
 * @returns RouteMetadata if found, undefined otherwise
 */
export function getRouteMetadata(path: string): RouteMetadata | undefined {
  return ROUTE_METADATA[path];
}

/**
 * Utility function to check if a route exists in the registry
 * @param path - The route path to check
 * @returns true if the route exists, false otherwise
 */
export function isValidRoute(path: string): boolean {
  return path in ROUTE_METADATA;
}

/**
 * Utility function to get all routes that require authentication
 * @returns Array of RouteMetadata for authenticated routes
 */
export function getAuthenticatedRoutes(): RouteMetadata[] {
  return Object.values(ROUTE_METADATA).filter(route => route.requiresAuth);
}

/**
 * Utility function to get routes accessible by a specific role
 * @param role - The user role to filter by
 * @returns Array of RouteMetadata accessible by the role
 */
export function getRoutesByRole(role: Role): RouteMetadata[] {
  return Object.values(ROUTE_METADATA).filter(route => {
    // If no specific roles defined, all authenticated users can access
    if (!route.allowedRoles) {
      return route.requiresAuth;
    }
    return route.allowedRoles.includes(role);
  });
}

/**
 * Utility function to check if a user role can access a specific route
 * @param path - The route path to check
 * @param role - The user role
 * @returns true if the role can access the route, false otherwise
 */
export function canAccessRoute(path: string, role: Role): boolean {
  const metadata = getRouteMetadata(path);
  if (!metadata) {
    return false;
  }
  
  // Public routes are accessible to all
  if (!metadata.requiresAuth) {
    return true;
  }
  
  // If no specific roles defined, all authenticated users can access
  if (!metadata.allowedRoles) {
    return true;
  }
  
  return metadata.allowedRoles.includes(role);
}

/**
 * Utility function to get the default route (Dashboard)
 * @returns RouteMetadata for the dashboard
 */
export function getDefaultRoute(): RouteMetadata {
  return ROUTE_METADATA['/'];
}
