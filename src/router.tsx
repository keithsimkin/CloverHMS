import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Lazy load components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Patients = lazy(() => import('./pages/Patients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Staff = lazy(() => import('./pages/Staff'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Clinical = lazy(() => import('./pages/Clinical'));
const PatientFlow = lazy(() => import('./pages/PatientFlow'));
const Triage = lazy(() => import('./pages/Triage'));
const Laboratory = lazy(() => import('./pages/Laboratory'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const Billing = lazy(() => import('./pages/Billing'));
const BedManagement = lazy(() => import('./pages/BedManagement').then(m => ({ default: m.BedManagement })));
const BloodDonors = lazy(() => import('./pages/BloodDonors').then(m => ({ default: m.BloodDonors })));
const BloodInventoryPage = lazy(() => import('./pages/BloodInventoryPage').then(m => ({ default: m.BloodInventoryPage })));
const Settings = lazy(() => import('./pages/Settings'));
const Ambulances = lazy(() => import('./pages/Ambulances'));
const EmergencyCalls = lazy(() => import('./pages/EmergencyCalls'));
const EmergencyCases = lazy(() => import('./pages/EmergencyCases'));
const Insurance = lazy(() => import('./pages/Insurance'));
const AdvancePayments = lazy(() => import('./pages/AdvancePayments'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Income = lazy(() => import('./pages/Income'));
const HospitalCharges = lazy(() => import('./pages/HospitalCharges'));
const Payroll = lazy(() => import('./pages/Payroll'));
const BirthReports = lazy(() => import('./pages/BirthReports'));
const DeathReports = lazy(() => import('./pages/DeathReports'));
const OperationReports = lazy(() => import('./pages/OperationReports'));
const NoticeBoard = lazy(() => import('./pages/NoticeBoard'));
const InternalMail = lazy(() => import('./pages/InternalMail'));
const StaffSchedules = lazy(() => import('./pages/StaffSchedules'));
const ServicePackages = lazy(() => import('./pages/ServicePackages'));
const DoctorCharges = lazy(() => import('./pages/DoctorCharges'));
const Inquiries = lazy(() => import('./pages/Inquiries'));
const Documents = lazy(() => import('./pages/Documents'));
const OPD = lazy(() => import('./pages/OPD'));
const IPD = lazy(() => import('./pages/IPD'));
const Login = lazy(() => import('./pages/Login'));

// Wrapper component for lazy-loaded routes with suspense
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Define routes
// Login route (public)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <LazyRoute>
      <Login />
    </LazyRoute>
  ),
});

// Protected routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <LazyRoute>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </LazyRoute>
  ),
});

const patientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients',
  component: () => (
    <LazyRoute>
      <ProtectedRoute>
        <Patients />
      </ProtectedRoute>
    </LazyRoute>
  ),
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: () => (
    <LazyRoute>
      <ProtectedRoute>
        <Appointments />
      </ProtectedRoute>
    </LazyRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <LazyRoute>
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    </LazyRoute>
  ),
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: () => (
    <LazyRoute>
      <ProtectedRoute>
        <Staff />
      </ProtectedRoute>
    </LazyRoute>
  ),
});
const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: () => (
    <LazyRoute>
      <ProtectedRoute>
        <Inventory />
      </ProtectedRoute>
    </LazyRoute>
  ),
});
// Helper function to create protected lazy routes
const createProtectedRoute = (path: string, Component: React.LazyExoticComponent<any>) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => (
      <LazyRoute>
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      </LazyRoute>
    ),
  });
};

const clinicalRoute = createProtectedRoute('/clinical', Clinical);
const patientFlowRoute = createProtectedRoute('/patient-flow', PatientFlow);
const triageRoute = createProtectedRoute('/triage', Triage);
const laboratoryRoute = createProtectedRoute('/laboratory', Laboratory);
const pharmacyRoute = createProtectedRoute('/pharmacy', Pharmacy);
const billingRoute = createProtectedRoute('/billing', Billing);
const bedsRoute = createProtectedRoute('/beds', BedManagement);
const bloodDonorsRoute = createProtectedRoute('/blood-donors', BloodDonors);
const bloodBankRoute = createProtectedRoute('/blood-bank', BloodInventoryPage);
const ambulancesRoute = createProtectedRoute('/ambulances', Ambulances);
const emergencyCallsRoute = createProtectedRoute('/emergency-calls', EmergencyCalls);
const emergencyCasesRoute = createProtectedRoute('/emergency-cases', EmergencyCases);
const opdRoute = createProtectedRoute('/opd', OPD);
const ipdRoute = createProtectedRoute('/ipd', IPD);
const insuranceRoute = createProtectedRoute('/insurance', Insurance);
const advancePaymentsRoute = createProtectedRoute('/advance-payments', AdvancePayments);
const expensesRoute = createProtectedRoute('/expenses', Expenses);
const incomeRoute = createProtectedRoute('/income', Income);
const hospitalChargesRoute = createProtectedRoute('/hospital-charges', HospitalCharges);
const payrollRoute = createProtectedRoute('/payroll', Payroll);
const birthReportsRoute = createProtectedRoute('/birth-reports', BirthReports);
const deathReportsRoute = createProtectedRoute('/death-reports', DeathReports);
const operationReportsRoute = createProtectedRoute('/operation-reports', OperationReports);
const noticeBoardRoute = createProtectedRoute('/notice-board', NoticeBoard);
const internalMailRoute = createProtectedRoute('/internal-mail', InternalMail);
const staffSchedulesRoute = createProtectedRoute('/staff-schedules', StaffSchedules);
const packagesRoute = createProtectedRoute('/packages', ServicePackages);
const doctorChargesRoute = createProtectedRoute('/doctor-charges', DoctorCharges);
const qualityRoute = createProtectedRoute('/quality', Inquiries);
const documentsRoute = createProtectedRoute('/documents', Documents);

// Create route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
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
  ambulancesRoute,
  emergencyCallsRoute,
  emergencyCasesRoute,
  opdRoute,
  ipdRoute,
  insuranceRoute,
  advancePaymentsRoute,
  expensesRoute,
  incomeRoute,
  hospitalChargesRoute,
  payrollRoute,
  birthReportsRoute,
  deathReportsRoute,
  operationReportsRoute,
  noticeBoardRoute,
  internalMailRoute,
  staffSchedulesRoute,
  packagesRoute,
  doctorChargesRoute,
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
