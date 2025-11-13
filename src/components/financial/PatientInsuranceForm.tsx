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
import { PatientInsurance, InsuranceProvider } from '@/types/models';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const patientInsuranceSchema = z.object({
  provider_id: z.string().min(1, 'Insurance provider is required'),
  policy_number: z.string().min(1, 'Policy number is required'),
  coverage_amount: z.number().min(0, 'Coverage amount must be positive'),
  expiry_date: z.date(),
  is_active: z.boolean(),
});

type PatientInsuranceFormData = z.infer<typeof patientInsuranceSchema>;

interface PatientInsuranceFormProps {
  insurance?: PatientInsurance;
  providers: InsuranceProvider[];
  onSubmit: (data: PatientInsuranceFormData) => void;
  onCancel: () => void;
}

export function PatientInsuranceForm({
  insurance,
  providers,
  onSubmit,
  onCancel,
}: PatientInsuranceFormProps) {
  const form = useForm<PatientInsuranceFormData>({
    resolver: zodResolver(patientInsuranceSchema),
    defaultValues: {
      provider_id: insurance?.provider_id || '',
      policy_number: insurance?.policy_number || '',
      coverage_amount: insurance?.coverage_amount || 0,
      expiry_date: insurance?.expiry_date ? new Date(insurance.expiry_date) : new Date(),
      is_active: insurance?.is_active ?? true,
    },
  });

  const handleSubmit = (data: PatientInsuranceFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="provider_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Provider</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers
                    .filter((p) => p.is_active)
                    .map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
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
          name="policy_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy Number</FormLabel>
              <FormControl>
                <Input placeholder="POL-123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverage_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coverage Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
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
          name="expiry_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {insurance ? 'Update Insurance' : 'Add Insurance'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
