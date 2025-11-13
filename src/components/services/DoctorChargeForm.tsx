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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DoctorOPDCharge, Staff } from '@/types/models';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const doctorChargeFormSchema = z.object({
  doctor_id: z.string().min(1, 'Doctor is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  consultation_fee: z.coerce.number().min(0, 'Consultation fee must be positive'),
  follow_up_fee: z.coerce.number().min(0, 'Follow-up fee must be positive'),
  effective_from: z.date({
    required_error: 'Effective from date is required',
  }),
  effective_until: z.date().optional(),
});

type DoctorChargeFormValues = z.infer<typeof doctorChargeFormSchema>;

interface DoctorChargeFormProps {
  initialData?: DoctorOPDCharge;
  doctors: Staff[];
  onSubmit: (data: Partial<DoctorOPDCharge>) => void;
  onCancel: () => void;
}

export function DoctorChargeForm({
  initialData,
  doctors,
  onSubmit,
  onCancel,
}: DoctorChargeFormProps) {
  const form = useForm<DoctorChargeFormValues>({
    resolver: zodResolver(doctorChargeFormSchema),
    defaultValues: {
      doctor_id: initialData?.doctor_id || '',
      specialization: initialData?.specialization || '',
      consultation_fee: initialData?.consultation_fee || 0,
      follow_up_fee: initialData?.follow_up_fee || 0,
      effective_from: initialData?.effective_from
        ? new Date(initialData.effective_from)
        : new Date(),
      effective_until: initialData?.effective_until
        ? new Date(initialData.effective_until)
        : undefined,
    },
  });

  const selectedDoctorId = form.watch('doctor_id');
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Auto-fill specialization when doctor is selected
  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor && doctor.specialization) {
      form.setValue('specialization', doctor.specialization);
    }
  };

  const handleSubmit = (values: DoctorChargeFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="doctor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleDoctorChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctors
                    .filter((d) => d.role === 'doctor')
                    .map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.first_name} {doctor.last_name}
                        {doctor.specialization && ` - ${doctor.specialization}`}
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
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cardiology" {...field} />
              </FormControl>
              <FormDescription>
                {selectedDoctor?.specialization
                  ? 'Auto-filled from doctor profile'
                  : 'Enter the specialization'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="consultation_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Fee ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>First visit consultation fee</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="follow_up_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow-up Fee ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>Follow-up visit fee</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="effective_from"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective From</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>When this pricing becomes effective</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effective_until"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Until (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>No end date</span>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Leave empty for indefinite pricing</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Charges' : 'Set Charges'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
