import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Patient, PatientVisit } from '@/types/models';
import { format } from 'date-fns';

interface PatientDetailsProps {
  patient: Patient;
  visits?: PatientVisit[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PatientDetails({
  patient,
  visits = [],
  onEdit,
  onDelete,
}: PatientDetailsProps) {
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {patient.first_name} {patient.last_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Patient ID: {patient.patient_id}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p className="text-sm">
                {format(new Date(patient.date_of_birth), 'MMMM dd, yyyy')} (
                {calculateAge(patient.date_of_birth)} years old)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <Badge variant="outline" className="capitalize mt-1">
                {patient.gender}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
              {patient.blood_type ? (
                <Badge variant="secondary" className="mt-1">
                  {patient.blood_type}
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{patient.contact_phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">
                {patient.contact_email || (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm">{patient.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{patient.emergency_contact_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{patient.emergency_contact_phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Allergies</p>
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy: string, index: number) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No known allergies</p>
            )}
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Medical History</p>
            {patient.medical_history ? (
              <p className="text-sm whitespace-pre-wrap">{patient.medical_history}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No medical history recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visit History */}
      <Card>
        <CardHeader>
          <CardTitle>Visit History</CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length > 0 ? (
            <div className="space-y-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {format(new Date(visit.visit_date), 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: <span className="capitalize">{visit.visit_type}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Chief Complaint: {visit.chief_complaint}
                    </p>
                    {visit.visit_summary && (
                      <p className="text-sm mt-2">{visit.visit_summary}</p>
                    )}
                  </div>
                  {visit.vital_signs && (
                    <div className="text-right text-sm text-muted-foreground">
                      {visit.vital_signs.temperature && (
                        <p>Temp: {visit.vital_signs.temperature}°C</p>
                      )}
                      {visit.vital_signs.blood_pressure && (
                        <p>BP: {visit.vital_signs.blood_pressure}</p>
                      )}
                      {visit.vital_signs.heart_rate && (
                        <p>HR: {visit.vital_signs.heart_rate} bpm</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No visit records found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium">Created</p>
              <p>{format(new Date(patient.created_at), 'MMMM dd, yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="font-medium">Last Updated</p>
              <p>{format(new Date(patient.updated_at), 'MMMM dd, yyyy HH:mm')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
