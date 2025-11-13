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
import { IPDAdmissionList } from '@/components/opd-ipd/IPDAdmissionList';
import { IPDAdmissionForm } from '@/components/opd-ipd/IPDAdmissionForm';
import { IPDAdmission, Patient, Staff, Bed } from '@/types/models';
import { IPDAdmissionStatus, IPDAdmissionType, Role, EmploymentStatus, BedStatus, BedType, Gender, BloodType } from '@/types/enums';
import { PlusIcon, BedIcon, UsersIcon, TrendingUpIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays } from 'date-fns';

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

const mockBeds: Bed[] = [
  {
    id: 'bed-1',
    bed_number: 'ICU-101',
    bed_type: BedType.ICU,
    department: 'ICU',
    floor: 1,
    room_number: '101',
    status: BedStatus.AVAILABLE,
    daily_rate: 500,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bed-2',
    bed_number: 'GEN-201',
    bed_type: BedType.GENERAL,
    department: 'General Ward',
    floor: 2,
    room_number: '201',
    status: BedStatus.AVAILABLE,
    daily_rate: 200,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockAdmissions: IPDAdmission[] = [
  {
    id: '1',
    patient_id: 'patient-1',
    bed_id: 'bed-1',
    admitting_doctor_id: 'doctor-1',
    admission_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    admission_time: '10:30',
    admission_type: IPDAdmissionType.EMERGENCY,
    diagnosis: 'Acute respiratory distress',
    status: IPDAdmissionStatus.ADMITTED,
    total_charges: 1500,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default function IPD() {
  const [admissions, setAdmissions] = useState<IPDAdmission[]>(mockAdmissions);
  const [beds, setBeds] = useState<Bed[]>(mockBeds);
  const [showForm, setShowForm] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<IPDAdmission | undefined>();
  const { toast } = useToast();

  const handleCreateAdmission = (data: any) => {
    const newAdmission: IPDAdmission = {
      id: `admission-${Date.now()}`,
      ...data,
      status: IPDAdmissionStatus.ADMITTED,
      total_charges: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    setAdmissions([newAdmission, ...admissions]);

    // Update bed status
    setBeds(
      beds.map((bed) =>
        bed.id === data.bed_id
          ? { ...bed, status: BedStatus.OCCUPIED }
          : bed
      )
    );

    toast({
      title: 'Patient Admitted',
      description: 'IPD admission has been registered successfully.',
    });
    setShowForm(false);
  };

  const handleViewAdmission = (admission: IPDAdmission) => {
    setSelectedAdmission(admission);
    toast({
      title: 'Opening Admission Details',
      description: 'Loading admission information...',
    });
  };

  const activeAdmissions = admissions.filter(
    (a) => a.status === IPDAdmissionStatus.ADMITTED
  );

  const occupiedBeds = beds.filter((b) => b.status === BedStatus.OCCUPIED).length;
  const totalBeds = beds.length;
  const occupancyRate = (occupiedBeds / totalBeds) * 100;

  const avgStayDuration =
    activeAdmissions.reduce((sum, a) => {
      return sum + differenceInDays(new Date(), new Date(a.admission_date));
    }, 0) / (activeAdmissions.length || 1);

  const totalRevenue = admissions.reduce((sum, a) => sum + a.total_charges, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IPD Management</h1>
          <p className="text-muted-foreground">
            Manage inpatient department admissions and bed allocation
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Admit Patient
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admissions</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently admitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <BedIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {occupiedBeds} of {totalBeds} beds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stay Duration</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStayDuration.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">
              Current patients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All admissions
            </p>
          </CardContent>
        </Card>
      </div>

      <IPDAdmissionList
        admissions={admissions}
        patients={mockPatients}
        doctors={mockDoctors}
        beds={beds}
        onViewAdmission={handleViewAdmission}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admit Patient to IPD</DialogTitle>
          </DialogHeader>
          <IPDAdmissionForm
            admission={selectedAdmission}
            patients={mockPatients}
            doctors={mockDoctors}
            beds={beds}
            onSubmit={handleCreateAdmission}
            onCancel={() => {
              setShowForm(false);
              setSelectedAdmission(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
