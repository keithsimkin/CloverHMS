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
import { OperationReport, Patient, Staff } from '@/types/models';
import { OperationOutcome } from '@/types/enums';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const operationReportSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  operation_type: z.string().min(1, 'Operation type is required'),
  operation_date: z.date(),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  surgeon_id: z.string().min(1, 'Surgeon is required'),
  anesthetist_id: z.string().min(1, 'Anesthetist is required'),
  operation_theater: z.string().min(1, 'Operation theater is required'),
  pre_operative_diagnosis: z.string().min(1, 'Pre-operative diagnosis is required'),
  post_operative_diagnosis: z.string().min(1, 'Post-operative diagnosis is required'),
  procedure_performed: z.string().min(1, 'Procedure performed is required'),
  outcome: z.nativeEnum(OperationOutcome),
  complications: z.string().optional(),
  notes: z.string().optional(),
});

type OperationReportFormData = z.infer<typeof operationReportSchema>;

interface OperationReportFormProps {
  report?: OperationReport;
  patients: Patient[];
  surgeons: Staff[];
  anesthetists: Staff[];
  onSubmit: (data: OperationReportFormData) => void;
  onCancel: () => void;
}

export function OperationReportForm({
  report,
  patients,
  surgeons,
  anesthetists,
  onSubmit,
  onCancel,
}: OperationReportFormProps) {
  const form = useForm<OperationReportFormData>({
    resolver: zodResolver(operationReportSchema),
    defaultValues: {
      patient_id: report?.patient_id || '',
      operation_type: report?.operation_type || '',
      operation_date: report?.operation_date ? new Date(report.operation_date) : new Date(),
      start_time: report?.start_time || '',
      end_time: report?.end_time || '',
      surgeon_id: report?.surgeon_id || '',
      anesthetist_id: report?.anesthetist_id || '',
      operation_theater: report?.operation_theater || '',
      pre_operative_diagnosis: report?.pre_operative_diagnosis || '',
      post_operative_diagnosis: report?.post_operative_diagnosis || '',
      procedure_performed: report?.procedure_performed || '',
      outcome: report?.outcome || OperationOutcome.SUCCESSFUL,
      complications: report?.complications || '',
      notes: report?.notes || '',
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
            name="operation_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operation Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Appendectomy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operation_theater"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operation Theater</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., OT-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="operation_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Operation Date</FormLabel>
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
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="surgeon_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surgeon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surgeon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {surgeons.map((surgeon) => (
                      <SelectItem key={surgeon.id} value={surgeon.id}>
                        Dr. {surgeon.first_name} {surgeon.last_name}
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
            name="anesthetist_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anesthetist</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select anesthetist" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {anesthetists.map((anesthetist) => (
                      <SelectItem key={anesthetist.id} value={anesthetist.id}>
                        Dr. {anesthetist.first_name} {anesthetist.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pre_operative_diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-operative Diagnosis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Diagnosis before operation..."
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
          name="post_operative_diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post-operative Diagnosis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Diagnosis after operation..."
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
          name="procedure_performed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedure Performed</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the procedure..."
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
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outcome</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={OperationOutcome.SUCCESSFUL}>Successful</SelectItem>
                  <SelectItem value={OperationOutcome.COMPLICATIONS}>Complications</SelectItem>
                  <SelectItem value={OperationOutcome.FAILED}>Failed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complications (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any complications..."
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes..."
                  {...field}
                  rows={2}
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
            {report ? 'Update Report' : 'Create Report'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
