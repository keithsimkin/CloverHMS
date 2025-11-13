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
import { BirthReport, Patient, Staff } from '@/types/models';
import { Gender, DeliveryType } from '@/types/enums';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const birthReportSchema = z.object({
  mother_patient_id: z.string().min(1, 'Mother is required'),
  baby_name: z.string().min(1, 'Baby name is required'),
  baby_gender: z.nativeEnum(Gender),
  birth_date: z.date(),
  birth_time: z.string().min(1, 'Birth time is required'),
  birth_weight_kg: z.number().min(0.1, 'Birth weight must be positive'),
  birth_length_cm: z.number().min(1, 'Birth length must be positive'),
  delivery_type: z.nativeEnum(DeliveryType),
  attending_physician_id: z.string().min(1, 'Attending physician is required'),
  complications: z.string().optional(),
  certificate_number: z.string().optional(),
});

type BirthReportFormData = z.infer<typeof birthReportSchema>;

interface BirthReportFormProps {
  report?: BirthReport;
  patients: Patient[];
  physicians: Staff[];
  onSubmit: (data: BirthReportFormData) => void;
  onCancel: () => void;
}

export function BirthReportForm({
  report,
  patients,
  physicians,
  onSubmit,
  onCancel,
}: BirthReportFormProps) {
  const form = useForm<BirthReportFormData>({
    resolver: zodResolver(birthReportSchema),
    defaultValues: {
      mother_patient_id: report?.mother_patient_id || '',
      baby_name: report?.baby_name || '',
      baby_gender: report?.baby_gender || Gender.MALE,
      birth_date: report?.birth_date ? new Date(report.birth_date) : new Date(),
      birth_time: report?.birth_time || '',
      birth_weight_kg: report?.birth_weight_kg || 0,
      birth_length_cm: report?.birth_length_cm || 0,
      delivery_type: report?.delivery_type || DeliveryType.NORMAL,
      attending_physician_id: report?.attending_physician_id || '',
      complications: report?.complications || '',
      certificate_number: report?.certificate_number || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mother_patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mother" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients
                    .filter((p) => p.gender === Gender.FEMALE)
                    .map((patient) => (
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
            name="baby_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baby Name</FormLabel>
                <FormControl>
                  <Input placeholder="Baby name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baby_gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baby Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Male</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>
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
            name="birth_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Birth Date</FormLabel>
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
            name="birth_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Time</FormLabel>
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
            name="birth_weight_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Weight (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="3.5" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_length_cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Length (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="50" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="delivery_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={DeliveryType.NORMAL}>Normal</SelectItem>
                  <SelectItem value={DeliveryType.CESAREAN}>Cesarean</SelectItem>
                  <SelectItem value={DeliveryType.ASSISTED}>Assisted</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attending_physician_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attending Physician</FormLabel>
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
                <Input placeholder="BIRTH-2024-001" {...field} />
              </FormControl>
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
            {report ? 'Update Report' : 'Create Report'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
