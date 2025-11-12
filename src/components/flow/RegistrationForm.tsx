import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Patient } from '@/types/models';
import { VisitType } from '@/types/enums';

const registrationSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  visit_type: z.nativeEnum(VisitType),
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  notes: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  patients: Patient[];
  onSubmit: (data: RegistrationFormData) => void;
  onCancel?: () => void;
}

export function RegistrationForm({ patients, onSubmit, onCancel }: RegistrationFormProps) {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      patient_id: '',
      visit_type: VisitType.CONSULTATION,
      chief_complaint: '',
      notes: '',
    },
  });

  const handleSubmit = (data: RegistrationFormData) => {
    onSubmit(data);
    form.reset();
  };

  const selectedPatient = patients.find(p => p.id === form.watch('patient_id'));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Patient Selection */}
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} - {patient.patient_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Details Display */}
            {selectedPatient && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    <span className="font-medium">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>{' '}
                    <span className="font-medium">{selectedPatient.patient_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>{' '}
                    <span className="font-medium capitalize">{selectedPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>{' '}
                    <span className="font-medium">
                      {new Date().getFullYear() - new Date(selectedPatient.date_of_birth).getFullYear()} years
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{' '}
                    <span className="font-medium">{selectedPatient.contact_phone}</span>
                  </div>
                  {selectedPatient.blood_type && (
                    <div>
                      <span className="text-muted-foreground">Blood Type:</span>{' '}
                      <span className="font-medium">{selectedPatient.blood_type}</span>
                    </div>
                  )}
                </div>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">Allergies:</span>{' '}
                    <span className="font-medium text-destructive">
                      {selectedPatient.allergies.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Visit Type */}
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={VisitType.CONSULTATION}>Consultation</SelectItem>
                      <SelectItem value={VisitType.FOLLOW_UP}>Follow-up</SelectItem>
                      <SelectItem value={VisitType.EMERGENCY}>Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chief Complaint */}
            <FormField
              control={form.control}
              name="chief_complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the main reason for visit..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Arrival Time Display */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Arrival Time:</span>
                <span className="font-semibold">
                  {new Date().toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                Register Patient
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
