import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BirthReportForm } from '@/components/reporting/BirthReportForm';
import { BirthReport, Patient, Staff } from '@/types/models';
import { Gender, DeliveryType, Role } from '@/types/enums';
import { PlusIcon, FileTextIcon, DownloadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock data for demonstration
const mockPatients: Patient[] = [
  {
    id: '1',
    patient_id: 'P001',
    first_name: 'Mary',
    last_name: 'Johnson',
    date_of_birth: new Date('1990-05-15'),
    gender: Gender.FEMALE,
    contact_phone: '+1234567890',
    address: '123 Main St',
    emergency_contact_name: 'John Johnson',
    emergency_contact_phone: '+1234567891',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin',
  },
];

const mockPhysicians: Staff[] = [
  {
    id: '1',
    employee_id: 'DOC001',
    first_name: 'Sarah',
    last_name: 'Williams',
    role: Role.DOCTOR,
    department: 'Obstetrics',
    specialization: 'Obstetrician',
    contact_phone: '+1234567892',
    contact_email: 'sarah.williams@hospital.com',
    employment_status: 'active' as any,
    hire_date: new Date('2020-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockBirthReports: BirthReport[] = [
  {
    id: '1',
    mother_patient_id: '1',
    baby_name: 'Emma Johnson',
    baby_gender: Gender.FEMALE,
    birth_date: new Date('2024-03-15'),
    birth_time: '14:30',
    birth_weight_kg: 3.2,
    birth_length_cm: 50,
    delivery_type: DeliveryType.NORMAL,
    attending_physician_id: '1',
    certificate_number: 'BIRTH-2024-001',
    created_at: new Date('2024-03-15'),
  },
];

export default function BirthReports() {
  const [reports, setReports] = useState<BirthReport[]>(mockBirthReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BirthReport | undefined>();
  const { toast } = useToast();

  const handleAddReport = () => {
    setSelectedReport(undefined);
    setShowForm(true);
  };

  const handleEditReport = (report: BirthReport) => {
    setSelectedReport(report);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    if (selectedReport) {
      // Update existing report
      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, ...data }
            : report
        )
      );
      toast({
        title: 'Birth Report Updated',
        description: 'Birth report has been updated successfully.',
      });
    } else {
      // Add new report
      const newReport: BirthReport = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date(),
      };
      setReports([...reports, newReport]);
      toast({
        title: 'Birth Report Created',
        description: 'New birth report has been created successfully.',
      });
    }
    setShowForm(false);
    setSelectedReport(undefined);
  };

  const handleGenerateCertificate = (report: BirthReport) => {
    toast({
      title: 'Certificate Generated',
      description: `Birth certificate ${report.certificate_number || 'generated'} is ready for download.`,
    });
  };

  const handleExportCSV = () => {
    toast({
      title: 'Export Started',
      description: 'Birth reports are being exported to CSV format.',
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export Started',
      description: 'Birth reports are being exported to PDF format.',
    });
  };

  const getMotherName = (motherId: string) => {
    const mother = mockPatients.find((p) => p.id === motherId);
    return mother ? `${mother.first_name} ${mother.last_name}` : 'Unknown';
  };

  const getPhysicianName = (physicianId: string) => {
    const physician = mockPhysicians.find((p) => p.id === physicianId);
    return physician ? `Dr. ${physician.first_name} ${physician.last_name}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Birth Reports</h1>
          <p className="text-muted-foreground">
            Manage birth reports and generate certificates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleAddReport}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Birth Report
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate No.</TableHead>
              <TableHead>Baby Name</TableHead>
              <TableHead>Mother</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Birth Time</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Delivery Type</TableHead>
              <TableHead>Physician</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  No birth reports found. Create your first report.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.certificate_number || 'Pending'}
                  </TableCell>
                  <TableCell>{report.baby_name}</TableCell>
                  <TableCell>{getMotherName(report.mother_patient_id)}</TableCell>
                  <TableCell>{format(new Date(report.birth_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{report.birth_time}</TableCell>
                  <TableCell>
                    <Badge variant={report.baby_gender === Gender.MALE ? 'default' : 'secondary'}>
                      {report.baby_gender}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.birth_weight_kg}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.delivery_type}</Badge>
                  </TableCell>
                  <TableCell>{getPhysicianName(report.attending_physician_id)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReport(report)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateCertificate(report)}
                      >
                        <FileTextIcon className="mr-1 h-4 w-4" />
                        Certificate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReport ? 'Edit Birth Report' : 'New Birth Report'}
            </DialogTitle>
          </DialogHeader>
          <BirthReportForm
            report={selectedReport}
            patients={mockPatients}
            physicians={mockPhysicians}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedReport(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
