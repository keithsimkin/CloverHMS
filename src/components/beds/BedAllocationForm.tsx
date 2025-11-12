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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bed, Patient, BedAllocation } from '@/types/models';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const bedAllocationSchema = z.object({
  bed_id: z.string().min(1, 'Bed is required'),
  patient_id: z.string().min(1, 'Patient is required'),
  visit_id: z.string().min(1, 'Visit ID is required'),
  expected_discharge_date: z.date().optional(),
  notes: z.string().optional(),
});

type BedAllocationFormData = z.infer<typeof bedAllocationSchema>;

interface BedAllocationFormProps {
  bed?: Bed;
  beds?: Bed[];
  patients: Patient[];
  onSubmit: (data: BedAllocationFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<BedAllocation>;
}

export function BedAllocationForm({
  bed,
  beds,
  patients,
  onSubmit,
  onCancel,
  defaultValues,
}: BedAllocationFormProps) {
  const form = useForm<BedAllocationFormData>({
    resolver: zodResolver(bedAllocationSchema),
    defaultValues: {
      bed_id: bed?.id || defaultValues?.bed_id || '',
      patient_id: defaultValues?.patient_id || '',
      visit_id: defaultValues?.visit_id || '',
      expected_discharge_date: defaultValues?.expected_discharge_date,
      notes: defaultValues?.notes || '',
    },
  });

  const handleSubmit = (data: BedAllocationFormData) => {
    onSubmit(data);
  };

  const selectedBed = bed || beds?.find((b) => b.id === form.watch('bed_id'));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!bed && beds && (
          <FormField
            control={form.control}
            name="bed_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {beds.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.bed_number} - {b.department} - Floor {b.floor} - Room{' '}
                        {b.room_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedBed && (
          <div className="p-4 rounded-md bg-muted space-y-2">
            <h4 className="font-medium">Bed Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Bed Number:</span>{' '}
                {selectedBed.bed_number}
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>{' '}
                {selectedBed.bed_type.replace('_', ' ').toUpperCase()}
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>{' '}
                {selectedBed.department}
              </div>
              <div>
                <span className="text-muted-foreground">Daily Rate:</span> $
                {selectedBed.daily_rate}
              </div>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
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

        <FormField
          control={form.control}
          name="visit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter visit ID" {...field} />
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
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Allocate Bed</Button>
        </div>
      </form>
    </Form>
  );
}
