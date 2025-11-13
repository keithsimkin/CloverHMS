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
import { DeathReportForm } from '@/components/reporting/DeathReportForm';
import { DeathReport, Patient, Staff } from '@/types/models';
import { Gender, Role } from '@/types/enums';
import { PlusIcon, FileTextIcon, DownloadIcon, AlertTriangleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock data for demonstration
const mockPatients: Patient[] = [
  {
    id: '1',
    patient_id: 'P001',
    first_name: 'Robert',
    last_name: 'Smith',
    date_of_birth: new Date('1945-03-20'),
    gender: Gender.MALE,
    contact_phone: '+1234567890',
    address: '456 Oak Ave',
    emergency_contact_name: 'Jane Smith',
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
    first_name: 'Michael',
    last_name: 'Chen',
    role: Role.DOCTOR,
    department: 'Internal Medicine',
    specialization: 'Internist',
    contact_phone: '+1234567892',
    contact_email: 'michael.chen@hospital.com',
    employment_status: 'active' as any,
    hire_date: new Date('2018-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockDeathReports: DeathReport[] = [
  {
    id: '1',
    patient_id: '1',
    death_date: new Date('2024-03-10'),
    death_time: '03:45',
    cause_of_death: 'Cardiac arrest following myocardial infarction',
    place_of_death: 'ICU - Room 204',
    certifying_physician_id: '1',
    certificate_number: 'DEATH-2024-001',
    autopsy_required: false,
    created_at: new Date('2024-03-10'),
  },
];

export default function DeathReports() {
  const [reports, setReports] = useState<DeathReport[]>(mockDeathReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DeathReport | undefined>();
  const { toast } = useToast();

  const handleAddReport = () => {
    setSelectedReport(undefined);
    setShowForm(true);
  };

  const handleEditReport = (report: DeathReport) => {
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
        title: 'Death Report Updated',
        description: 'Death report has been updated successfully.',
      });
    } else {
      // Add new report
      const newReport: DeathReport = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date(),
      };
      setReports([...reports, newReport]);
      toast({
        title: 'Death Report Created',
        description: 'New death report has been created successfully.',
      });
    }
    setShowForm(false);
    setSelectedReport(undefined);
  };

  const handleGenerateCertificate = (report: DeathReport) => {
    toast({
      title: 'Certificate Generated',
      description: `Death certificate ${report.certificate_number || 'generated'} is ready for download.`,
    });
  };

  const handleExportCSV = () => {
    toast({
      title: 'Export Started',
      description: 'Death reports are being exported to CSV format.',
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export Started',
      description: 'Death reports are being exported to PDF format.',
    });
  };

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getPhysicianName = (physicianId: string) => {
    const physician = mockPhysicians.find((p) => p.id === physicianId);
    return physician ? `Dr. ${physician.first_name} ${physician.last_name}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Death Reports</h1>
          <p className="text-muted-foreground">
            Manage death reports and generate certificates
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
            New Death Report
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate No.</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Death Date</TableHead>
              <TableHead>Death Time</TableHead>
              <TableHead>Place of Death</TableHead>
              <TableHead>Cause of Death</TableHead>
              <TableHead>Certifying Physician</TableHead>
              <TableHead>Autopsy</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No death reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.certificate_number || 'Pending'}
                  </TableCell>
                  <TableCell>{getPatientName(report.patient_id)}</TableCell>
                  <TableCell>{format(new Date(report.death_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{report.death_time}</TableCell>
                  <TableCell>{report.place_of_death}</TableCell>
                  <TableCell className="max-w-xs truncate" title={report.cause_of_death}>
                    {report.cause_of_death}
                  </TableCell>
                  <TableCell>{getPhysicianName(report.certifying_physician_id)}</TableCell>
                  <TableCell>
                    {report.autopsy_required ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangleIcon className="h-3 w-3" />
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Required</Badge>
                    )}
                  </TableCell>
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
              {selectedReport ? 'Edit Death Report' : 'New Death Report'}
            </DialogTitle>
          </DialogHeader>
          <DeathReportForm
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
