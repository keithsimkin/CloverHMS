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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IPDAdmission, Patient, Staff, Bed } from '@/types/models';
import { IPDAdmissionType } from '@/types/enums';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const ipdAdmissionSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  bed_id: z.string().min(1, 'Bed is required'),
  admitting_doctor_id: z.string().min(1, 'Admitting doctor is required'),
  admission_date: z.date(),
  admission_time: z.string().min(1, 'Admission time is required'),
  admission_type: z.nativeEnum(IPDAdmissionType),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  expected_discharge_date: z.date().optional(),
  admission_notes: z.string().optional(),
});

type IPDAdmissionFormData = z.infer<typeof ipdAdmissionSchema>;

interface IPDAdmissionFormProps {
  admission?: IPDAdmission;
  patients: Patient[];
  doctors: Staff[];
  beds: Bed[];
  onSubmit: (data: IPDAdmissionFormData) => void;
  onCancel: () => void;
}

export function IPDAdmissionForm({
  admission,
  patients,
  doctors,
  beds,
  onSubmit,
  onCancel,
}: IPDAdmissionFormProps) {
  const form = useForm<IPDAdmissionFormData>({
    resolver: zodResolver(ipdAdmissionSchema),
    defaultValues: {
      patient_id: admission?.patient_id || '',
      bed_id: admission?.bed_id || '',
      admitting_doctor_id: admission?.admitting_doctor_id || '',
      admission_date: admission?.admission_date ? new Date(admission.admission_date) : new Date(),
      admission_time: admission?.admission_time || '',
      admission_type: admission?.admission_type || IPDAdmissionType.PLANNED,
      diagnosis: admission?.diagnosis || '',
      expected_discharge_date: admission?.expected_discharge_date
        ? new Date(admission.expected_discharge_date)
        : undefined,
      admission_notes: admission?.admission_notes || '',
    },
  });

  // Filter available beds
  const availableBeds = beds.filter((bed) => bed.status === 'available');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} ({patient.patient_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bed_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableBeds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id}>
                        {bed.bed_number} - {bed.bed_type} ({bed.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admitting_doctor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admitting Doctor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.first_name} {doctor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="admission_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Admission Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span className="text-muted-foreground">Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admission_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="admission_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admission Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select admission type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={IPDAdmissionType.EMERGENCY}>Emergency</SelectItem>
                  <SelectItem value={IPDAdmissionType.PLANNED}>Planned</SelectItem>
                  <SelectItem value={IPDAdmissionType.TRANSFER}>Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Initial diagnosis..."
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expected_discharge_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expected Discharge Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admission_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admission Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {admission ? 'Update Admission' : 'Admit Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
