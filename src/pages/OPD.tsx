import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OPDVisitList } from '@/components/opd-ipd/OPDVisitList';
import { OPDVisitForm } from '@/components/opd-ipd/OPDVisitForm';
import { OPDVisit, Patient, Staff } from '@/types/models';
import { OPDVisitStatus, Role, EmploymentStatus, Gender, BloodType } from '@/types/enums';
import { PlusIcon, UsersIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    patient_id: 'P001',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: new Date('1985-05-15'),
    gender: Gender.MALE,
    contact_phone: '+1234567890',
    contact_email: 'john.doe@email.com',
    address: '123 Main St',
    blood_type: BloodType.O_POSITIVE,
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '+1234567899',
    created_by: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockDoctors: Staff[] = [
  {
    id: 'doctor-1',
    employee_id: 'DOC001',
    first_name: 'Sarah',
    last_name: 'Johnson',
    role: Role.DOCTOR,
    department: 'General Medicine',
    specialization: 'Internal Medicine',
    contact_phone: '+1234567891',
    contact_email: 'sarah.j@hospital.com',
    employment_status: EmploymentStatus.ACTIVE,
    hire_date: new Date('2020-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockVisits: OPDVisit[] = [
  {
    id: '1',
    patient_id: 'patient-1',
    doctor_id: 'doctor-1',
    department: 'General Medicine',
    visit_date: new Date(),
    token_number: 'OPD-001',
    consultation_fee: 50,
    status: OPDVisitStatus.WAITING,
    chief_complaint: 'Fever and headache',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default function OPD() {
  const [visits, setVisits] = useState<OPDVisit[]>(mockVisits);
  const [showForm, setShowForm] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<OPDVisit | undefined>();
  const { toast } = useToast();

  const handleCreateVisit = (data: any) => {
    const newVisit: OPDVisit = {
      id: `visit-${Date.now()}`,
      ...data,
      status: OPDVisitStatus.WAITING,
      created_at: new Date(),
      updated_at: new Date(),
    };

    setVisits([newVisit, ...visits]);
    toast({
      title: 'OPD Visit Registered',
      description: `Token number: ${data.token_number}`,
    });
    setShowForm(false);
  };

  const handleViewVisit = (visit: OPDVisit) => {
    setSelectedVisit(visit);
    toast({
      title: 'Opening Visit Details',
      description: 'Loading visit information...',
    });
  };

  const todayVisits = visits.filter(
    (v) =>
      new Date(v.visit_date).toDateString() === new Date().toDateString()
  );

  const waitingCount = todayVisits.filter(
    (v) => v.status === OPDVisitStatus.WAITING
  ).length;

  const inConsultationCount = todayVisits.filter(
    (v) => v.status === OPDVisitStatus.IN_CONSULTATION
  ).length;

  const completedCount = todayVisits.filter(
    (v) => v.status === OPDVisitStatus.COMPLETED
  ).length;

  const totalRevenue = todayVisits.reduce(
    (sum, v) => sum + v.consultation_fee,
    0
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OPD Management</h1>
          <p className="text-muted-foreground">
            Manage outpatient department visits and consultations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Register Visit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisits.length}</div>
            <p className="text-xs text-muted-foreground">
              Revenue: ${totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingCount}</div>
            <p className="text-xs text-muted-foreground">In queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inConsultationCount}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      <OPDVisitList
        visits={visits}
        patients={mockPatients}
        doctors={mockDoctors}
        onViewVisit={handleViewVisit}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register OPD Visit</DialogTitle>
          </DialogHeader>
          <OPDVisitForm
            visit={selectedVisit}
            patients={mockPatients}
            doctors={mockDoctors}
            onSubmit={handleCreateVisit}
            onCancel={() => {
              setShowForm(false);
              setSelectedVisit(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
