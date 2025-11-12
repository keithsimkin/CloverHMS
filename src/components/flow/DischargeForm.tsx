import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { DischargeType } from '@/types/enums';
import type { Patient, PatientFlow } from '@/types/models';

const dischargeSchema = z.object({
  discharge_type: z.nativeEnum(DischargeType),
  discharge_summary: z.string().min(10, 'Discharge summary must be at least 10 characters'),
  follow_up_required: z.boolean(),
  follow_up_date: z.string().optional(),
  discharge_medications: z.string().optional(),
  discharge_instructions: z.string().min(10, 'Discharge instructions must be at least 10 characters'),
});

type DischargeFormData = z.infer<typeof dischargeSchema>;

interface DischargeFormProps {
  patient: Patient;
  flow: PatientFlow;
  onSubmit: (data: DischargeFormData) => void;
  onCancel?: () => void;
}

function calculateVisitDuration(arrivalTime: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - arrivalTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes`;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
}

export function DischargeForm({ patient, flow, onSubmit, onCancel }: DischargeFormProps) {
  const form = useForm<DischargeFormData>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      discharge_type: DischargeType.ROUTINE,
      discharge_summary: '',
      follow_up_required: false,
      follow_up_date: '',
      discharge_medications: '',
      discharge_instructions: '',
    },
  });

  const followUpRequired = form.watch('follow_up_required');
  const visitDuration = calculateVisitDuration(flow.arrival_time);

  const handleSubmit = (data: DischargeFormData) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Discharge</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h4 className="font-semibold">Patient Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{' '}
                  <span className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Patient ID:</span>{' '}
                  <span className="font-medium">{patient.patient_id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>{' '}
                  <span className="font-medium capitalize">{patient.gender}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Age:</span>{' '}
                  <span className="font-medium">
                    {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years
                  </span>
                </div>
              </div>
              
              {/* Visit Duration */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Arrival Time:</span>
                    <span className="font-medium">
                      {new Date(flow.arrival_time).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    Total Visit: {visitDuration}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Discharge Type */}
            <FormField
              control={form.control}
              name="discharge_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discharge Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DischargeType.ROUTINE}>
                        Routine Discharge
                      </SelectItem>
                      <SelectItem value={DischargeType.AGAINST_MEDICAL_ADVICE}>
                        Against Medical Advice (AMA)
                      </SelectItem>
                      <SelectItem value={DischargeType.TRANSFER}>
                        Transfer to Another Facility
                      </SelectItem>
                      <SelectItem value={DischargeType.DECEASED}>
                        Deceased
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discharge Summary */}
            <FormField
              control={form.control}
              name="discharge_summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discharge Summary *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a comprehensive summary of the patient's visit, treatment provided, and current condition..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include diagnosis, treatment provided, and patient's condition at discharge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Follow-up Required */}
            <FormField
              control={form.control}
              name="follow_up_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Follow-up Required
                    </FormLabel>
                    <FormDescription>
                      Check if patient needs a follow-up appointment
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Follow-up Date */}
            {followUpRequired && (
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Recommended date for follow-up appointment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Discharge Medications */}
            <FormField
              control={form.control}
              name="discharge_medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discharge Medications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List medications to continue at home (one per line)..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Medications patient should continue taking after discharge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discharge Instructions */}
            <FormField
              control={form.control}
              name="discharge_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discharge Instructions *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed instructions for patient care at home, activity restrictions, diet recommendations, warning signs to watch for, etc..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Clear instructions for patient care after discharge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discharge Time Display */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discharge Time:</span>
                <span className="font-semibold">
                  {new Date().toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                Complete Discharge
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
