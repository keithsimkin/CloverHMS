import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import type { Patient, PatientFlow, LaboratoryOrder } from '@/types/models';

const labOrderSchema = z.object({
  test_type: z.string().min(1, 'Test type is required'),
  test_name: z.string().min(1, 'Test name is required'),
  priority: z.enum(['routine', 'urgent', 'stat']),
  notes: z.string().optional(),
});

type LabOrderFormData = z.infer<typeof labOrderSchema>;

interface LabOrderFormProps {
  patient: Patient;
  flow: PatientFlow;
  visitId: string;
  onSubmit: (data: Omit<LaboratoryOrder, 'id' | 'ordered_at' | 'ordered_by' | 'status' | 'sample_collected_at' | 'results_available_at' | 'results'>) => void;
  onCancel: () => void;
}

const testTypes = [
  'Blood Test',
  'Urine Test',
  'X-Ray',
  'CT Scan',
  'MRI',
  'Ultrasound',
  'ECG',
  'Echocardiogram',
  'Biopsy',
  'Culture Test',
];

const testNamesByType: Record<string, string[]> = {
  'Blood Test': [
    'Complete Blood Count (CBC)',
    'Blood Glucose',
    'Lipid Profile',
    'Liver Function Test',
    'Kidney Function Test',
    'Thyroid Function Test',
    'Hemoglobin A1C',
    'Electrolytes',
  ],
  'Urine Test': [
    'Urinalysis',
    'Urine Culture',
    'Urine Protein',
    '24-Hour Urine Collection',
  ],
  'X-Ray': [
    'Chest X-Ray',
    'Abdominal X-Ray',
    'Spine X-Ray',
    'Extremity X-Ray',
  ],
  'CT Scan': [
    'Head CT',
    'Chest CT',
    'Abdominal CT',
    'Pelvic CT',
    'CT Angiography',
  ],
  'MRI': [
    'Brain MRI',
    'Spine MRI',
    'Joint MRI',
    'Abdominal MRI',
    'Cardiac MRI',
  ],
  'Ultrasound': [
    'Abdominal Ultrasound',
    'Pelvic Ultrasound',
    'Cardiac Echo',
    'Doppler Ultrasound',
    'Obstetric Ultrasound',
  ],
  'ECG': ['12-Lead ECG', 'Holter Monitor', 'Stress Test ECG'],
  'Echocardiogram': ['Transthoracic Echo', 'Transesophageal Echo', 'Stress Echo'],
  'Biopsy': ['Tissue Biopsy', 'Bone Marrow Biopsy', 'Liver Biopsy', 'Kidney Biopsy'],
  'Culture Test': ['Blood Culture', 'Throat Culture', 'Wound Culture', 'Sputum Culture'],
};

export default function LabOrderForm({ patient, flow, visitId, onSubmit, onCancel }: LabOrderFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LabOrderFormData>({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      test_type: '',
      test_name: '',
      priority: 'routine',
      notes: '',
    },
  });

  const testType = watch('test_type');
  const priority = watch('priority');

  const availableTestNames = testType ? testNamesByType[testType] || [] : [];

  const onFormSubmit = (data: LabOrderFormData) => {
    onSubmit({
      patient_id: patient.id,
      visit_id: visitId,
      flow_id: flow.id,
      test_type: data.test_type,
      test_name: data.test_name,
      priority: data.priority,
      notes: data.notes,
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

      {/* Test Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Test Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test_type">
              Test Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={testType}
              onValueChange={(value) => {
                setValue('test_type', value);
                setValue('test_name', ''); // Reset test name when type changes
              }}
            >
              <SelectTrigger id="test_type">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.test_type && (
              <p className="text-sm text-destructive">{errors.test_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="test_name">
              Test Name <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch('test_name')}
              onValueChange={(value) => setValue('test_name', value)}
              disabled={!testType}
            >
              <SelectTrigger id="test_name">
                <SelectValue placeholder={testType ? 'Select test name' : 'Select test type first'} />
              </SelectTrigger>
              <SelectContent>
                {availableTestNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.test_name && (
              <p className="text-sm text-destructive">{errors.test_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority <span className="text-destructive">*</span>
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setValue('priority', value as 'routine' | 'urgent' | 'stat')}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Routine - Standard processing
                  </span>
                </SelectItem>
                <SelectItem value="urgent">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Urgent - Priority processing
                  </span>
                </SelectItem>
                <SelectItem value="stat">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    STAT - Immediate processing
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions / Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Any special instructions or notes for the lab..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
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
          {isSubmitting ? 'Ordering...' : 'Order Test'}
        </Button>
      </div>
    </form>
  );
}
