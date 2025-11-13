import { MainLayout } from '@/components/layout/MainLayout';
import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import {
  StatsCards,
  AppointmentStats,
  PatientDemographics,
  StaffUtilization,
  FinancialCharts,
  EmergencyStats,
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/types/enums';
import { ProtectedComponent } from '@/components/common/ProtectedComponent';
import {
  generateMockPatients,
  generateMockStaff,
  generateMockBeds,
  calculateBloodInventory,
  generateMockBloodDonations,
  generateMockBloodDonors,
  generateMockInquiries,
  generateMockDashboardStats,
  generateMockAppointmentData,
  generateMockPatientDemographics,
  generateMockStaffWorkload,
  generateMockFinancialData,
  generateMockEmergencyData,
} from '@/lib/mockData';

export function Dashboard() {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days'>('30days');
  const { role } = usePermissions();

  // Generate mock data
  const mockPatients = useMemo(() => generateMockPatients(150), []);
  const mockStaff = useMemo(() => generateMockStaff(25), []);
  const mockBeds = useMemo(() => generateMockBeds(), []);
  const mockBloodDonors = useMemo(() => generateMockBloodDonors(50), []);
  const mockBloodDonations = useMemo(
    () => generateMockBloodDonations(mockBloodDonors),
    [mockBloodDonors]
  );
  const mockBloodInventory = useMemo(
    () => calculateBloodInventory(mockBloodDonations),
    [mockBloodDonations]
  );
  const mockInquiries = useMemo(
    () => generateMockInquiries(mockPatients, mockStaff),
    [mockPatients, mockStaff]
  );

  // Dashboard statistics
  const dashboardStats = useMemo(
    () =>
      generateMockDashboardStats(
        mockPatients,
        mockStaff,
        mockBeds,
        mockBloodInventory,
        mockInquiries
      ),
    [mockPatients, mockStaff, mockBeds, mockBloodInventory, mockInquiries]
  );

  // Appointment data
  const appointmentData = useMemo(() => generateMockAppointmentData(), []);

  // Patient demographics
  const patientDemographics = useMemo(
    () => generateMockPatientDemographics(mockPatients),
    [mockPatients]
  );

  // Staff workload
  const staffWorkload = useMemo(
    () => generateMockStaffWorkload(mockStaff),
    [mockStaff]
  );

  // Financial data
  const financialData = useMemo(() => generateMockFinancialData(), []);

  // Emergency data
  const emergencyData = useMemo(() => generateMockEmergencyData(), []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              {role === 'admin' && 'System Administrator - Full access to all hospital operations'}
              {role === 'hospital_admin' && 'Hospital Administrator - Manage hospital-wide operations'}
              {role === 'doctor' && 'Doctor Dashboard - Patient care and clinical documentation'}
              {role === 'nurse' && 'Nurse Dashboard - Patient care and vital signs management'}
              {role === 'receptionist' && 'Receptionist Dashboard - Patient registration and appointments'}
              {role === 'lab_technician' && 'Laboratory Dashboard - Test management and results'}
              {role === 'pharmacist' && 'Pharmacy Dashboard - Medicine dispensing and inventory'}
              {role === 'accountant' && 'Accountant Dashboard - Financial management and billing'}
              {role === 'inventory_manager' && 'Inventory Dashboard - Supply management'}
              {role === 'viewer' && 'Viewer Dashboard - Read-only access to hospital data'}
              {!role && 'Overview of hospital operations and key metrics'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Statistics Cards */}
        <StatsCards stats={dashboardStats} />

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appointment Statistics - Visible to roles with appointment access */}
          <ProtectedComponent anyPermission={[Permission.APPOINTMENT_VIEW, Permission.REPORTS_VIEW]}>
            <AppointmentStats
              dailyData={appointmentData.dailyData}
              weeklyData={appointmentData.weeklyData}
              monthlyData={appointmentData.monthlyData}
            />
          </ProtectedComponent>

          {/* Patient Demographics - Visible to roles with patient access */}
          <ProtectedComponent anyPermission={[Permission.PATIENT_VIEW, Permission.REPORTS_VIEW]}>
            <PatientDemographics
              ageDistribution={patientDemographics.ageDistribution}
              visitFrequency={patientDemographics.visitFrequency}
              patientTypes={patientDemographics.patientTypes}
            />
          </ProtectedComponent>

          {/* Staff Utilization - Visible to admin and hospital admin */}
          <ProtectedComponent anyPermission={[Permission.STAFF_VIEW, Permission.REPORTS_VIEW]}>
            <StaffUtilization staffWorkload={staffWorkload} />
          </ProtectedComponent>

          {/* Financial Charts - Visible to roles with financial access */}
          <ProtectedComponent anyPermission={[Permission.FINANCIAL_VIEW, Permission.REPORTS_VIEW]}>
            <FinancialCharts financialData={financialData} />
          </ProtectedComponent>
        </div>

        {/* Emergency Response Stats - Full Width - Visible to roles with emergency access */}
        <ProtectedComponent anyPermission={[Permission.EMERGENCY_VIEW, Permission.REPORTS_VIEW]}>
          <EmergencyStats
            responseData={emergencyData.responseData}
            metrics={emergencyData.metrics}
          />
        </ProtectedComponent>

        {/* Quick Actions - Role-specific */}
        <Card className="p-6 bg-gunmetal border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <ProtectedComponent permission={Permission.PATIENT_CREATE}>
              <Button variant="outline" className="justify-start">
                Register New Patient
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.APPOINTMENT_CREATE}>
              <Button variant="outline" className="justify-start">
                Schedule Appointment
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.CLINICAL_RECORD}>
              <Button variant="outline" className="justify-start">
                Record Patient Visit
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.FLOW_VIEW}>
              <Button variant="outline" className="justify-start">
                View Patient Flow
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.LAB_MANAGE}>
              <Button variant="outline" className="justify-start">
                Process Lab Results
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.PHARMACY_DISPENSE}>
              <Button variant="outline" className="justify-start">
                Dispense Medication
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.BILLING_CREATE}>
              <Button variant="outline" className="justify-start">
                Create Bill
              </Button>
            </ProtectedComponent>
            
            <ProtectedComponent permission={Permission.INVENTORY_MANAGE}>
              <Button variant="outline" className="justify-start">
                Update Inventory
              </Button>
            </ProtectedComponent>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
