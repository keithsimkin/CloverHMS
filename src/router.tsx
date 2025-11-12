import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Dashboard } from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Staff from './pages/Staff';
import Inventory from './pages/Inventory';
import Clinical from './pages/Clinical';
import PatientFlow from './pages/PatientFlow';
import Triage from './pages/Triage';
import Laboratory from './pages/Laboratory';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';
import { BedManagement } from './pages/BedManagement';
import { BloodDonors } from './pages/BloodDonors';
import { BloodInventoryPage } from './pages/BloodInventoryPage';
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

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: Staff,
});
const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: Inventory,
});
const clinicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clinical',
  component: Clinical,
});
const patientFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient-flow',
  component: PatientFlow,
});
const triageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/triage',
  component: Triage,
});
const laboratoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/laboratory',
  component: Laboratory,
});
const pharmacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pharmacy',
  component: Pharmacy,
});
const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: Billing,
});
const bedsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/beds',
  component: BedManagement,
});
const bloodDonorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blood-donors',
  component: BloodDonors,
});
const bloodBankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blood-bank',
  component: BloodInventoryPage,
});
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
  bloodDonorsRoute,
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
