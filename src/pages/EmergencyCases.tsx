import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CaseManagement } from '@/components/emergency/CaseManagement';
import { EmergencyCase, EmergencyCall, Ambulance, Staff } from '@/types/models';
import { EmergencyCallStatus, AmbulanceStatus, Role, EmploymentStatus } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockCalls: EmergencyCall[] = [
  {
    id: '1',
    call_time: new Date(Date.now() - 15 * 60000),
    caller_name: 'Jane Doe',
    caller_contact: '+1234567890',
    patient_name: 'John Doe',
    location: '123 Main Street, Apartment 4B',
    emergency_type: 'Cardiac Arrest',
    description: 'Patient collapsed, not breathing',
    priority: 'critical',
    status: EmergencyCallStatus.DISPATCHED,
    received_by: 'user-1',
  },
  {
    id: '2',
    call_time: new Date(Date.now() - 30 * 60000),
    caller_name: 'Robert Smith',
    caller_contact: '+1234567891',
    location: '456 Oak Avenue',
    emergency_type: 'Trauma/Accident',
    description: 'Car accident, multiple injuries',
    priority: 'high',
    status: EmergencyCallStatus.PATIENT_PICKED_UP,
    received_by: 'user-1',
  },
  {
    id: '3',
    call_time: new Date(Date.now() - 120 * 60000),
    caller_name: 'Mary Johnson',
    caller_contact: '+1234567892',
    patient_name: 'Sarah Johnson',
    location: '789 Elm Street',
    emergency_type: 'Respiratory Distress',
    description: 'Difficulty breathing',
    priority: 'high',
    status: EmergencyCallStatus.COMPLETED,
    received_by: 'user-1',
  },
];

