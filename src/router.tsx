import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Dashboard } from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import { Settings } from './pages/Settings';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const patientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients',
  component: Patients,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: Appointments,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

// Placeholder routes for other pages (will be implemented in later tasks)
const createPlaceholderRoute = (path: string, title: string) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">Coming soon...</p>
        </div>
      </div>
    ),
  });
};

// Create placeholder routes for all other pages
const staffRoute = createPlaceholderRoute('/staff', 'Staff Management');
const inventoryRoute = createPlaceholderRoute('/inventory', 'Inventory Management');
const clinicalRoute = createPlaceholderRoute('/clinical', 'Clinical Workflow');
const patientFlowRoute = createPlaceholderRoute('/patient-flow', 'Patient Flow');
const triageRoute = createPlaceholderRoute('/triage', 'Triage');
const laboratoryRoute = createPlaceholderRoute('/laboratory', 'Laboratory');
const pharmacyRoute = createPlaceholderRoute('/pharmacy', 'Pharmacy');
const billingRoute = createPlaceholderRoute('/billing', 'Billing');
const bedsRoute = createPlaceholderRoute('/beds', 'Bed Management');
const bloodBankRoute = createPlaceholderRoute('/blood-bank', 'Blood Bank');
const emergencyRoute = createPlaceholderRoute('/emergency', 'Emergency Services');
const opdRoute = createPlaceholderRoute('/opd', 'OPD Management');
const ipdRoute = createPlaceholderRoute('/ipd', 'IPD Management');
const insuranceRoute = createPlaceholderRoute('/insurance', 'Insurance Management');
const expensesRoute = createPlaceholderRoute('/expenses', 'Expense Tracking');
const payrollRoute = createPlaceholderRoute('/payroll', 'Payroll Management');
const reportsRoute = createPlaceholderRoute('/reports', 'Reports');
const communicationRoute = createPlaceholderRoute('/communication', 'Communication');
const packagesRoute = createPlaceholderRoute('/packages', 'Service Packages');
const qualityRoute = createPlaceholderRoute('/quality', 'Quality Management');
const documentsRoute = createPlaceholderRoute('/documents', 'Document Management');

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  patientsRoute,
  appointmentsRoute,
  staffRoute,
  inventoryRoute,
  clinicalRoute,
  patientFlowRoute,
  triageRoute,
  laboratoryRoute,
  pharmacyRoute,
  billingRoute,
  bedsRoute,
  bloodBankRoute,
  emergencyRoute,
  opdRoute,
  ipdRoute,
  insuranceRoute,
  expensesRoute,
  payrollRoute,
  reportsRoute,
  communicationRoute,
  packagesRoute,
  qualityRoute,
  documentsRoute,
  settingsRoute,
]);

// Create router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
