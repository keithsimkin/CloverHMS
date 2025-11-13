import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OPDVisit, Patient, Staff } from '@/types/models';
import { OPDVisitStatus } from '@/types/enums';
import { format } from 'date-fns';
import { EyeIcon } from 'lucide-react';

interface OPDVisitListProps {
  visits: OPDVisit[];
  patients: Patient[];
  doctors: Staff[];
  onViewVisit: (visit: OPDVisit) => void;
}

export function OPDVisitList({ visits, patients, doctors, onViewVisit }: OPDVisitListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Unknown';
  };

  const getStatusBadgeVariant = (status: OPDVisitStatus) => {
    switch (status) {
      case OPDVisitStatus.WAITING:
        return 'secondary';
      case OPDVisitStatus.IN_CONSULTATION:
        return 'default';
      case OPDVisitStatus.COMPLETED:
        return 'outline';
      case OPDVisitStatus.CANCELLED:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const filteredVisits = visits.filter((visit) => {
    const patientName = getPatientName(visit.patient_id).toLowerCase();
    const doctorName = getDoctorName(visit.doctor_id).toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      patientName.includes(search) ||
      doctorName.includes(search) ||
      visit.token_number.toLowerCase().includes(search) ||
      visit.department.toLowerCase().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>OPD Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by patient, doctor, token, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No OPD visits found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">{visit.token_number}</TableCell>
                    <TableCell>{getPatientName(visit.patient_id)}</TableCell>
                    <TableCell>{getDoctorName(visit.doctor_id)}</TableCell>
                    <TableCell>{visit.department}</TableCell>
                    <TableCell>{format(new Date(visit.visit_date), 'PP')}</TableCell>
                    <TableCell>${visit.consultation_fee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(visit.status)}>
                        {visit.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewVisit(visit)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredVisits.length} of {visits.length} visits
        </div>
      </CardContent>
    </Card>
  );
}