const mockAmbulances: Ambulance[] = [
  {
    id: 'amb-1',
    vehicle_number: 'AMB-001',
    driver_name: 'John Smith',
    driver_contact: '+1234567890',
    status: AmbulanceStatus.AVAILABLE,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'amb-2',
    vehicle_number: 'AMB-002',
    driver_name: 'Sarah Johnson',
    driver_contact: '+1234567891',
    status: AmbulanceStatus.ON_CALL,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'amb-3',
    vehicle_number: 'AMB-003',
    driver_name: 'Michael Brown',
    driver_contact: '+1234567892',
    status: AmbulanceStatus.AVAILABLE,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    employee_id: 'EMP001',
    first_name: 'Dr. James',
    last_name: 'Wilson',
    role: Role.DOCTOR,
    department: 'Emergency',
    specialization: 'Emergency Medicine',
    contact_phone: '+1234567890',
    contact_email: 'james.wilson@hospital.com',
    employment_status: EmploymentStatus.ACTIVE,
    hire_date: new Date('2020-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'staff-2',
    employee_id: 'EMP002',
    first_name: 'Dr. Lisa',
    last_name: 'Cuddy',
    role: Role.DOCTOR,
    department: 'Emergency',
    specialization: 'Trauma Surgery',
    contact_phone: '+1234567891',
    contact_email: 'lisa.cuddy@hospital.com',
    employment_status: EmploymentStatus.ACTIVE,
    hire_date: new Date('2019-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockCases: EmergencyCase[] = [
  {
    id: 'case-1',
    call_id: '1',
    ambulance_id: 'amb-2',
    case_handler_id: 'staff-1',
    dispatch_time: new Date(Date.now() - 10 * 60000),
    patient_condition: 'Critical - Cardiac arrest',
    treatment_provided: 'CPR initiated, defibrillation performed',
    outcome: 'Stabilized, en route to hospital',
    notes: 'Patient responded to treatment',
  },
  {
    id: 'case-2',
    call_id: '2',
    ambulance_id: 'amb-1',
    case_handler_id: 'staff-2',
    dispatch_time: new Date(Date.now() - 25 * 60000),
    pickup_time: new Date(Date.now() - 15 * 60000),
    patient_condition: 'Multiple injuries, conscious',
    treatment_provided: 'Bleeding controlled, IV fluids administered',
    outcome: 'Stable, transported to trauma center',
    notes: 'Patient conscious and responsive',
  },
  {
    id: 'case-3',
    call_id: '3',
    ambulance_id: 'amb-3',
    case_handler_id: 'staff-1',
    dispatch_time: new Date(Date.now() - 115 * 60000),
    pickup_time: new Date(Date.now() - 105 * 60000),
    arrival_time: new Date(Date.now() - 90 * 60000),
    patient_condition: 'Severe asthma attack',
    treatment_provided: 'Nebulizer treatment, oxygen therapy',
    outcome: 'Breathing improved, admitted to hospital',
    response_time_minutes: 10,
    notes: 'Patient condition improved significantly',
  },
];

export default function EmergencyCases() {
  const [cases, setCases] = useState<EmergencyCase[]>(mockCases);
  const [calls] = useState<EmergencyCall[]>(mockCalls);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);
  const [staff] = useState<Staff[]>(mockStaff);
  const { toast } = useToast();

  const handleDispatchAmbulance = (caseId: string, ambulanceId: string) => {
    setCases(
      cases.map((c) =>
        c.id === caseId
          ? { ...c, ambulance_id: ambulanceId, dispatch_time: new Date() }
          : c
      )
    );
    setAmbulances(
      ambulances.map((amb) =>
        amb.id === ambulanceId ? { ...amb, status: AmbulanceStatus.ON_CALL } : amb
      )
    );
    toast({
      title: 'Ambulance Dispatched',
      description: 'Ambulance has been dispatched to the emergency location.',
    });
  };

  const handleAssignHandler = (caseId: string, handlerId: string) => {
    setCases(
      cases.map((c) =>
        c.id === caseId ? { ...c, case_handler_id: handlerId } : c
      )
    );
    toast({
      title: 'Handler Assigned',
      description: 'Case handler has been assigned to the emergency case.',
    });
  };

  const handleUpdateStatus = (caseId: string, status: string) => {
    // Update the corresponding call status
    const caseItem = cases.find((c) => c.id === caseId);
    if (caseItem) {
      // This would update the call status in a real implementation
      toast({
        title: 'Status Updated',
        description: `Case status updated to ${status}`,
      });
    }
  };

  const handleUpdateCase = (caseId: string, updates: Partial<EmergencyCase>) => {
    setCases(
      cases.map((c) => (c.id === caseId ? { ...c, ...updates } : c))
    );
    toast({
      title: 'Case Updated',
      description: 'Emergency case information has been updated.',
    });
  };

  // Calculate statistics
  const activeCases = cases.filter((c) => {
    const call = calls.find((call) => call.id === c.call_id);
    return call && !['completed', 'cancelled'].includes(call.status);
  });

  const completedCases = cases.filter((c) => {
    const call = calls.find((call) => call.id === c.call_id);
    return call && ['completed', 'cancelled'].includes(call.status);
  });

  const avgResponseTime =
    completedCases.reduce((sum, c) => sum + (c.response_time_minutes || 0), 0) /
    (completedCases.filter((c) => c.response_time_minutes).length || 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency Case Management</h1>
        <p className="text-muted-foreground">
          Track and manage emergency cases from dispatch to completion
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases.length}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCases.length}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(1)} min</div>
            <p className="text-xs text-muted-foreground">From call to pickup</p>
          </CardContent>
        </Card>
      </div>

      <CaseManagement
        cases={cases}
        calls={calls}
        ambulances={ambulances}
        staff={staff}
        onDispatchAmbulance={handleDispatchAmbulance}
        onAssignHandler={handleAssignHandler}
        onUpdateStatus={handleUpdateStatus}
        onUpdateCase={handleUpdateCase}
      />
    </div>
  );
}
