import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Direct imports for instant page loads (no lazy loading)
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
import Settings from './pages/Settings';
import Ambulances from './pages/Ambulances';
import EmergencyCalls from './pages/EmergencyCalls';
import EmergencyCases from './pages/EmergencyCases';
import Insurance from './pages/Insurance';
import AdvancePayments from './pages/AdvancePayments';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import HospitalCharges from './pages/HospitalCharges';
import Payroll from './pages/Payroll';
import BirthReports from './pages/BirthReports';
import DeathReports from './pages/DeathReports';
import OperationReports from './pages/OperationReports';
import NoticeBoard from './pages/NoticeBoard';
import InternalMail from './pages/InternalMail';
import StaffSchedules from './pages/StaffSchedules';
import ServicePackages from './pages/ServicePackages';
import DoctorCharges from './pages/DoctorCharges';
import Inquiries from './pages/Inquiries';
import Documents from './pages/Documents';
import OPD from './pages/OPD';
import IPD from './pages/IPD';
import Login from './pages/Login';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Define routes
// Helper function to create protected routes (no lazy loading)
const createProtectedRoute = (path: string, Component: any) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    ),
  });
};

// Login route (public)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Protected routes
const indexRoute = createProtectedRoute('/', Dashboard);
const patientsRoute = createProtectedRoute('/patients', Patients);
const appointmentsRoute = createProtectedRoute('/appointments', Appointments);
const settingsRoute = createProtectedRoute('/settings', Settings);
const staffRoute = createProtectedRoute('/staff', Staff);
const inventoryRoute = createProtectedRoute('/inventory', Inventory);

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

// Create router instance with aggressive preloading
export const router = createRouter({
  routeTree,
  defaultPreload: 'viewport', // Preload routes when they appear in viewport
  defaultPreloadDelay: 0, // No delay before preloading
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
