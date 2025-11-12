import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriorityLevel } from '@/types/enums';
import type { Patient, PatientFlow, TriageRecord, VitalSigns } from '@/types/models';

const triageSchema = z.object({
  priority_level: z.nativeEnum(PriorityLevel),
  chief_complaint: z.string().min(5, 'Chief complaint must be at least 5 characters'),
  temperature: z.string().optional(),
  blood_pressure: z.string().optional(),
  heart_rate: z.string().optional(),
  respiratory_rate: z.string().optional(),
  oxygen_saturation: z.string().optional(),
  pain_level: z.string().optional(),
  triage_notes: z.string().optional(),
});

type TriageFormData = z.infer<typeof triageSchema>;

interface TriageFormProps {
  patient: Patient;
  flow: PatientFlow;
  onSubmit: (data: Omit<TriageRecord, 'id' | 'triaged_at' | 'triaged_by'>) => void;
  onCancel: () => void;
}

export default function TriageForm({ patient, flow, onSubmit, onCancel }: TriageFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TriageFormData>({
    resolver: zodResolver(triageSchema),
    defaultValues: {
      priority_level: PriorityLevel.NON_URGENT,
      chief_complaint: '',
      temperature: '',
      blood_pressure: '',
      heart_rate: '',
      respiratory_rate: '',
      oxygen_saturation: '',
      pain_level: '',
      triage_notes: '',
    },
  });

  const priorityLevel = watch('priority_level');

  const onFormSubmit = (data: TriageFormData) => {
    const vitalSigns: VitalSigns = {
      temperature: data.temperature ? parseFloat(data.temperature) : undefined,
      blood_pressure: data.blood_pressure || undefined,
      heart_rate: data.heart_rate ? parseInt(data.heart_rate) : undefined,
      respiratory_rate: data.respiratory_rate ? parseInt(data.respiratory_rate) : undefined,
      oxygen_saturation: data.oxygen_saturation ? parseFloat(data.oxygen_saturation) : undefined,
      pain_level: data.pain_level ? parseInt(data.pain_level) : undefined,
    };

    onSubmit({
      patient_id: patient.id,
      flow_id: flow.id,
      priority_level: data.priority_level,
      chief_complaint: data.chief_complaint,
      vital_signs: vitalSigns,
      triage_notes: data.triage_notes,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
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
              <span className="text-muted-foreground">Age:</span>{' '}
              <span className="font-medium">
                {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Gender:</span>{' '}
              <span className="font-medium capitalize">{patient.gender}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Level */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="priority_level">
              Priority Level <span className="text-destructive">*</span>
            </Label>
            <Select
              value={priorityLevel}
              onValueChange={(value) => setValue('priority_level', value as PriorityLevel)}
            >
              <SelectTrigger id="priority_level">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PriorityLevel.CRITICAL}>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Critical - Immediate attention required
                  </span>
                </SelectItem>
                <SelectItem value={PriorityLevel.URGENT}>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Urgent - Attention within 30 minutes
                  </span>
                </SelectItem>
                <SelectItem value={PriorityLevel.SEMI_URGENT}>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-info" />
                    Semi-Urgent - Attention within 1-2 hours
                  </span>
                </SelectItem>
                <SelectItem value={PriorityLevel.NON_URGENT}>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Non-Urgent - Standard wait time
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.priority_level && (
              <p className="text-sm text-destructive">{errors.priority_level.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="chief_complaint">
              Chief Complaint <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="chief_complaint"
              {...register('chief_complaint')}
              placeholder="Describe the main reason for visit..."
              rows={3}
            />
            {errors.chief_complaint && (
              <p className="text-sm text-destructive">{errors.chief_complaint.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="37.0"
                {...register('temperature')}
              />
              {errors.temperature && (
                <p className="text-sm text-destructive">{errors.temperature.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_pressure">Blood Pressure (mmHg)</Label>
              <Input
                id="blood_pressure"
                type="text"
                placeholder="120/80"
                {...register('blood_pressure')}
              />
              {errors.blood_pressure && (
                <p className="text-sm text-destructive">{errors.blood_pressure.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
              <Input
                id="heart_rate"
                type="number"
                placeholder="72"
                {...register('heart_rate')}
              />
              {errors.heart_rate && (
                <p className="text-sm text-destructive">{errors.heart_rate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="respiratory_rate">Respiratory Rate (breaths/min)</Label>
              <Input
                id="respiratory_rate"
                type="number"
                placeholder="16"
                {...register('respiratory_rate')}
              />
              {errors.respiratory_rate && (
                <p className="text-sm text-destructive">{errors.respiratory_rate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxygen_saturation">Oxygen Saturation (%)</Label>
              <Input
                id="oxygen_saturation"
                type="number"
                step="0.1"
                placeholder="98"
                {...register('oxygen_saturation')}
              />
              {errors.oxygen_saturation && (
                <p className="text-sm text-destructive">{errors.oxygen_saturation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain_level">Pain Level (0-10)</Label>
              <Input
                id="pain_level"
                type="number"
                min="0"
                max="10"
                placeholder="0"
                {...register('pain_level')}
              />
              {errors.pain_level && (
                <p className="text-sm text-destructive">{errors.pain_level.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="triage_notes">Triage Notes</Label>
            <Textarea
              id="triage_notes"
              {...register('triage_notes')}
              placeholder="Any additional observations or notes..."
              rows={4}
            />
            {errors.triage_notes && (
              <p className="text-sm text-destructive">{errors.triage_notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Complete Triage'}
        </Button>
      </div>
    </form>
  );
}
