/**
 * Usage Examples for Route Metadata Registry
 * 
 * This file demonstrates how to use the route metadata registry
 * and utility functions in the tab system.
 */

import {
  ROUTE_METADATA,
  getRouteMetadata,
  isValidRoute,
  getAuthenticatedRoutes,
  getRoutesByRole,
  canAccessRoute,
  getDefaultRoute,
} from './routeMetadata';
import { Role } from '../types/enums';

// Example 1: Get metadata for a specific route
function exampleGetRouteMetadata() {
  const patientsMetadata = getRouteMetadata('/patients');
  if (patientsMetadata) {
    console.log('Title:', patientsMetadata.title); // "Patients"
    console.log('Icon:', patientsMetadata.icon); // "UserGroupIcon"
    console.log('Requires Auth:', patientsMetadata.requiresAuth); // true
  }
}

// Example 2: Check if a route exists
function exampleIsValidRoute() {
  const isValid = isValidRoute('/patients'); // true
  const isInvalid = isValidRoute('/nonexistent'); // false
  console.log('Is /patients valid?', isValid);
  console.log('Is /nonexistent valid?', isInvalid);
}

// Example 3: Get all authenticated routes
function exampleGetAuthenticatedRoutes() {
  const authRoutes = getAuthenticatedRoutes();
  console.log('Number of authenticated routes:', authRoutes.length);
  authRoutes.forEach(route => {
    console.log(`${route.path} - ${route.title}`);
  });
}

// Example 4: Get routes accessible by a specific role
function exampleGetRoutesByRole() {
  // Get routes for a doctor
  const doctorRoutes = getRoutesByRole(Role.DOCTOR);
  console.log('Doctor can access:', doctorRoutes.map(r => r.title));

  // Get routes for a receptionist
  const receptionistRoutes = getRoutesByRole(Role.RECEPTIONIST);
  console.log('Receptionist can access:', receptionistRoutes.map(r => r.title));
}

// Example 5: Check if a user can access a specific route
function exampleCanAccessRoute() {
  // Check if a doctor can access clinical routes
  const doctorCanAccessClinical = canAccessRoute('/clinical', Role.DOCTOR); // true
  console.log('Doctor can access /clinical:', doctorCanAccessClinical);

  // Check if a receptionist can access payroll
  const receptionistCanAccessPayroll = canAccessRoute('/payroll', Role.RECEPTIONIST); // false
  console.log('Receptionist can access /payroll:', receptionistCanAccessPayroll);

  // Check if anyone can access login (public route)
  const anyoneCanLogin = canAccessRoute('/login', Role.VIEWER); // true
  console.log('Anyone can access /login:', anyoneCanLogin);
}

// Example 6: Get the default route
function exampleGetDefaultRoute() {
  const defaultRoute = getDefaultRoute();
  console.log('Default route:', defaultRoute.path); // "/"
  console.log('Default route title:', defaultRoute.title); // "Dashboard"
}

// Example 7: Direct access to ROUTE_METADATA
function exampleDirectAccess() {
  // Access metadata directly
  const dashboardMeta = ROUTE_METADATA['/'];
  console.log('Dashboard metadata:', dashboardMeta);

  // Iterate through all routes
  Object.entries(ROUTE_METADATA).forEach(([path, metadata]) => {
    console.log(`${path}: ${metadata.title} (Auth: ${metadata.requiresAuth})`);
  });
}

// Example 8: Use in tab creation logic
function exampleTabCreation(path: string, userRole: Role) {
  // Check if route is valid
  if (!isValidRoute(path)) {
    console.error('Invalid route:', path);
    return null;
  }

  // Check if user can access the route
  if (!canAccessRoute(path, userRole)) {
    console.error('User does not have access to:', path);
    return null;
  }

  // Get route metadata for tab creation
  const metadata = getRouteMetadata(path);
  if (!metadata) {
    return null;
  }

  // Create tab object (simplified example)
  const tab = {
    id: crypto.randomUUID(),
    path: metadata.path,
    title: metadata.title,
    icon: metadata.icon,
    hasUnsavedChanges: false,
    scrollPosition: 0,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  };

  console.log('Created tab:', tab);
  return tab;
}

// Example 9: Filter routes for navigation menu
function exampleNavigationMenu(userRole: Role) {
  // Get all routes accessible by the user
  const accessibleRoutes = getRoutesByRole(userRole);

  // Group routes by category (simplified example)
  const coreModules = accessibleRoutes.filter(route =>
    ['/patients', '/appointments', '/staff', '/inventory'].includes(route.path)
  );

  const clinicalRoutes = accessibleRoutes.filter(route =>
    ['/clinical', '/patient-flow', '/triage', '/laboratory', '/pharmacy'].includes(route.path)
  );

  console.log('Core Modules:', coreModules.map(r => r.title));
  console.log('Clinical Routes:', clinicalRoutes.map(r => r.title));
}

// Export examples for reference
export {
  exampleGetRouteMetadata,
  exampleIsValidRoute,
  exampleGetAuthenticatedRoutes,
  exampleGetRoutesByRole,
  exampleCanAccessRoute,
  exampleGetDefaultRoute,
  exampleDirectAccess,
  exampleTabCreation,
  exampleNavigationMenu,
};
