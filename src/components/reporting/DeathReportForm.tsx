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
import { Checkbox } from '@/components/ui/checkbox';
import { DeathReport, Patient, Staff } from '@/types/models';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const deathReportSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  death_date: z.date(),
  death_time: z.string().min(1, 'Death time is required'),
  cause_of_death: z.string().min(1, 'Cause of death is required'),
  place_of_death: z.string().min(1, 'Place of death is required'),
  certifying_physician_id: z.string().min(1, 'Certifying physician is required'),
  autopsy_required: z.boolean(),
  certificate_number: z.string().optional(),
});

type DeathReportFormData = z.infer<typeof deathReportSchema>;

interface DeathReportFormProps {
  report?: DeathReport;
  patients: Patient[];
  physicians: Staff[];
  onSubmit: (data: DeathReportFormData) => void;
  onCancel: () => void;
}

export function DeathReportForm({
  report,
  patients,
  physicians,
  onSubmit,
  onCancel,
}: DeathReportFormProps) {
  const form = useForm<DeathReportFormData>({
    resolver: zodResolver(deathReportSchema),
    defaultValues: {
      patient_id: report?.patient_id || '',
      death_date: report?.death_date ? new Date(report.death_date) : new Date(),
      death_time: report?.death_time || '',
      cause_of_death: report?.cause_of_death || '',
      place_of_death: report?.place_of_death || '',
      certifying_physician_id: report?.certifying_physician_id || '',
      certificate_number: report?.certificate_number || '',
      autopsy_required: report?.autopsy_required || false,
    },
  });

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
            name="death_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Death Date</FormLabel>
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
            name="death_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Death Time</FormLabel>
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
          name="cause_of_death"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause of Death</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the cause of death..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="place_of_death"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Death</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ICU, Ward 3, Emergency Room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certifying_physician_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifying Physician</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select physician" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {physicians.map((physician) => (
                    <SelectItem key={physician.id} value={physician.id}>
                      Dr. {physician.first_name} {physician.last_name}
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
          name="certificate_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="DEATH-2024-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="autopsy_required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Autopsy Required</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Check if an autopsy is required for this case
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {report ? 'Update Report' : 'Create Report'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
