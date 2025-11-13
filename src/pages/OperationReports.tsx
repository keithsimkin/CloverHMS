import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OperationReportForm } from '@/components/reporting/OperationReportForm';
import { OperationReport, Patient, Staff } from '@/types/models';
import { Gender, Role, OperationOutcome } from '@/types/enums';
import { PlusIcon, DownloadIcon, ClockIcon, ActivityIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInMinutes, parseISO } from 'date-fns';

// Mock data for demonstration
const mockPatients: Patient[] = [
  {
    id: '1',
    patient_id: 'P001',
    first_name: 'James',
    last_name: 'Wilson',
    date_of_birth: new Date('1975-08-12'),
    gender: Gender.MALE,
    contact_phone: '+1234567890',
    address: '789 Pine St',
    emergency_contact_name: 'Lisa Wilson',
    emergency_contact_phone: '+1234567891',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin',
  },
];

const mockSurgeons: Staff[] = [
  {
    id: '1',
    employee_id: 'DOC001',
    first_name: 'David',
    last_name: 'Martinez',
    role: Role.DOCTOR,
    department: 'Surgery',
    specialization: 'General Surgeon',
    contact_phone: '+1234567892',
    contact_email: 'david.martinez@hospital.com',
    employment_status: 'active' as any,
    hire_date: new Date('2015-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockAnesthetists: Staff[] = [
  {
    id: '2',
    employee_id: 'DOC002',
    first_name: 'Emily',
    last_name: 'Thompson',
    role: Role.DOCTOR,
    department: 'Anesthesiology',
    specialization: 'Anesthesiologist',
    contact_phone: '+1234567893',
    contact_email: 'emily.thompson@hospital.com',
    employment_status: 'active' as any,
    hire_date: new Date('2016-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockOperationReports: OperationReport[] = [
  {
    id: '1',
    patient_id: '1',
    operation_type: 'Appendectomy',
    operation_date: new Date('2024-03-12'),
    start_time: '09:00',
    end_time: '10:30',
    duration_minutes: 90,
    surgeon_id: '1',
    assistant_surgeons: [],
    anesthetist_id: '2',
    operation_theater: 'OT-1',
    pre_operative_diagnosis: 'Acute appendicitis',
    post_operative_diagnosis: 'Acute appendicitis with perforation',
    procedure_performed: 'Laparoscopic appendectomy performed. Appendix removed successfully. No complications during procedure.',
    outcome: OperationOutcome.SUCCESSFUL,
    created_at: new Date('2024-03-12'),
  },
];

export default function OperationReports() {
  const [reports, setReports] = useState<OperationReport[]>(mockOperationReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<OperationReport | undefined>();
  const { toast } = useToast();

  const handleAddReport = () => {
    setSelectedReport(undefined);
    setShowForm(true);
  };

  const handleEditReport = (report: OperationReport) => {
    setSelectedReport(report);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    // Calculate duration
    const startTime = data.start_time;
    const endTime = data.end_time;
    const startDate = parseISO(`2000-01-01T${startTime}`);
    const endDate = parseISO(`2000-01-01T${endTime}`);
    const duration = differenceInMinutes(endDate, startDate);

    if (selectedReport) {
      // Update existing report
      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, ...data, duration_minutes: duration }
            : report
        )
      );
      toast({
        title: 'Operation Report Updated',
        description: 'Operation report has been updated successfully.',
      });
    } else {
      // Add new report
      const newReport: OperationReport = {
        id: Date.now().toString(),
        ...data,
        duration_minutes: duration,
        assistant_surgeons: [],
        created_at: new Date(),
      };
      setReports([...reports, newReport]);
      toast({
        title: 'Operation Report Created',
        description: 'New operation report has been created successfully.',
      });
    }
    setShowForm(false);
    setSelectedReport(undefined);
  };

  const handleExportCSV = () => {
    toast({
      title: 'Export Started',
      description: 'Operation reports are being exported to CSV format.',
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export Started',
      description: 'Operation reports are being exported to PDF format.',
    });
  };

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getSurgeonName = (surgeonId: string) => {
    const surgeon = mockSurgeons.find((s) => s.id === surgeonId);
    return surgeon ? `Dr. ${surgeon.first_name} ${surgeon.last_name}` : 'Unknown';
  };

  const getAnesthetistName = (anesthetistId: string) => {
    const anesthetist = mockAnesthetists.find((a) => a.id === anesthetistId);
    return anesthetist ? `Dr. ${anesthetist.first_name} ${anesthetist.last_name}` : 'Unknown';
  };

  const getOutcomeBadgeVariant = (outcome: OperationOutcome) => {
    switch (outcome) {
      case OperationOutcome.SUCCESSFUL:
        return 'default';
      case OperationOutcome.COMPLICATIONS:
        return 'secondary';
      case OperationOutcome.FAILED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Calculate statistics
  const totalOperations = reports.length;
  const successfulOperations = reports.filter(r => r.outcome === OperationOutcome.SUCCESSFUL).length;
  const averageDuration = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.duration_minutes, 0) / reports.length)
    : 0;
  const successRate = totalOperations > 0
    ? Math.round((successfulOperations / totalOperations) * 100)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operation Reports</h1>
          <p className="text-muted-foreground">
            Manage surgical operation reports and track outcomes
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
            New Operation Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOperations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulOperations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDuration} min</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Operation Type</TableHead>
              <TableHead>Theater</TableHead>
              <TableHead>Surgeon</TableHead>
              <TableHead>Anesthetist</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No operation reports found. Create your first report.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{format(new Date(report.operation_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{getPatientName(report.patient_id)}</TableCell>
                  <TableCell className="font-medium">{report.operation_type}</TableCell>
                  <TableCell>{report.operation_theater}</TableCell>
                  <TableCell>{getSurgeonName(report.surgeon_id)}</TableCell>
                  <TableCell>{getAnesthetistName(report.anesthetist_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3 text-muted-foreground" />
                      {report.duration_minutes} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getOutcomeBadgeVariant(report.outcome)}>
                      {report.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReport(report)}
                    >
                      View/Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReport ? 'Edit Operation Report' : 'New Operation Report'}
            </DialogTitle>
          </DialogHeader>
          <OperationReportForm
            report={selectedReport}
            patients={mockPatients}
            surgeons={mockSurgeons}
            anesthetists={mockAnesthetists}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedReport(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
