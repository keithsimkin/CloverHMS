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
import { Income } from '@/types/models';
import { IncomeSource } from '@/types/enums';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const incomeSchema = z.object({
  income_source: z.nativeEnum(IncomeSource),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  income_date: z.date(),
  description: z.string().min(1, 'Description is required'),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  income?: Income;
  onSubmit: (data: IncomeFormData) => void;
  onCancel: () => void;
}

export function IncomeForm({ income, onSubmit, onCancel }: IncomeFormProps) {
  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      income_source: income?.income_source || IncomeSource.CONSULTATION,
      amount: income?.amount || 0,
      income_date: income?.income_date ? new Date(income.income_date) : new Date(),
      description: income?.description || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="income_source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Income Source</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={IncomeSource.CONSULTATION}>Consultation</SelectItem>
                    <SelectItem value={IncomeSource.PROCEDURE}>Procedure</SelectItem>
                    <SelectItem value={IncomeSource.PHARMACY}>Pharmacy</SelectItem>
                    <SelectItem value={IncomeSource.LABORATORY}>Laboratory</SelectItem>
                    <SelectItem value={IncomeSource.BED_CHARGES}>Bed Charges</SelectItem>
                    <SelectItem value={IncomeSource.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="income_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Income Date</FormLabel>
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
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the income..."
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
            {income ? 'Update Income' : 'Record Income'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
