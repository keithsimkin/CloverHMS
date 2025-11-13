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
import { IPDAdmission, Patient, Staff, Bed } from '@/types/models';
import { IPDAdmissionStatus, IPDAdmissionType } from '@/types/enums';
import { format, differenceInDays } from 'date-fns';
import { EyeIcon } from 'lucide-react';

interface IPDAdmissionListProps {
  admissions: IPDAdmission[];
  patients: Patient[];
  doctors: Staff[];
  beds: Bed[];
  onViewAdmission: (admission: IPDAdmission) => void;
}

export function IPDAdmissionList({
  admissions,
  patients,
  doctors,
  beds,
  onViewAdmission,
}: IPDAdmissionListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Unknown';
  };

  const getBedNumber = (bedId: string) => {
    const bed = beds.find((b) => b.id === bedId);
    return bed ? bed.bed_number : 'Unknown';
  };

  const getStatusBadgeVariant = (status: IPDAdmissionStatus) => {
    switch (status) {
      case IPDAdmissionStatus.ADMITTED:
        return 'default';
      case IPDAdmissionStatus.DISCHARGED:
        return 'outline';
      case IPDAdmissionStatus.TRANSFERRED:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeBadgeVariant = (type: IPDAdmissionType) => {
    switch (type) {
      case IPDAdmissionType.EMERGENCY:
        return 'destructive';
      case IPDAdmissionType.PLANNED:
        return 'default';
      case IPDAdmissionType.TRANSFER:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const calculateStayDays = (admission: IPDAdmission) => {
    if (admission.actual_discharge_date) {
      return differenceInDays(
        new Date(admission.actual_discharge_date),
        new Date(admission.admission_date)
      );
    }
    return differenceInDays(new Date(), new Date(admission.admission_date));
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const patientName = getPatientName(admission.patient_id).toLowerCase();
    const doctorName = getDoctorName(admission.admitting_doctor_id).toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      patientName.includes(search) ||
      doctorName.includes(search) ||
      admission.diagnosis.toLowerCase().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>IPD Admissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by patient, doctor, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Bed</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stay</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No IPD admissions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getPatientName(admission.patient_id)}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {admission.diagnosis}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getBedNumber(admission.bed_id)}</TableCell>
                    <TableCell>{getDoctorName(admission.admitting_doctor_id)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(admission.admission_date), 'PP')}</p>
                        <p className="text-muted-foreground">{admission.admission_time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(admission.admission_type)}>
                        {admission.admission_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{calculateStayDays(admission)} days</TableCell>
                    <TableCell>${admission.total_charges.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(admission.status)}>
                        {admission.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewAdmission(admission)}
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
          Showing {filteredAdmissions.length} of {admissions.length} admissions
        </div>
      </CardContent>
    </Card>
  );
}
